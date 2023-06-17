import { Api, StaticSite, StackContext, Table } from "sst/constructs";

export function DevStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "ProjectPhotos", {
    fields: {
      ProjectName: "string",
    },
    primaryIndex: { partitionKey: "ProjectName" },
  });



  // Create the HTTP API
  const api = new Api(stack, "ProjectPhotosApi", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "POST /": "packages/functions/src/lambda.handler",
    },
  });

  // Deploy our React app
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_API_URL: api.url,
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });

}
