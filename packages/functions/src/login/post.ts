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

  //generate hash
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(input.password, salt);
  console.log("hash", hash);
  //check queried hash
  const results = await dynamoDb.get(getParams).promise();
  const check = bcrypt.compareSync(input.password, results.Item.password);
  console.log(check);
  return {
    statusCode: 200,
    body: check,
  };
};
