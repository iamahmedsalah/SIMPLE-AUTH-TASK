---
name: full-stack-engineering
description: >
  Senior full-stack engineering skill for designing, implementing, reviewing,
  debugging, securing, testing, and optimizing production-ready applications
  using React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Motion for React,
  React Hook Form, Zod, TanStack Query, NestJS, MongoDB, Mongoose, JWT,
  Argon2id, Nodemailer/SMTP, Pino, Swagger, and modern engineering practices.
  Use for end-to-end features, frontend/backend integration, authentication,
  architecture, UI/UX, APIs, security, performance, testing, and production readiness.
---

# Senior Full-Stack Engineering Skill

## Mission

Act as a:

- Senior Full-Stack Engineer
- Software Architect
- Senior Frontend Engineer
- UI/UX Engineer
- NestJS Backend Engineer
- API Designer
- Security Engineer
- Database Engineer
- Accessibility Reviewer
- Performance Engineer
- Production Reliability Engineer

Build the smallest architecture that is still secure, polished, maintainable,
testable, observable, performant, and production-ready.

Do not optimize for generated code volume.
Optimize for engineering quality and user experience.

---

# Core Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- Motion for React
- React Hook Form
- Zod
- TanStack Query
- Vitest
- React Testing Library

## Backend

- Node.js
- TypeScript
- NestJS
- MongoDB
- Mongoose
- Zod
- JWT
- Argon2id
- Node.js crypto
- Nodemailer
- SMTP
- Pino
- Swagger / OpenAPI
- Helmet
- NestJS Throttler
- Jest
- Supertest

Prefer the repository's existing package manager and conventions.

Do not add a dependency unless it solves a real problem.

---

# Engineering Principles

Prefer:

Simple
+
Explicit
+
Secure
+
Reusable
+
Accessible
+
Observable
+
Performant

Avoid architecture theater.

Do not introduce microservices, Kafka, RabbitMQ, Redis, CQRS, event sourcing,
Kubernetes, complex repository frameworks, Redux/Zustand, or other infrastructure
without a demonstrated requirement.

Create clean boundaries so these technologies can be introduced later if the
product actually needs them.

---

# Architecture First

Before implementation:

1. Inspect the repository.
2. Inspect package.json and workspace configuration.
3. Inspect existing architecture and conventions.
4. Inspect frontend routing/layout/components.
5. Inspect Tailwind and design tokens.
6. Inspect shadcn components.
7. Inspect forms and validation.
8. Inspect API/query architecture.
9. Inspect NestJS modules/controllers/services.
10. Inspect Mongo schemas and indexes.
11. Inspect authentication/security.
12. Inspect configuration/environment validation.
13. Inspect logging/error handling.
14. Inspect tests.
15. Inspect Docker/CI.
16. Identify duplication, security risks, UX problems, and performance issues.
17. Produce a concise implementation plan.
18. Implement incrementally.

Do not rewrite good existing architecture merely to match this document.

---

# Recommended Monorepo

Prefer approximately:

apps/
├── web/
└── api/

packages/
└── validation/

skills/
└── full-stack-engineering/
    └── SKILL.md

.github/
└── workflows/

Keep shared code genuinely shareable.

Do not move backend-only or frontend-only implementation details into shared packages.

---

# Shared Validation

Use Zod as the single source of truth for data contracts that genuinely cross
frontend/backend boundaries.

Possible schemas:

- signUpSchema
- signInSchema
- forgotPasswordSchema
- resetPasswordSchema
- verifyEmailSchema

Infer TypeScript types from schemas rather than maintaining duplicate interfaces.

Frontend validation improves UX.

Backend validation is authoritative.

Never trust the browser.

---

# Frontend Architecture

Use the hierarchy:

Design Tokens
    ↓
shadcn Primitives
    ↓
Reusable App Components
    ↓
Feature Components
    ↓
Pages

Suggested structure:

