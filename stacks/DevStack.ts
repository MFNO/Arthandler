import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { Api, StaticSite, StackContext, Table, Bucket } from "sst/constructs";

export function DevStack({ stack }: StackContext) {
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
          ignorePublicAcls: true,
        },
      },
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
