import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { v4 as uuidv4 } from 'uuid';

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

    if (!input || !input.projectName || !input.projectIndex) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ StatusCode: 400, Error: "invalid parameters" }),
        };
    }

    console.log(input);


    const putParams: DocumentClient.PutItemInput = {
        TableName: Table.ProjectPhotos.tableName,
        Item: {
            'projectId': uuidv4(),
            'projectName': input.projectName,
            'projectIndex': input.projectIndex,
        }
    };
    await dynamoDb.put(putParams).promise();

    return {
        statusCode: 200,
    };
};