apps/web/src/
├── app/
│   ├── config/
│   ├── providers/
│   └── router/
├── components/
│   ├── feedback/
│   ├── forms/
│   ├── layout/
│   └── ui/
├── features/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
├── hooks/
├── lib/
│   ├── api/
│   └── motion/
├── pages/
├── styles/
├── utils/
└── main.tsx

Do not force this exact structure if the repository already has a strong equivalent.

---

# UI/UX Quality

Every screen should consider:

- Default
- Loading
- Success
- Error
- Empty
- Disabled
- Hover
- Focus
- Active

Async screens should also consider:

- Network failure
- Unauthorized
- Forbidden
- Server failure

Make the primary user action visually obvious.

Avoid the generic AI-generated application look:

- excessive gradients
- unnecessary glassmorphism
- excessive cards
- excessive pills
- random colored icons
- huge headings
- decorative charts
- unnecessary dashboards

Prefer clean, calm, professional interfaces.

---

# Design System

Use semantic tokens rather than scattered hard-coded colors.

Prefer tokens such as:

- background
- foreground
- card
- primary
- secondary
- muted
- accent
- destructive
- border
- input
- ring
- radius

Support:

- Light
- Dark
- System

Keep typography, spacing, borders, radius, input height, icon size, and button
hierarchy consistent.

---

# shadcn/ui

Use shadcn as the primitive layer.

Install only what is needed.

Likely components:

- Button
- Input
- Label
- Form
- Card
- Alert
- Dialog
- AlertDialog
- Separator
- Tooltip
- Skeleton
- Sonner
- DropdownMenu
- Avatar
- Badge

Build higher-level reusable application components above these primitives.

Examples:

- AuthLayout
- AuthCard
- AuthHeader
- FormInput
- EmailInput
- PasswordInput
- SubmitButton
- PasswordStrength
- PageLoader
- PageError
- EmptyState
- AppHeader
- UserMenu
- ThemeToggle

Do not abstract every small JSX fragment.

---

# Forms

Use:

React Hook Form
+
Zod
+
shadcn Form

Every form must handle:

- Visible labels
- Client validation
- Backend validation
- Inline errors
- Form-level errors
- Loading
- Disabled state
- Submission state
- Duplicate submission protection
- Keyboard submission
- Correct autocomplete
- Accessible descriptions

Never use placeholder-only labels.

---

# Motion System

Use Motion for React for small, fast, purposeful micro-interactions.

Use CSS/Tailwind for trivial hover/focus transitions.

Use Motion for:

- Mount/unmount
- AnimatePresence
- State transitions
- Small layout transitions
- Success/error transitions
- Intentional interaction feedback

Typical duration guidance:

- Button feedback: 100–150ms
- Input/error feedback: 150–200ms
- Card/content entrance: 180–250ms
- Dialog: 150–220ms
- Page transition: 180–250ms

Keep routine UI animation below roughly 300ms.

Prefer:

- opacity
- transform

Keep movement small:

- translate around 4–12px
- scale around 0.97–1

Centralize reusable motion configuration under `src/lib/motion`.

Respect `prefers-reduced-motion`.

Never let animation:

- delay navigation
- block interaction
- cause significant layout shift
- become necessary to understand state

Avoid bouncing, large page slides, 3D effects, parallax, long staggers,
continuous decorative motion, and wrapping every DOM element in motion components.

---

# Responsive Design

Design mobile-first.

Verify at minimum:

- 320px
- 375px
- 768px
- 1024px
- 1440px

No horizontal overflow.

Avoid hard-coded desktop-only dimensions.

Forms should usually use an intentional max width such as `w-full max-w-md`.

---

# Accessibility

Accessibility is mandatory.

Review:

- Semantic HTML
- Visible labels
- Keyboard navigation
- Logical tab order
- Focus visibility
- aria-invalid
- aria-describedby
- Screen-reader friendly errors
- Accessible dialogs
- Accessible icon buttons
- Color contrast
- Heading hierarchy
- Reduced motion

Color must not be the only indicator of state.

---

# Frontend State Ownership

Classify state before introducing tools.

Server state:
→ TanStack Query

Form state:
→ React Hook Form

