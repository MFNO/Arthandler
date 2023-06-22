import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
const bcrypt = require("bcrypt");

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

  const saltRounds = 10;
  const password = "Admin@123";

  const test = bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("Salt: ", salt);
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      console.log("Hash: ", hash);
    })
    .catch((err) => console.error(err.message));

  console.log(test);

  const getParams = {
    TableName: Table.Users.tableName,
    Key: {
      username: input.username,
    },
  };
  console.log(getParams);
  const results = await dynamoDb.get(getParams).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(results.Item),
  };
};
