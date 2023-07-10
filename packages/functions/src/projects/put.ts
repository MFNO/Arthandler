import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  if (!event || !event.body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ StatusCode: 400, Error: "body is missing" }),
    };
  }

  const input: Input = JSON.parse(event.body);
  if (!input.length > 0) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ StatusCode: 400, Error: "no project to update" }),
    };
  }
  for (const project of input) {
    if (!project || !project.projectName || project.projectIndex < 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ StatusCode: 400, Error: "invalid parameters" }),
      };
    }

    console.log(project);

    const updateParams: DocumentClient.UpdateItemInput = {
      TableName: Table.ProjectPhotos.tableName,
      Key: { projectId: project.projectId },
      UpdateExpression: "set projectName = :pn, projectIndex = :pi",
      ExpressionAttributeValues: {
        ":pn": project.projectName,
        ":pi": project.projectIndex,
      },
    };
    await dynamoDb.update(updateParams).promise();
  }

  return {
    statusCode: 200,
  };
};
