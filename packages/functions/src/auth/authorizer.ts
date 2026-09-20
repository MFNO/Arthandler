import type { APIGatewayRequestSimpleAuthorizerHandlerV2 } from "aws-lambda";
import { verifyToken } from "./jwt";

export const handler: APIGatewayRequestSimpleAuthorizerHandlerV2 = async (
  event,
) => {
  const header = event.headers?.authorization ?? event.headers?.Authorization;
  const token = header?.replace(/^Bearer /i, "").trim();

  if (!token) return { isAuthorized: false };

  try {
    await verifyToken(token);
    return { isAuthorized: true };
  } catch {
    return { isAuthorized: false };
  }
};
