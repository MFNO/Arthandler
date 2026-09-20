import { SignJWT, jwtVerify } from "jose";
import { Resource } from "sst";

const ALG = "HS256";
const secret = new TextEncoder().encode(Resource.JwtSecret.value);

export const signToken = (username: string) =>
  new SignJWT({})
    .setProtectedHeader({ alg: ALG })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);

export const verifyToken = (token: string) =>
  jwtVerify(token, secret, { algorithms: [ALG] });
