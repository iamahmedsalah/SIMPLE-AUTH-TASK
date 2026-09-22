# Vercel Test Deployment Plan

## Target Architecture

Create two Vercel projects from the same repository:

```text
Browser -> web project -> /api/* rewrite -> API project -> MongoDB Atlas
                         all other paths -> Vite SPA index.html
```

Keeping `/api` same-origin preserves the existing frontend client and the HttpOnly, SameSite=Lax authentication cookie. The API project runs NestJS as a Vercel Function; the web project serves the Vite build.

## Phase 0: Preflight

1. Put the repository on a Git provider supported by Vercel.
2. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, and `pnpm build` locally.
3. Create separate test credentials: a MongoDB Atlas database user, a long random JWT secret, and SMTP credentials. Do not copy local or production secrets into source control.
4. Select a Vercel Function region close to the Atlas cluster.
5. Configure Atlas Network Access:
   - Preferred: enable Vercel Static IPs and allowlist only the assigned egress addresses.
   - Short-lived test fallback: temporarily allow wider access, retain TLS and strong database credentials, then remove the rule immediately after testing. Never treat `0.0.0.0/0` as a production setting.

`DNS_SERVERS` is a local resolver workaround and should initially be omitted on Vercel. Add it there only if deployment logs prove SRV DNS resolution is failing.

## Phase 1: Deploy the API First

Create a Vercel project named `northstar-auth-api` with:

| Setting         | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Root Directory  | `apps/api`                                                            |
| Framework       | NestJS / auto-detected                                                |
| Install Command | `pnpm install --frozen-lockfile`                                      |
| Build Command   | `pnpm --filter @fst/validation build && pnpm --filter @fst/api build` |
| Node.js         | 24.x (or 20.x/22.x if native Argon2 compatibility requires it)        |

Keep access to source files outside the Root Directory enabled because the API imports `packages/validation` and the workspace lockfile lives at repository root.

Set these API environment variables for Preview and Production as appropriate:

| Variable                                  | Test value or rule                                        |
| ----------------------------------------- | --------------------------------------------------------- |
| `NODE_ENV`                                | `production`                                              |
| `MONGODB_URI`                             | Atlas connection string secret                            |
| `JWT_SECRET`                              | Unique random value, at least 32 characters               |
| `JWT_EXPIRES_IN`                          | `15m`                                                     |
| `FRONTEND_URL`                            | Final stable web deployment URL                           |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP provider settings                                    |
| `SMTP_USER` / `SMTP_PASS`                 | SMTP secrets                                              |
| `SMTP_FROM`                               | Verified sender identity                                  |
| `SWAGGER_ENABLED`                         | `true` for the test deployment; disable later if unwanted |
| `LOG_LEVEL`                               | `info`                                                    |
| `COOKIE_NAME`                             | `fst_auth`                                                |

Do not set `PORT`; Vercel owns runtime port binding. Deploy, assign a stable project domain, and verify:

```text
GET https://<api-project>.vercel.app/api/v1/health
GET https://<api-project>.vercel.app/api/docs
```

Inspect Function logs for environment validation, MongoDB connection, native Argon2 loading, and SMTP failures before proceeding.

## Phase 2: Deploy the Web App

Create a second project named `northstar-auth-web` with:

| Setting          | Value                            |
| ---------------- | -------------------------------- |
| Root Directory   | `apps/web`                       |
| Framework        | Vite                             |
| Install Command  | `pnpm install --frozen-lockfile` |
| Build Command    | `pnpm --filter @fst/web build`   |
| Output Directory | `dist`                           |

Keep access to source files outside the Root Directory enabled because the frontend imports the shared validation workspace package.

Before deploying, add web routing configuration that:

1. Rewrites `/api/:path*` to `https://<api-project>.vercel.app/api/:path*`.
2. Rewrites non-file application routes such as `/sign-in` to `/index.html` for React Router.

Deploy the web project, then update the API's `FRONTEND_URL` to the stable web domain and redeploy the API. Production and Preview should not share databases, JWT secrets, or SMTP credentials.

## Phase 3: Acceptance Test

Run this sequence from the web domain:

1. Load `/sign-in` directly and refresh it to confirm the SPA fallback.
2. Submit an invalid signup and confirm a structured `400` response, not a proxy `ECONNREFUSED` or `404`.
3. Sign up with a test address, receive the verification email, and verify the account.
4. Sign in, refresh the protected page, call `/auth/me`, and sign out.
5. Complete forgot-password and reset-password, then confirm the old session is rejected.
6. Review Vercel Function logs and Atlas metrics for connection spikes, timeouts, or leaked sensitive values.

## Phase 4: Production-Hardening Follow-up

- Use fixed Vercel egress addresses or private networking and a narrow Atlas allowlist.
- Tune Mongoose pooling for serverless concurrency (`minPoolSize: 0` and a deliberately small maximum are a sensible starting point), then load-test rather than guessing.
- Replace the in-memory throttling store with a shared store before relying on it across multiple function instances.
- Move email sending to a durable queue when delivery retries matter.
- Disable or protect Swagger, enable deployment protection for previews, add alerting, and document rollback.
- Add automated browser tests against a disposable Preview database and SMTP inbox.

## Rollback

Use Vercel's previous deployment promotion/rollback for either project. If authentication behavior changes, roll back the web and API together. Revoke any exposed test secret, remove temporary Atlas access rules, and delete test accounts/data after the trial.
