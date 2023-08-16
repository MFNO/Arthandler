import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { S3 } from "aws-sdk";
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

  if (!input || !input.number) {
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
    const fileType = "image/png";
    const filePath = generateId();
    const urls = [];
    for (let x = 0; x < number; x++) {
      const presignedPost = await createPresignedPost({ fileType, filePath });
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

type GetPresignedPostUrlParams = {
  fileType: string;
  filePath: string;
};

function createPresignedPost({
  fileType,
  filePath,
}: GetPresignedPostUrlParams): Promise<S3.PresignedPost> {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Fields: { key: filePath, acl: "public-read" },
    Conditions: [
      // content length restrictions: 0-1MB]
      ["content-length-range", 0, 1000000],
      // specify content-type to be more generic- images only
      // ['starts-with', '$Content-Type', 'image/'],
      ["eq", "$Content-Type", fileType],
    ],
    // number of seconds for which the presigned policy should be valid
    Expires: 30,
  };

  const s3 = new S3();
  return s3.createPresignedPost(params) as unknown as Promise<S3.PresignedPost>;
}

function generateId() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!-.*()";
  const length = 10;

  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `${date}_${result}`;
}
