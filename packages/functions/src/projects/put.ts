import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type ProjectUpdate = {
  projectId: string;
  projectName: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as ProjectUpdate[];

  if (!Array.isArray(input) || input.length === 0) {
    return badRequest("no project to update");
  }

  if (input.some((project) => !project?.projectId || !project.projectName)) {
    return badRequest("invalid parameters");
  }

  const ids = new Set(input.map((project) => project.projectId));
  if (ids.size !== input.length) return badRequest("duplicate projectId");

  // Order is taken from the array, so indexes are always unique and sequential.
  await Promise.all(
    input.map((project, projectIndex) =>
      dynamo.update({
        TableName: Resource.ProjectPhotos.name,
        Key: { projectId: project.projectId },
        UpdateExpression: "set projectName = :pn, projectIndex = :pi",
        ConditionExpression: "attribute_exists(projectId)",
        ExpressionAttributeValues: {
          ":pn": project.projectName,
          ":pi": projectIndex,
        },
      }),
    ),
  );

  return json(200);
};
