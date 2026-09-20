import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type ProjectUpdate = {
  projectId: string;
  projectName: string;
  projectIndex: number;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as ProjectUpdate[];

  if (!Array.isArray(input) || input.length === 0) {
    return badRequest("no project to update");
  }

  const invalid = input.some(
    (project) =>
      !project?.projectId || !project.projectName || project.projectIndex < 0,
  );
  if (invalid) return badRequest("invalid parameters");

  await Promise.all(
    input.map((project) =>
      dynamo.update({
        TableName: Resource.ProjectPhotos.name,
        Key: { projectId: project.projectId },
        UpdateExpression: "set projectName = :pn, projectIndex = :pi",
        ExpressionAttributeValues: {
          ":pn": project.projectName,
          ":pi": project.projectIndex,
        },
      }),
    ),
  );

  return json(200);
};
