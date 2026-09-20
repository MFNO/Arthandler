import { randomUUID } from "node:crypto";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type NewProject = {
  projectName: string;
  projectIndex: number;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as NewProject;

  if (!input.projectName || typeof input.projectIndex !== "number") {
    return badRequest("invalid parameters");
  }

  const projectId = randomUUID();

  await dynamo.put({
    TableName: Resource.ProjectPhotos.name,
    Item: {
      projectId,
      projectName: input.projectName,
      projectIndex: input.projectIndex,
    },
  });

  return json(200, { projectId });
};
