import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type PasswordChange = {
  username: string;
  password: string;
  newPassword: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as PasswordChange;

  if (!input.username || !input.password || !input.newPassword) {
    return badRequest("invalid parameters");
  }

  const results = await dynamo.get({
    TableName: Resource.Users.name,
    Key: { username: input.username },
  });

  if (!results.Item) return badRequest("Username does not exist");

  if (!(await bcrypt.compare(input.password, results.Item.password))) {
    return badRequest("Incorrect password");
  }

  const hash = await bcrypt.hash(input.newPassword, 10);

  await dynamo.update({
    TableName: Resource.Users.name,
    Key: { username: input.username },
    UpdateExpression: "SET #password = :password",
    ExpressionAttributeNames: { "#password": "password" },
    ExpressionAttributeValues: { ":password": hash },
  });

  return json(200);
};