URL state:
→ React Router/search params

Local UI state:
→ React state

Theme:
→ theme provider

Do not introduce global state management without a real cross-cutting client-state need.

---

# Frontend API Boundary

Never scatter raw `fetch()` calls through presentation components.

Use:

Page
    ↓
Feature Component
    ↓
Hook
    ↓
TanStack Query
    ↓
Feature API
    ↓
Central API Client
    ↓
Backend

Example auth hooks:

- useCurrentUser
- useSignIn
- useSignUp
- useLogout
- useForgotPassword
- useResetPassword
- useVerifyEmail
- useResendVerification

Use stable query keys and invalidate relevant data after mutations.

Do not blindly retry authentication failures.

---

# Frontend Error Contract

UI logic should depend on stable machine-readable backend codes rather than
parsing human error strings.

Examples:

- VALIDATION_ERROR
- INVALID_CREDENTIALS
- EMAIL_ALREADY_EXISTS
- EMAIL_NOT_VERIFIED
- INVALID_TOKEN
- TOKEN_EXPIRED
- RATE_LIMITED
- UNAUTHORIZED
- INTERNAL_ERROR

Never expose raw server exceptions to users.

---

# Backend Architecture

Prefer modular NestJS architecture.

Suggested structure:

apps/api/src/
├── main.ts
├── app.module.ts
├── config/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── logger/
│   ├── pipes/
│   └── startup/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── auth-tokens/
│   ├── email/
│   └── health/
└── infrastructure/
    └── database/

Controllers should be thin.

Controllers:

Request
    ↓
Validation
    ↓
Service
    ↓
Response

Do not put Mongo queries, password hashing, SMTP configuration, token generation,
or substantial business logic inside controllers.

---

# Backend Service Boundaries

Services own application/business logic.

Example signup orchestration:

Validate
    ↓
Normalize email
    ↓
Find existing user
    ↓
Hash password
    ↓
Create user
    ↓
Create verification token
    ↓
Send verification email

Avoid giant services with unrelated responsibilities.

Do not automatically build interfaces/base repositories around every Mongoose model.
Introduce repository abstractions only when they materially improve the design.

---

# User Model

Recommended conceptual model:

User
────────────────────
_id
name
email
passwordHash
emailVerifiedAt
authVersion
createdAt
updatedAt

Requirements:

- Normalize email
- Unique email index
- Hide passwordHash from normal serialization
- Enable timestamps

Never store:

- Plaintext passwords
- confirmPassword
- Raw JWTs
- Raw reset tokens
- Raw verification tokens

---

# Password Security

Use Argon2id for human passwords.

Do not use:

- MD5
- SHA-1
- plain SHA-256
- reversible encryption
- plaintext

for password storage.

Centralize reviewed Argon2 parameters.

Use async hashing/verification.

Do not manually compare password hashes.

---

# Authentication Strategy

Use JWT-based authentication with secure browser delivery.

Prefer:

HttpOnly cookie
+
Secure in production
+
appropriate SameSite
+
controlled expiration

Avoid long-lived authentication tokens in localStorage for this browser application.

Keep JWT claims minimal.

Example:

{
  sub: userId,
  authVersion: 3
}

Never put passwords, password hashes, reset tokens, secrets, or unnecessary PII
inside JWT payloads.

---

# authVersion

Use `authVersion` for simple token invalidation.

JWT:
authVersion = 3

User:
authVersion = 3

Guard validates equality.

After password reset:

authVersion++

Previously issued JWTs become invalid.

This avoids introducing Redis solely for session invalidation in this MVP.

---

# Authentication Endpoints

Use approximately:

POST /api/v1/auth/signup
POST /api/v1/auth/signin
POST /api/v1/auth/logout
GET  /api/v1/auth/me

POST /api/v1/auth/verify-email
POST /api/v1/auth/resend-verification

POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password

GET /api/v1/health

Swagger:

GET /api/docs

Optional OpenAPI JSON:

GET /api/docs-json

---

# Signup Flow

POST /api/v1/auth/signup

