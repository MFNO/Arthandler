import { randomUUID } from "node:crypto";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import { badRequest, json } from "../response";

const s3 = new S3Client({});

type PresignRequest = {
  projectId: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as PresignRequest;

  if (!input.projectId) return badRequest("projectId is required");

  const key = `${input.projectId}/${randomUUID()}`;

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: Resource.Photos.name,
      Key: key,
      ContentType: "image/*",
    }),
    { expiresIn: 300 },
  );

  return json(200, { url, key });
};
