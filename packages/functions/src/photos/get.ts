import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const projectId = event.pathParameters?.projectId;
  if (!projectId) return badRequest("projectId is missing");

  const results = await dynamo.get({
    TableName: Resource.ProjectPhotos.name,
    Key: { projectId },
  });

  if (!results.Item) return json(404, { error: "Project does not exist" });

  return json(200, results.Item);
};
