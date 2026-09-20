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

// Compared against when the user doesn't exist purely so both paths cost the
// same. The result is discarded — the `!results.Item` check below decides.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8._VGrLZ0ZMUHRdWvtBRNjCLLGa.Uy";

const LOCK_AFTER = 5;
const BASE_LOCK_MS = 60_000;
const MAX_LOCK_MS = 15 * 60_000;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as Credentials;

  if (!input.username || !input.password) return badRequest("invalid parameters");

  const results = await dynamo.get({
    TableName: Resource.Users.name,
    Key: { username: input.username },
  });

  const lockedUntil = (results.Item?.lockedUntil as number | undefined) ?? 0;
  if (lockedUntil > Date.now()) {
    return json(429, {
      error: "Too many failed attempts, try again later",
      retryAfter: Math.ceil((lockedUntil - Date.now()) / 1000),
    });
  }

  const isAuthenticated = await bcrypt.compare(
    input.password,
    (results.Item?.password as string | undefined) ?? DUMMY_HASH,
  );

  if (!results.Item || !isAuthenticated) {
    if (results.Item) {
      const failedAttempts =
        ((results.Item.failedAttempts as number | undefined) ?? 0) + 1;
      const over = failedAttempts - LOCK_AFTER;

      await dynamo.update({
        TableName: Resource.Users.name,
        Key: { username: input.username },
        UpdateExpression:
          "SET failedAttempts = :attempts, lockedUntil = :lockedUntil",
        ExpressionAttributeValues: {
          ":attempts": failedAttempts,
          ":lockedUntil":
            over >= 0
              ? Date.now() +
                Math.min(BASE_LOCK_MS * 2 ** over, MAX_LOCK_MS)
              : 0,
        },
      });
    }

    return json(401, { error: "Incorrect username or password" });
  }

  if (results.Item.failedAttempts) {
    await dynamo.update({
      TableName: Resource.Users.name,
      Key: { username: input.username },
      UpdateExpression: "SET failedAttempts = :zero, lockedUntil = :zero",
      ExpressionAttributeValues: { ":zero": 0 },
    });
  }

  return json(200, { token: await signToken(input.username) });
};
