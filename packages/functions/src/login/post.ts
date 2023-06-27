import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
var bcrypt = require("bcryptjs");

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

  if (!input || !input.username || !input.password) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ StatusCode: 400, Error: "invalid parameters" }),
    };
  }

  console.log(input);

  const getParams = {
    TableName: Table.Users.tableName,
    Key: {
      username: input.username,
    },
  };
  console.log(getParams);

  //check queried hash
  const results = await dynamoDb.get(getParams).promise();


  if (!results.Item) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        StatusCode: 400,
        Error: "Username does not exist",
      }),
    };
  }

  const check = bcrypt.compareSync(input.password, results.Item.password);

  return {
    statusCode: 200,
    body: JSON.stringify({ isAuthenticated: check }),
  };
};
