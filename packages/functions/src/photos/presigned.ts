import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

if (!process.env.BUCKET_NAME)
  throw new Error("Environment variable Bucket name is required.");

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  if (!event || !event.body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        StatusCode: 400,
        Error: "body is missing or is missing the correct parameters ",
      }),
    };
  }

  const input: Input = JSON.parse(event.body);

  if (!input || !input.number || !input.projectId) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ StatusCode: 400, Error: "invalid parameters" }),
    };
  }

  console.log("Event is", JSON.stringify(event, null, 2));
  try {
    const number = input.number;
    const urls = [];
    const s3 = new S3();
    for (let x = 0; x < number; x++) {
      const presignedPost = s3.getSignedUrl("putObject", {
        Bucket: process.env.BUCKET_NAME,
        Key: uuidv4(), //filename
        Expires: 100, //time to expire in seconds
        ContentType: "image/*",
      });
      urls.push(presignedPost);
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urls,
      }),
    };
  } catch (error: unknown) {
    console.log("ERROR is:", error);
    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ error: JSON.stringify(error) }),
    };
  }
}
