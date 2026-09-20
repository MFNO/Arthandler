import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type Credentials = {
  username: string;
  password: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as Credentials;

  if (!input.username || !input.password) return badRequest("invalid parameters");

  const results = await dynamo.get({
    TableName: Resource.Users.name,
    Key: { username: input.username },
  });

  if (!results.Item) return badRequest("Username does not exist");

  const isAuthenticated = await bcrypt.compare(
    input.password,
    results.Item.password,
  );

  return json(200, { isAuthenticated });
};
