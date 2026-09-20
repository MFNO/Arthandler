import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type ConfirmUpload = {
  key: string;
};

const publicUrl = (key: string) =>
  `https://${Resource.Photos.name}.s3.${process.env.AWS_REGION}.amazonaws.com/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const projectId = event.pathParameters?.projectId;
  if (!projectId) return badRequest("projectId is missing");
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as ConfirmUpload;

  if (!input.key) return badRequest("key is required");
  if (!input.key.startsWith(`${projectId}/`)) {
    return badRequest("key does not belong to this project");
  }

  const url = publicUrl(input.key);

  try {
    await dynamo.update({
      TableName: Resource.ProjectPhotos.name,
      Key: { projectId },
      UpdateExpression:
        "SET #photos = list_append(if_not_exists(#photos, :empty), :new)",
      ConditionExpression: "attribute_exists(projectId)",
      ExpressionAttributeNames: { "#photos": "Photos" },
      ExpressionAttributeValues: { ":empty": [], ":new": [{ url }] },
    });
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return json(404, { error: "Project does not exist" });
    }
    throw error;
  }

  return json(200, { url });
};
