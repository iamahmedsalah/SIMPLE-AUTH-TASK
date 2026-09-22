# AI Usage

## AI Tools Used

OpenAI Codex was used as an implementation assistant inside the repository workspace.

## How AI Was Used

AI helped inspect the initially empty workspace, propose the monorepo boundary, scaffold focused modules, draft tests and documentation, and run the same quality commands expected in CI. Generated output was treated as a working draft and reviewed against the assignment rather than accepted by default.

## Architecture Assistance

AI compared cookie-based JWT and browser-storage approaches. The implemented choice keeps the JWT in an HttpOnly cookie and checks a database-backed `authVersion`, providing reset-time revocation without adding Redis or a session collection.

## Scaffolding

Boilerplate for Nest modules, React route modules, shared Zod schemas, Tailwind tokens, Docker Compose and GitHub Actions was AI-assisted. Names, boundaries and dependency choices were kept explicit so a developer can navigate the code without framework-specific generators.

## Validation

Shared schemas are consumed by React Hook Form and a Nest validation pipe. Backend schemas are strict, so the browser is never the security boundary and unexpected request fields cannot reach Mongo queries.

## Testing

AI drafted tests for shared password rules, environment failure modes, password/token hashing, generic login errors, reset-time session invalidation, frontend validation and the health endpoint. The final repository quality status is based on actually executed commands documented in the delivery report, not generated claims.

## Prompts That Worked Well

Prompts that specified threat-model outcomes—such as one-time hashed tokens, enumeration resistance and old-session invalidation—produced better engineering results than prompts that only listed endpoint names.

## AI Suggestions I Rejected

- Long-lived tokens in `localStorage`
- Redis for an MVP with no demonstrated distributed throttling/session requirement
- Repository and CQRS layers that would only wrap direct, bounded Mongoose calls
- A broad component library install instead of the handful of primitives used
- Logging request bodies for debugging, which could expose credentials and tokens

## Problems Found in AI Output

Generated work required dependency-version compatibility checks, TypeScript narrowing, validation of one-time token race behavior, and confirmation that cookie/CORS settings were aligned. These were corrected during compilation, testing and security review.

## Manual Corrections

The implementation was iterated after lint, typecheck, test and production-build feedback. Security-sensitive code was kept small and explicit; errors are sanitized, log fields are redacted, and raw tokens never enter the database.

## Security Review

The review covered password hashing, sensitive serialization, cookie attributes, JWT validation, `authVersion`, token entropy/hash/expiry/single-use behavior, account enumeration, throttling, CORS, Helmet, request limits, strict input mapping, environment validation and log redaction.

## Verification Performed

Workspace lint, strict TypeScript checking, Jest/Vitest tests, API E2E and production builds are the verification gates. Docker configuration is also checked where the host daemon is available.

## Engineering Decisions

The system stays synchronous and monolithic by design. SMTP and shared validation have clean boundaries; background jobs, refresh tokens, MFA and external caches are deferred until requirements justify their cost.

## Final Ownership

The engineer delivering this repository owns its behavior, security decisions and trade-offs. AI accelerated drafting; it did not replace review, command-based verification or engineering accountability.
