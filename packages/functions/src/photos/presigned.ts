import { randomUUID } from "node:crypto";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";
import { badRequest, json } from "../response";

const s3 = new S3Client({});

type PresignRequest = {
  number: number;
  projectId: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return badRequest("body is missing");

  const input = JSON.parse(event.body) as PresignRequest;

  if (!input.number || !input.projectId) return badRequest("invalid parameters");

  try {
    const urls = await Promise.all(
      Array.from({ length: input.number }, () =>
        getSignedUrl(
          s3,
          new PutObjectCommand({
            Bucket: Resource.Photos.name,
            Key: randomUUID(),
            ContentType: "image/*",
          }),
          { expiresIn: 100 },
        ),
      ),
    );

    return json(200, { urls });
  } catch (error: unknown) {
    console.error("Failed to presign upload urls", error);
    return badRequest(
      error instanceof Error ? error.message : "could not presign urls",
    );
  }
};
