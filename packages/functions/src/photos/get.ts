import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  console.log(event);
  const getParams = {
    // Get the table name from the environment variable
    TableName: Table.ProjectPhotos.tableName,
    // Get the row where the counter is called "hits"
    Key: {
      ProjectName: event.pathParameters.ProjectId,
    },
  };
  console.log(getParams);

  const results = await dynamoDb.get(getParams).promise();
  console.log(results);
  return {
    statusCode: 200,
    body: JSON.stringify(results.Item),
  };
};
