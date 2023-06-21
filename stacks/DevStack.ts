import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { Api, StaticSite, StackContext, Table, Bucket } from "sst/constructs";

export function DevStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "ProjectPhotos", {
    cdk:
    {
      table: {
        tableName: stack.stage + "-projects"
      }
    },
    fields: {
      projectId: "string",
      projectName: "string",
      projectIndex: "number"
    },
    primaryIndex: { partitionKey: "projectId" },
  });

  // Create the HTTP API
  const api = new Api(stack, "ProjectsApi", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "GET /projects": "packages/functions/src/projects/get.handler",
      "GET /projects/{projectId}/photos":
        "packages/functions/src/photos/get.handler",
    },
  });

  //Create bucket to host photos
  const photoBucket = new Bucket(stack, "Photos", {
    cdk: {
      bucket: {
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          restrictPublicBuckets: false,
          ignorePublicAcls: true
        }
      }
    },
    name: "arthandler-photos",
    cors: [
      {
        allowedMethods: ["GET"],
        allowedOrigins: ["http://localhost:5173/"],
      },
    ],
  });

  //Attach permissions to bucket
  const permissions = new PolicyStatement({
    principals: [new AnyPrincipal()],
    actions: ["s3:GetObject"],
    effect: Effect.ALLOW,
    resources: [photoBucket.bucketArn + "/*"],
    conditions: {
      StringLike: {
        "aws:Referer": ["http://localhost:5173/*"],
      },
    },
  });

  photoBucket.cdk.bucket.addToResourcePolicy(permissions);
  // Deploy our React app
  new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    bind: [photoBucket],
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    BucketUrl: photoBucket.cdk.bucket.urlForObject(),
  });
}
