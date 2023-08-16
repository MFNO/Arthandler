import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import {
  Api,
  StaticSite,
  StackContext,
  Table,
  Bucket,
  Function,
} from "sst/constructs";

export function DevStack({ stack }: StackContext) {
  //Create bucket to host photos
  const photoBucket = new Bucket(stack, "Photos", {
    cdk: {
      bucket: {
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: false,
          restrictPublicBuckets: false,
          ignorePublicAcls: true,
        },
      },
    },
    name: stack.stage + "-arthandler-photos",
    cors: [
      {
        allowedMethods: ["GET", "POST", "PUT"],
        allowedOrigins: ["http://localhost:5173/"],
      },
    ],
  });

  // Create the table
  const projectsTable = new Table(stack, "ProjectPhotos", {
    cdk: {
      table: {
        tableName: stack.stage + "-projects",
      },
    },
    fields: {
      projectId: "string",
      projectName: "string",
      projectIndex: "number",
    },
    primaryIndex: { partitionKey: "projectId" },
  });

  const usersTable = new Table(stack, "Users", {
    cdk: {
      table: {
        tableName: stack.stage + "-users",
      },
    },
    fields: {
      username: "string",
      password: "string",
    },
    primaryIndex: { partitionKey: "username" },
  });

  const projectsApi = new Api(stack, "ProjectsApi", {
    defaults: {
      function: {
        bind: [projectsTable],
      },
    },
    routes: {
      "GET /projects": "packages/functions/src/projects/get.handler",
      "GET /projects/{projectId}/photos":
        "packages/functions/src/photos/get.handler",
      "POST /projects": "packages/functions/src/projects/post.handler",
      "PUT /projects": "packages/functions/src/projects/put.handler",
      "POST /projects/presigned": {
        function: {
          runtime: "nodejs16.x",
          memorySize: 1024,
          timeout: "25 seconds",
          handler: "packages/functions/src/photos/presigned.handler",
          environment: { BUCKET_NAME: photoBucket.bucketName },
          permissions: [photoBucket],
        },
      },
    },
    cors: {
      allowedMethods: ["GET", "PUT", "OPTIONS", "POST", "PATCH"],
      allowedOrigins: ["http://localhost:5173/"],
      allowHeaders: ["*"],
    },
  });

  const usersApi = new Api(stack, "UsersApi", {
    defaults: {
      function: {
        bind: [usersTable],
      },
    },
    routes: {
      "POST /login": "packages/functions/src/login/post.handler",
      "POST /password": "packages/functions/src/password/post.handler",
    },
    cors: {
      allowedMethods: ["GET", "PUT", "OPTIONS", "POST", "PATCH"],
      allowedOrigins: ["http://localhost:5173/"],
      allowHeaders: ["*"],
    },
  });

  //Attach permissions to bucket
  const permissions = new PolicyStatement({
    principals: [new AnyPrincipal()],
    actions: ["s3:GetObject", "s3:PutObject"],
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
      VITE_APP_PROJECTS_API_URL: projectsApi.url,
      VITE_APP_USERS_API_URL: usersApi.url,
    },
  });

  // Show data in the output
  stack.addOutputs({
    ProjectsApiEndpoint: projectsApi.url,
    UsersApiEndpoint: usersApi.url,
    BucketUrl: photoBucket.cdk.bucket.urlForObject(),
  });
}
