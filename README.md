# Arthandler
## Description
Photography website designed to display photographs in a simple manner.
## Features
### Website
The public facing website itself is fairly simple, it's a static React app displaying images in a carousel.
### Management Portal
The interesting feature is the management portal.

The photographer logs in with a username and password, and can dynamically add:
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
This app is designed to only be used by one person (for now), so there is no signup flow —
users are seeded directly into DynamoDB.

Passwords are stored as bcrypt hashes. `POST /login` returns a JWT (HS256, 12 hour expiry)
which the frontend keeps in `sessionStorage` and sends as a `Bearer` token.

The write routes (`POST`/`PUT /projects`, `/projects/presigned`, `POST /projects/{id}/photos`)
are protected by an API Gateway Lambda authorizer, so they are rejected at the gateway before
a handler runs. The read routes are public — it's a public gallery.

The JWT signing key is an `sst.Secret` with a placeholder so stages deploy without setup.
**Set a real one before exposing a stage publicly:**

```bash
npx sst secret set JwtSecret "$(openssl rand -hex 32)" --stage <stage>
```

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

## Creating a user

There's no signup flow, so the first user has to be written straight into the Users table.
Find the table name for the stage you're targeting:

```bash
aws dynamodb list-tables --profile ArtHandlerDev --region us-east-1
# arthandler-<stage>-UsersTable-xxxxxxxx
```

Generate a bcrypt hash and insert the row (run from `packages/functions` so `bcryptjs`
resolves):

```bash
cd packages/functions
HASH=$(node -e 'import("bcryptjs").then(b=>process.stdout.write(b.default.hashSync("YOUR_PASSWORD",10)))')
aws dynamodb put-item --profile ArtHandlerDev --region us-east-1 \
  --table-name arthandler-<stage>-UsersTable-xxxxxxxx \
  --item "{\"username\":{\"S\":\"YOUR_USERNAME\"},\"password\":{\"S\":\"$HASH\"}}"
```

Each stage has its own Users table, so a user seeded into your personal stage won't exist in
`dev`. Once a user exists, passwords can be changed through the app at `/password`, which
requires the current password.

## References
https://sst.dev/docs/component/aws/static-site/

https://ant.design/components/overview/

https://vitejs.dev/guide/
