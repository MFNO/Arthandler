import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type ReorderRequest = {
  urls: string[];
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const projectId = event.pathParameters?.projectId;
  if (!projectId) return badRequest("projectId is missing");
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as ReorderRequest;

  if (!Array.isArray(input.urls)) return badRequest("urls must be an array");

  const existing = await dynamo.get({
    TableName: Resource.ProjectPhotos.name,
    Key: { projectId },
  });

  if (!existing.Item) return json(404, { error: "Project does not exist" });

  const current = ((existing.Item.Photos ?? []) as { url: string }[]).map(
    (photo) => photo.url,
  );

  // Only a permutation of what's already stored is accepted, so this can't be
  // used to add, drop, or inject photos.
  const isReordering =
    current.length === input.urls.length &&
    [...current].sort().join("\n") === [...input.urls].sort().join("\n");

  if (!isReordering) {
    return badRequest("urls must be a reordering of the existing photos");
  }

  const Photos = input.urls.map((url) => ({ url }));

  await dynamo.update({
    TableName: Resource.ProjectPhotos.name,
    Key: { projectId },
    UpdateExpression: "SET #photos = :photos",
    ConditionExpression: "attribute_exists(projectId)",
    ExpressionAttributeNames: { "#photos": "Photos" },
    ExpressionAttributeValues: { ":photos": Photos },
  });

  return json(200, { Photos });
};
