import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    console.log(event)
    const getParams = {
        TableName: Table.Users.tableName,
        Key: {
            projectId: event.pathParameters?.projectId,
        },
    };

    const results = await dynamoDb.get(getParams).promise();
    return {
        statusCode: 200,
        body: JSON.stringify(results.Item),
    };
};
