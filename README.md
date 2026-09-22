# Northstar Auth

## Overview

Northstar Auth is a deliberately small, production-minded authentication MVP. It combines a React application, a NestJS API, shared Zod contracts, MongoDB, and SMTP email in a pnpm workspace. Browser authentication uses a short-lived JWT in an HttpOnly cookie—never browser storage.

## Features

- Sign up, email verification and rate-limited verification resend
- Sign in, current user, protected application route and logout
- Enumeration-resistant forgot-password flow and one-time password reset
- Light, dark and system themes; responsive and keyboard-accessible forms
- Structured Pino request logs, request IDs, safe global errors, Swagger and health endpoint
- Shared request validation, high-value tests, Docker infrastructure and GitHub Actions CI

## Architecture

```text
apps/web       React + Vite frontend
apps/api       NestJS REST API
packages/validation  Shared Zod request contracts
```

The web app follows `page -> feature hook -> TanStack Query -> API function -> API client`. The API follows `controller -> auth service -> Mongoose model`, with email delivery isolated behind `EmailService`. The API is versioned under `/api/v1`.

## Technology Stack

- React 19, TypeScript, Vite, React Router, Tailwind CSS and shadcn-style Radix primitives
- React Hook Form, Zod and TanStack Query
- NestJS, Mongoose/MongoDB, Argon2id, JWT, Nodemailer/SMTP
- Pino, Helmet, Nest throttling and Swagger/OpenAPI
- Jest/Supertest and Vitest/React Testing Library

## Project Structure

```text
apps/
  api/src/modules/{auth,email,health,tokens,users}
  web/src/{app,components,features,pages,lib}
packages/validation/src
.github/workflows/ci.yml
docker-compose.yml
```

## Prerequisites

- Node.js 20 or newer (CI uses Node 24)
- pnpm 11.9.0
- Docker Desktop, or separate MongoDB and SMTP services

On Windows PowerShell installations that block `pnpm.ps1`, use `pnpm.cmd` in place of `pnpm`.

## Installation

```bash
pnpm install
cp .env.example .env
```

Replace `JWT_SECRET` with at least 32 cryptographically random characters. Never use the example value in production.

## Environment Variables

The API reads the root `.env` when commands run from the repository root. `NODE_ENV` is limited to `development`, `test`, or `production`. Required configuration includes `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, SMTP host/port/from, `SWAGGER_ENABLED`, and `LOG_LEVEL`. `SMTP_FROM` is preferred; `SMTP_FROM_EMAIL` is accepted as a compatibility alias. Development uses a localhost sender when neither is supplied, while production requires an explicit sender plus `SMTP_USER` and `SMTP_PASS`. `DNS_SERVERS` is an optional comma-separated list of DNS resolver IPs; use it only when the machine's resolver refuses MongoDB Atlas SRV lookups. Secure cookies are enabled automatically. The browser uses same-origin `/api/v1`; production should route that prefix to the API.

## Running MongoDB and SMTP

```bash
docker compose up -d
```

MongoDB listens on `27017`. Mailpit provides SMTP on `1025` and its local email inbox at `http://localhost:8025`.

## Development

```bash
pnpm dev
```

Frontend: `http://localhost:5173`. API: `http://localhost:3000`. Vite proxies `/api` to the API in development. Vite and the API print secret-free development banners in their terminals, and the browser console shows a development-only marker. The API banner appears only after configuration, MongoDB connection, and HTTP listen succeed.

If Vite reports `http proxy error ... ECONNREFUSED`, first inspect the API process: it means nothing accepted the proxied connection. A preceding `querySrv ECONNREFUSED` is a DNS failure while resolving the MongoDB Atlas SRV record. `DNS_SERVERS=8.8.8.8,1.1.1.1` makes Node use those resolvers before Mongoose connects; Atlas credentials and Network Access rules must still be valid.

## Build and Quality

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## API Documentation

With `SWAGGER_ENABLED=true`, Swagger UI is at `http://localhost:3000/api/docs` and OpenAPI JSON is at `http://localhost:3000/api/docs-json`.

| Method | Endpoint                           | Purpose                              |
| ------ | ---------------------------------- | ------------------------------------ |
| POST   | `/api/v1/auth/signup`              | Create account and send verification |
| POST   | `/api/v1/auth/verify-email`        | Consume verification token           |
| POST   | `/api/v1/auth/resend-verification` | Replace verification token           |
| POST   | `/api/v1/auth/signin`              | Set auth cookie                      |
| GET    | `/api/v1/auth/me`                  | Read current user                    |
| POST   | `/api/v1/auth/logout`              | Clear auth cookie                    |
| POST   | `/api/v1/auth/forgot-password`     | Request password reset               |
| POST   | `/api/v1/auth/reset-password`      | Replace password and revoke sessions |
| GET    | `/api/v1/health`                   | Liveness response                    |

## Authentication Flow

After verified credentials, the API signs minimal claims (`sub`, `authVersion`) into a short-lived JWT and sets it as an HttpOnly, SameSite=Lax cookie. Protected requests verify the signature and compare `authVersion` against MongoDB. Logout clears the cookie; password reset increments `authVersion`, immediately rejecting older cookies.

## Email Verification and Password Reset

Both flows generate 32 random bytes. Only a SHA-256 token hash is stored. Tokens have a TTL index, an explicit expiration check, are atomically consumed, and are single-use. Creating a replacement deletes older tokens of the same type. Set standard `SMTP_*` variables for Mailpit, SES, SendGrid SMTP, or another provider.

For Gmail SMTP, use the full Gmail address as `SMTP_USER`, a Google App Password as `SMTP_PASS`, port `465`, and `SMTP_SECURE=true`. Set `SMTP_FROM` to a branded sender using the same authenticated address, for example `Northstar <account@gmail.com>`. Do not use or commit the normal Google account password; `.env` is ignored by Git.

## Security Decisions

- Argon2id with OWASP-aligned baseline parameters; passwords and hashes are redacted/never serialized
- Credentialed CORS accepts only `FRONTEND_URL`; Helmet and 100 KB request limits are enabled
- Strict request schemas discard no unexpected fields—they reject them
- Generic credential/recovery responses reduce account enumeration
- Sensitive endpoints have tighter throttles; global throttling is also enabled
- No raw security token, cookie, authorization header, password, secret, or database credential is logged
- Production SMTP credentials and a 32+ character JWT secret fail fast when absent

## Logging and Performance

Pino emits structured request logs with environment, request ID, status and duration. MongoDB uses a unique normalized email index, unique token-hash index, user/type lookup index and TTL expiry index. Auth responses are small, route bundles are lazy-loaded, and current-user state is cached for 60 seconds.

## Docker and CI/CD

Docker Compose intentionally runs only MongoDB and Mailpit; application processes stay local for a fast MVP loop. GitHub Actions installs with the lockfile, then runs lint, typecheck, tests, build and API E2E.

The staged Vercel test deployment plan is documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Trade-offs

- JWT revocation checks MongoDB on each protected request. This keeps revocation correct without Redis and is appropriate for MVP traffic.
- Email is sent inline. A durable queue becomes worthwhile when throughput or delivery retries justify it.
- The local Compose file is development infrastructure, not production orchestration.
- There is no OAuth, RBAC, refresh-token rotation or admin surface because the product does not require them yet.

## Future Improvements

At meaningful scale: rotate access/refresh token pairs, add device/session management, enqueue email with delivery telemetry, use managed MongoDB monitoring, add browser E2E against disposable infrastructure, and introduce passkeys or MFA based on product risk.
