import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler() {
  const params = {
    TableName: Table.ProjectPhotos.tableName,
    ProjectionExpression: "ProjectName",
  };
  const results = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };
}
