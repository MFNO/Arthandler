import type { APIGatewayRequestSimpleAuthorizerHandlerV2WithContext } from "aws-lambda";
import { verifyToken } from "./jwt";

type AuthContext = {
  username: string;
};

export const handler: APIGatewayRequestSimpleAuthorizerHandlerV2WithContext<
  AuthContext
> = async (event) => {
  const header = event.headers?.authorization ?? event.headers?.Authorization;
  const token = header?.replace(/^Bearer /i, "").trim();

  if (!token) return { isAuthorized: false, context: { username: "" } };

  try {
    const { payload } = await verifyToken(token);
    return {
      isAuthorized: true,
      context: { username: payload.sub ?? "" },
    };
  } catch {
    return { isAuthorized: false, context: { username: "" } };
  }
};