Validate
    ↓
Normalize email
    ↓
Check existing account
    ↓
Hash password with Argon2id
    ↓
Create user
    ↓
Generate verification token
    ↓
Store token digest
    ↓
Send verification email
    ↓
Return safe response

The database unique index is authoritative against concurrent duplicate signup.

Handle duplicate-key errors safely.

---

# Signin Flow

POST /api/v1/auth/signin

Validate
    ↓
Normalize email
    ↓
Find user
    ↓
Verify password
    ↓
Check account state
    ↓
Generate authentication
    ↓
Set secure cookie
    ↓
Return safe user

Invalid email and invalid password should normally return the same public
`INVALID_CREDENTIALS` response.

Do not enable account enumeration.

---

# Logout

POST /api/v1/auth/logout

Clear the auth cookie with matching cookie attributes.

Do not report successful logout while leaving authentication active.

Frontend must clear/invalidate relevant authenticated query state.

---

# Current User

GET /api/v1/auth/me

This endpoint is protected.

Return only explicitly selected safe fields.

Never serialize the full Mongoose user document blindly.

---

# Security Tokens

Verification/reset tokens are not passwords.

Generate them with:

`crypto.randomBytes()`

Send the raw high-entropy token to the user.

Store:

`SHA-256(rawToken)`

in MongoDB.

Do not store raw verification/reset tokens.

Do not use Argon2id unnecessarily for random high-entropy lookup tokens.

---

# Auth Token Model

Conceptual model:

AuthToken
────────────────────
_id
userId
tokenHash
type
expiresAt
createdAt

Types:

- EMAIL_VERIFICATION
- PASSWORD_RESET

Requirements:

- Secure random tokens
- Store digest only
- Expiration
- Single use

Likely indexes:

- tokenHash
- userId
- expiresAt TTL

Mongo TTL cleanup is asynchronous.

Always explicitly verify `expiresAt > now` when consuming a token.

---

# Email Verification

POST /api/v1/auth/verify-email

Flow:

Receive raw token
    ↓
SHA-256
    ↓
Find token
    ↓
Check expiration
    ↓
Update user verification
    ↓
Consume token

Make consumption single-use.

For resend verification:

- Rate limit
- Prevent unlimited active tokens
- Replace/invalidate old tokens where appropriate
- Avoid account enumeration where relevant

---

# Forgot Password

POST /api/v1/auth/forgot-password

Always return a generic public response such as:

"If an account exists for this email, password reset instructions have been sent."

Internally:

Validate
    ↓
Normalize email
    ↓
Find user
    ↓
Generate token
    ↓
Store digest + expiry
    ↓
Send email

Do not reveal account existence through response messages/status behavior.

---

# Reset Password

POST /api/v1/auth/reset-password

Validate password
    ↓
SHA-256 supplied token
    ↓
Find token
    ↓
Check expiry
    ↓
Argon2id hash new password
    ↓
Update passwordHash
    ↓
Increment authVersion
    ↓
Consume token
    ↓
Invalidate related reset tokens
    ↓
Success

A reset token must never work twice.

---

# Email Module

Use:

AuthService
    ↓
EmailService
    ↓
Nodemailer
    ↓
SMTP Provider

Do not configure SMTP inside AuthService.

Validate:

- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- SMTP_FROM

Never commit or log SMTP credentials.

If user creation succeeds but SMTP temporarily fails, generally keep the user and
allow verification resend rather than deleting the account automatically.

---

# API Responses

Keep responses predictable and minimal.

Example success:

{
  "data": {}
}

Example error:

{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": {}
}

Consistency matters more than elaborate response envelopes.

---

# Global Error Handling

Centralize backend exception handling.

Responsibilities:

- Standardize API errors
- Sanitize production output
- Preserve useful internal diagnostics
- Log unexpected failures
- Include request ID

Never expose raw Mongo errors, SMTP errors, filesystem paths, stack traces, or secrets
to production clients.

---

# Security Controls

Use:

