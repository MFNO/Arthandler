import type { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
import bcrypt from "bcryptjs";
import { Resource } from "sst";
import { dynamo } from "../dynamo";
import { badRequest, json } from "../response";

type PasswordChange = {
  password: string;
  newPassword: string;
};

const MIN_PASSWORD_LENGTH = 12;

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<{
  username: string;
}> = async (event) => {
  // The account is taken from the verified token, never from the request body,
  // so one user can't target another.
  const username = event.requestContext.authorizer?.lambda?.username;
  if (!username) return json(401, { error: "Unauthorized" });

  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as PasswordChange;

  if (!input.password || !input.newPassword) {
    return badRequest("invalid parameters");
  }

  if (input.newPassword.length < MIN_PASSWORD_LENGTH) {
    return badRequest(
      `new password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    );
  }

  const results = await dynamo.get({
    TableName: Resource.Users.name,
    Key: { username },
  });

  if (!results.Item) return json(401, { error: "Unauthorized" });

  if (!(await bcrypt.compare(input.password, results.Item.password))) {
    return badRequest("Incorrect password");
  }

  await dynamo.update({
    TableName: Resource.Users.name,
    Key: { username },
    UpdateExpression:
      "SET #password = :password, failedAttempts = :zero, lockedUntil = :zero",
    ExpressionAttributeNames: { "#password": "password" },
    ExpressionAttributeValues: {
      ":password": await bcrypt.hash(input.newPassword, 10),
      ":zero": 0,
    },
  });

  return json(200);
};
