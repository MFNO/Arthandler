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

  if (!input || !input.username || !input.password || !input.newPassword) {
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
  if (!bcrypt.compareSync(input.password, results.Item.password)) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        StatusCode: 400,
        Error: "Incorrect password",
      }),
    };
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(input.newPassword, salt);
  console.log("hash", hash);
  const putParams = {
    TableName: Table.Users.tableName,
    Key: {
      username: input.username,
    },
    // Update the "password" column
    UpdateExpression: "SET password = :password",
    ExpressionAttributeValues: {
      ":password": hash,
    },
  };
  await dynamoDb.update(putParams).promise();

  return {
    statusCode: 200,
  };
};
