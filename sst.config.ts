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
    // No placeholder on purpose: the repo is public, so a fallback value would
    // be a published signing key. Deploys fail until the secret is set with:
    //   npx sst secret set JwtSecret "$(openssl rand -hex 32)" --stage <stage>
    const jwtSecret = new sst.Secret("JwtSecret");

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
      transform: {
        // defaultRouteSettings rather than per-route settings: the stage is
        // created before the routes exist, so API Gateway rejects routeSettings
        // that name a route key it can't find yet. Both routes on this API are
        // auth endpoints and want the same limit anyway.
        stage: (args: aws.apigatewayv2.StageArgs) => {
          args.defaultRouteSettings = {
            throttlingBurstLimit: 5,
            throttlingRateLimit: 1,
          };
        },
      },
    });

    const usersAuthorizer = usersApi.addAuthorizer({
      name: "jwt",
      lambda: {
        function: {
          handler: "packages/functions/src/auth/authorizer.handler",
          link: [jwtSecret],
        },
        response: "simple",
      },
    });

    usersApi.route("POST /login", "packages/functions/src/login/post.handler");
    usersApi.route(
      "POST /password",
      "packages/functions/src/password/post.handler",
      { auth: { lambda: usersAuthorizer.id } },
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
