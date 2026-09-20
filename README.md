# Arthandler
## Description
Photography website designed to display photographs in a simple manner.
## Features
### Website
The public facing website itself is fairly simple, it's a static React app displaying images in a carousel.
### Management Portal
The interesting feature is the management portal.

The photographer is able to log-in using OAuth and dynamically add:
1. New projects
2. Photos to that project
3. The order of the photos
4. Contact informatoin
# Technologies
## Front-End

React 19 on Vite, written in TypeScript.

The UI is built entirely with [Ant Design](https://ant.design) components, themed through
`ConfigProvider` in `packages/frontend/src/theme.ts`.
## Back-End
The back-end runs on AWS and is defined with [SST v4](https://sst.dev) in `sst.config.ts`.

API Gateway HTTP APIs front Lambda handlers that read and write DynamoDB via the AWS SDK v3.

Images are stored in S3 and uploaded directly from the browser using presigned URLs.

Handlers reach linked resources through SST's `Resource` object rather than environment
variables — `Resource.Users.name`, `Resource.Photos.name`, and so on.
## Authentication
This app is designed to only be used by one person (for now).

So the app is built on a simple login-only system.

# Running it

The AWS profile is set in `sst.config.ts` (`ArtHandlerDev`) and must exist locally.

```bash
npm install
npm run dev      # sst dev on your personal stage
npm run deploy   # deploy the shared dev stage
npm run diff     # preview infra changes to the dev stage
npm run remove   # tear the dev stage down
```

`npm run dev` deliberately passes no `--stage`, so it uses your personal stage (the name in
`.sst/stage`) and stays isolated from the shared `dev` stage that `npm run deploy` targets.

SST has no offline mode. `sst dev` still creates real AWS resources in your stage — but the
Lambda handlers run on your machine (a stub is deployed in their place) and the React site is
served by a local Vite process rather than being deployed.

To work on the frontend alone, skip SST entirely and point Vite at an already-deployed stage:

```bash
cd packages/frontend
VITE_APP_PROJECTS_API_URL=<ProjectsApi url> VITE_APP_USERS_API_URL=<UsersApi url> npm run dev
```

Deployed URLs for a stage are written to `.sst/outputs.json`.

`Resource` types used by the Lambda handlers are generated into `sst-env.d.ts` by `sst dev` or
`sst deploy`. Before the first deploy `npm run typecheck` reports unknown properties on
`Resource` in `packages/functions` — `sst diff` alone generates the file but leaves it empty.

## References
https://sst.dev/docs/component/aws/static-site/

https://ant.design/components/overview/

https://vitejs.dev/guide/
