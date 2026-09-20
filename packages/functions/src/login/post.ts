import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import { Resource } from "sst";
import { signToken } from "../auth/jwt";
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

  const hash = results.Item?.password;

  // Always run a comparison so a missing user and a wrong password take the
  // same time and return the same response.
  const isAuthenticated = await bcrypt.compare(
    input.password,
    hash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin",
  );

  if (!hash || !isAuthenticated) {
    return json(401, { error: "Incorrect username or password" });
  }

  return json(200, { token: await signToken(input.username) });
};
