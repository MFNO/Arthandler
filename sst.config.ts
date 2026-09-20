/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "arthandler",
      home: "aws",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      providers: {
        aws: {
          region: "us-east-1",
          profile: "ArtHandlerDev",
        },
      },
    };
  },
  async run() {
    const photos = new sst.aws.Bucket("Photos", {
      access: "public",
      cors: {
        allowMethods: ["GET", "POST", "PUT"],
        allowOrigins: ["*"],
        allowHeaders: ["*"],
      },
    });

    const projects = new sst.aws.Dynamo("ProjectPhotos", {
      fields: { projectId: "string" },
      primaryIndex: { hashKey: "projectId" },
    });

    const users = new sst.aws.Dynamo("Users", {
      fields: { username: "string" },
      primaryIndex: { hashKey: "username" },
    });

    const projectsApi = new sst.aws.ApiGatewayV2("ProjectsApi", {
      link: [projects, photos],
      cors: {
        allowMethods: ["GET", "PUT", "POST", "PATCH"],
        allowOrigins: ["*"],
        allowHeaders: ["*"],
      },
    });

    projectsApi.route(
      "GET /projects",
      "packages/functions/src/projects/get.handler",
    );
    projectsApi.route(
      "POST /projects",
      "packages/functions/src/projects/post.handler",
    );
    projectsApi.route(
      "PUT /projects",
      "packages/functions/src/projects/put.handler",
    );
    projectsApi.route(
      "GET /projects/{projectId}/photos",
      "packages/functions/src/photos/get.handler",
    );
    projectsApi.route("POST /projects/presigned", {
      handler: "packages/functions/src/photos/presigned.handler",
      memory: "1024 MB",
      timeout: "25 seconds",
    });

    const usersApi = new sst.aws.ApiGatewayV2("UsersApi", {
      link: [users],
      cors: {
        allowMethods: ["GET", "PUT", "POST", "PATCH"],
        allowOrigins: ["*"],
        allowHeaders: ["*"],
      },
    });

    usersApi.route("POST /login", "packages/functions/src/login/post.handler");
    usersApi.route(
      "POST /password",
      "packages/functions/src/password/post.handler",
    );

    const site = new sst.aws.StaticSite("ReactSite", {
      path: "packages/frontend",
      build: {
        command: "npm run build",
        output: "dist",
      },
      environment: {
        VITE_APP_PROJECTS_API_URL: projectsApi.url,
        VITE_APP_USERS_API_URL: usersApi.url,
      },
    });

    return {
      ProjectsApi: projectsApi.url,
      UsersApi: usersApi.url,
      PhotoBucket: photos.name,
      Site: site.url,
    };
  },
});