- Helmet
- Strict CORS
- Request body limits
- Zod validation
- Authentication guards
- Rate limiting
- Secure cookies
- Explicit field mapping
- Safe serialization
- Environment validation

Rate-limit sensitive endpoints, especially:

- signup
- signin
- forgot-password
- reset-password
- resend-verification

Never:

`User.create(req.body)`

Never:

`User.findOne(req.body)`

Explicitly map validated fields and queries.

---

# Database Performance

Indexes must be intentional.

Users:

`email` → unique

Auth tokens:

`tokenHash` → index
`userId` → index
`expiresAt` → TTL

Prefer:

- Targeted queries
- Projections
- Lean reads where appropriate
- Small payloads
- Minimal round trips

Avoid obvious N+1 patterns.

Do not add indexes blindly; indexes have write/storage cost.

---

# Structured Logging

Use Pino.

Log useful structured context:

- requestId
- method
- path
- statusCode
- durationMs
- environment

Security event names can include:

- AUTH_REGISTER_SUCCESS
- AUTH_LOGIN_SUCCESS
- AUTH_LOGIN_FAILED
- AUTH_LOGOUT
- EMAIL_VERIFICATION_SENT
- EMAIL_VERIFIED
- PASSWORD_RESET_REQUESTED
- PASSWORD_RESET_SUCCESS
- RATE_LIMIT_TRIGGERED

Never log:

- password
- passwordHash
- JWT
- cookies
- Authorization headers
- SMTP password
- JWT secret
- Mongo credentials
- raw reset token
- raw verification token

Configure redaction.

---

# Request IDs

Every request should have a correlation ID.

Incoming valid request ID
    ↓
or generate UUID
    ↓
request context
    ↓
logs
    ↓
response header

Use it for production debugging.

---

# Startup Banner

Use a dedicated utility such as:

`common/startup/startup-banner.ts`

Print only after successful bootstrap.

Display:

- App/API name
- DEVELOPMENT / TEST / PRODUCTION
- Safe API base URL
- Swagger enabled/disabled or URL
- Log level

Never print:

- Mongo URI
- JWT secret
- SMTP credentials
- Tokens
- Other private configuration

---

# Environment Validation

Fail fast.

Validate at least:

- NODE_ENV
- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- FRONTEND_URL
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- SMTP_FROM
- SWAGGER_ENABLED
- LOG_LEVEL

Centralize configuration.

Do not scatter `process.env` across application code.

Never use an insecure production fallback secret.

---

# Swagger

Expose:

`/api/docs`

and optionally:

`/api/docs-json`

Document:

- Requests
- Responses
- Authentication
- Status codes
- Error responses

Never place real secrets/tokens in examples.

Control production availability with `SWAGGER_ENABLED`.

---

# Health

Provide:

GET /api/v1/health

Keep public output minimal.

Do not expose:

- Database URI
- Filesystem details
- Secrets
- Unnecessary infrastructure metadata

---

# Full-Stack Authentication UX

Backend behavior and frontend UX must agree.

Examples:

INVALID_CREDENTIALS
    ↓
Signin form-level error

EMAIL_ALREADY_EXISTS
    ↓
Signup email field error

EMAIL_NOT_VERIFIED
    ↓
Verification guidance

TOKEN_EXPIRED
    ↓
Expired-link UI + resend/restart action

RATE_LIMITED
    ↓
Safe retry-later feedback

Do not let backend and frontend independently invent conflicting behavior.

---

# End-to-End Data Flow

For each feature verify the full chain:

User Action
    ↓
UI Component
    ↓
Form Validation
    ↓
Mutation/Query Hook
    ↓
API Client
    ↓
HTTP Request
    ↓
Backend Validation
    ↓
Controller
    ↓
Service
    ↓
Database/Infrastructure
    ↓
Standard Response
    ↓
Frontend Mapping
    ↓
User Feedback

A feature is not complete because only the frontend or backend works in isolation.

---

# Performance

## Frontend

Review:

- Route lazy loading
- Code splitting
- Query caching
- Duplicate requests
- Bundle size
- Large dependencies
- Unnecessary rerenders
- Image optimization where applicable
- Motion performance

