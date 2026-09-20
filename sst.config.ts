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
    // Placeholder lets non-production stages deploy without a manual secret set.
    // Set a real one with: npx sst secret set JwtSecret "$(openssl rand -hex 32)"
    const jwtSecret = new sst.Secret("JwtSecret", "local-dev-secret-change-me");

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

    const authorizer = projectsApi.addAuthorizer({
      name: "jwt",
      lambda: {
        function: {
          handler: "packages/functions/src/auth/authorizer.handler",
          link: [jwtSecret],
        },
        response: "simple",
      },
    });

    const auth = { lambda: authorizer.id };

    // Public — the gallery is world readable.
    projectsApi.route(
      "GET /projects",
      "packages/functions/src/projects/get.handler",
    );
    projectsApi.route(
      "GET /projects/{projectId}/photos",
      "packages/functions/src/photos/get.handler",
    );

    // Authenticated — management only.
    projectsApi.route(
      "POST /projects",
      "packages/functions/src/projects/post.handler",
      { auth },
    );
    projectsApi.route(
      "PUT /projects",
      "packages/functions/src/projects/put.handler",
      { auth },
    );
    projectsApi.route(
      "POST /projects/{projectId}/photos",
      "packages/functions/src/photos/post.handler",
      { auth },
    );
    projectsApi.route(
      "PUT /projects/{projectId}/photos",
      "packages/functions/src/photos/put.handler",
      { auth },
    );
    projectsApi.route(
      "POST /projects/presigned",
      {
        handler: "packages/functions/src/photos/presigned.handler",
        memory: "1024 MB",
        timeout: "25 seconds",
      },
      { auth },
    );

    const usersApi = new sst.aws.ApiGatewayV2("UsersApi", {
      link: [users, jwtSecret],
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
