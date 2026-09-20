import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { json } from "../response";

export async function handler() {
  const results = await dynamo.scan({
    TableName: Resource.ProjectPhotos.name,
    ProjectionExpression: "projectId, projectName, projectIndex",
  });

  return json(200, results.Items ?? []);
}
