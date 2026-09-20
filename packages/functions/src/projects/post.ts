import { randomUUID } from "node:crypto";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type NewProject = {
  projectName: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as NewProject;

  if (!input.projectName) return badRequest("projectName is required");

  // The index is assigned server side so it can't collide with an existing one.
  const existing = await dynamo.scan({
    TableName: Resource.ProjectPhotos.name,
    ProjectionExpression: "projectIndex",
  });

  const projectIndex = (existing.Items ?? []).reduce(
    (next, item) =>
      typeof item.projectIndex === "number"
        ? Math.max(next, item.projectIndex + 1)
        : next,
    0,
  );

  const projectId = randomUUID();

  await dynamo.put({
    TableName: Resource.ProjectPhotos.name,
    Item: { projectId, projectName: input.projectName, projectIndex },
  });

  return json(200, { projectId, projectIndex });
};
