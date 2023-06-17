import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler() {
    const getParams = {
        // Get the table name from the environment variable
        TableName: Table.ProjectPhotos.tableName,
        // Get the row where the counter is called "clicks"
        Key: {
            ProjectName: "FirstProject",
        },
    };
    const results = await dynamoDb.get(getParams).promise();

    // If there is a row, then get the value of the
    // column called "tally"
    let index = results.Item ? results.Item.index : 0;

    return {
        statusCode: 200,
        body: index,
    };
}