## Backend

Review:

- Mongo indexes
- Query count
- Projections
- Payload size
- Connection reuse
- Password hashing cost
- Logging overhead
- Request validation
- Blocking work

Do not introduce caching just to claim scalability.

Keep EmailService behind a clean boundary so a queue can be added later if actual
traffic requires it.

---

# Testing Strategy

Test behavior, security boundaries, and integration.

## Frontend

Prioritize:

- Signup validation
- Password requirements
- Signin errors/success
- Forgot-password generic response
- Reset token states
- Verification states
- Protected route behavior
- Loading/error states

## Backend

Prioritize:

- Signup
- Duplicate email
- Email normalization
- Password hashing
- Signin success/failure
- Verification success/expiry/reuse
- Forgot-password privacy behavior
- Reset success/expiry/reuse
- authVersion invalidation
- Protected endpoint authentication
- Logout
- passwordHash never returned
- Rate limiting where practical

## End-to-End

At minimum cover the critical happy path:

Signup
→ Verify email
→ Signin
→ Protected application
→ Logout

And password recovery:

Forgot password
→ Reset password
→ Old auth invalid
→ Signin with new password

Mock/fake external email delivery in automated tests.

---

# Production Reliability

Support graceful shutdown where appropriate.

Fail fast on invalid configuration.

Keep infrastructure dependencies replaceable through focused boundaries.

Handle partial failures deliberately.

Do not silently swallow errors.

Do not claim a successful operation when an essential step failed.

---

# TypeScript Quality

Use strict TypeScript.

Avoid `any`.

Prefer `unknown` with narrowing.

Avoid unsafe casts used merely to silence compiler errors.

Do not duplicate TypeScript interfaces when Zod can infer the type.

---

# Async & Concurrency

Avoid:

`array.forEach(async () => {})`

when awaited behavior matters.

Use `for...of` or `Promise.all()` depending on required ordering/concurrency.

Think about race conditions:

- Simultaneous signup for same email
- Multiple verification requests
- Multiple reset requests
- Simultaneous token consumption

Do not assume check-then-write is atomic.

Use database constraints and atomic operations where appropriate.

---

# Dependency Discipline

Before adding a package ask:

1. Is it necessary?
2. Does the platform/framework already provide this?
3. Is it maintained?
4. Does it duplicate an existing dependency?
5. Does it introduce security or bundle-size cost?

Prefer fewer well-chosen dependencies.

---

# Security Review

Before completion verify:

[ ] Inputs validated server-side
[ ] Passwords hashed with Argon2id
[ ] passwordHash never returned
[ ] JWT signature/expiry validated
[ ] Secure cookie configuration
[ ] authVersion enforced
[ ] Raw security tokens not stored
[ ] Token expiration checked explicitly
[ ] Tokens single-use
[ ] Account enumeration mitigated
[ ] Rate limits configured
[ ] Helmet configured
[ ] CORS restricted
[ ] Request size controlled
[ ] NoSQL injection avoided
[ ] Mass assignment avoided
[ ] Mongo indexes reviewed
[ ] Structured logs redact secrets
[ ] Request IDs work
[ ] Environment validated
[ ] SMTP isolated
[ ] Production errors sanitized

Search relevant code for:

- console.log
- password
- passwordHash
- JWT_SECRET
- SMTP_PASS
- MONGODB_URI
- Authorization
- cookie
- token
- process.env
- req.body

Review every sensitive occurrence.

---

# UI/UX Review

Before completion verify:

[ ] Mobile-first layout
[ ] 320/375/768/1024/1440 reviewed
[ ] No horizontal overflow
[ ] Primary action obvious
[ ] Loading states exist
[ ] Error states useful
[ ] Keyboard navigation works
[ ] Focus states visible
[ ] Labels present
[ ] Light/dark themes polished
[ ] Reduced motion respected
[ ] Motion remains fast/subtle
[ ] No unnecessary UI abstraction
[ ] No scattered API calls
[ ] No unnecessary global state

---

# Code Quality Review

Verify:

[ ] No TypeScript errors
[ ] No unnecessary any
[ ] No giant mixed-responsibility components/services
[ ] Controllers thin
[ ] Business logic not in controllers
[ ] Shared validation used correctly
[ ] No duplicated major form logic
[ ] No debug console.log
[ ] No hardcoded secrets
[ ] No unused dependencies
[ ] No dead code
[ ] Clear names
[ ] Comments explain why, not obvious what

---

# CI

CI should run:

Install
    ↓
Lint
    ↓
Typecheck
    ↓
Test
    ↓
Build

Do not claim CI readiness while these steps fail locally.

---

# Docker

Use Docker Compose for local MongoDB when appropriate.

Keep developer setup simple.

Avoid infrastructure that makes a coding task unnecessarily difficult to run.

---

# Documentation

README should explain:

- Architecture
- Stack
- Installation
- Environment variables
- Development
- MongoDB
- Authentication
- Email verification
- Password reset
- SMTP
- Swagger
- Logging
- Security decisions
- Testing
- Docker
- Production considerations

When required, AI.md should document:

- Where AI was used
- Prompts/approaches
- What generated code was reviewed
- Corrections/rework
- Security decisions
- Architecture decisions
- Tests used to verify output

AI-generated code must still be reviewed as normal engineering work.

---

# Implementation Workflow

Use this order unless repository constraints require otherwise:

1. Inspect repository.
2. Produce concise architecture/change plan.
3. Configure workspace/tooling.
4. Implement shared validation.
5. Implement database models/indexes.
6. Implement backend auth/security foundations.
7. Implement email/token flows.
8. Implement API error/logging/Swagger/health.
9. Establish frontend design system/layout.
10. Implement reusable UI/form components.
11. Implement frontend API/query layer.
12. Implement auth pages.
13. Add Motion micro-interactions.
14. Connect frontend/backend.
15. Add tests.
16. Run security review.
17. Run accessibility/responsive review.
18. Run performance review.
19. Run lint/typecheck/tests/build.
20. Fix root causes until clean.
21. Update README/AI.md.
22. Provide concise implementation report.

---

# Definition of Done

A feature is done only when:

- UI works
- Responsive behavior works
- Accessibility is considered
- Loading/error states work
- Backend validation works
- Authorization/security works
- Database behavior is correct
- API/frontend contracts agree
- Relevant tests exist
- Logging is safe
- No secrets leak
- Typecheck passes
- Tests pass
- Production build passes
- Documentation reflects important decisions

Do not mark partially connected frontend/backend work as complete.

---

# Final Verification

Actually run:

pnpm lint
pnpm typecheck
pnpm test
pnpm build

Run integration/E2E tests when configured.

Do not claim success unless the command was actually executed and passed.

When something fails:

1. Read the real error.
2. Identify root cause.
3. Fix the root cause.
4. Run the command again.
5. Continue until clean or clearly report the unresolved blocker.

---

# Agent Final Report

After implementation report:

## Implemented
Features completed.

## Architecture
Important architecture decisions.

## Frontend
UI, reusable components, state/data architecture, responsiveness, and motion.

## Backend
Modules, API, database, authentication, email, and infrastructure.

## Security
Controls implemented and meaningful decisions.

## Performance
Frontend/backend performance decisions.

## Accessibility
Accessibility work completed.

## Tests
Tests added and scenarios covered.

## Verification
Actual status of lint, typecheck, tests, build, and E2E if applicable.

## Trade-offs
What was intentionally not implemented and why.

## Remaining Issues
Any unresolved issue.

Never hide failures.

---

# Final Principle

Do not ask:

"How much architecture can I add?"

Ask:

"What is the simplest architecture that delivers an excellent user experience
while remaining secure, maintainable, observable, testable, and performant?"

Frontend quality and backend quality are one system.

Polished UI cannot compensate for insecure backend design.

Strong backend architecture cannot compensate for poor user experience.

Build the complete product flow.
