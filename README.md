# StreamHive Admin API

NestJS admin/back-office API for StreamHive, built with a Clean Architecture
layout per feature module.

## Stack

- **Runtime**: Node.js 22, NestJS 11
- **DB**: PostgreSQL via Prisma 6
- **Auth**: JWT access + rotating refresh tokens (bcrypt password hashes)
- **Validation**: Zod (via a custom `ZodValidationPipe`)
- **Config**: `@nestjs/config` with a Zod schema (`validate` hook)
- **Logging**: `nestjs-pino` (pretty in dev, JSON in production, request-id'd)
- **Docs**: Swagger UI at `/api/docs`
- **Container**: Multi-stage Dockerfile + docker-compose for Postgres + API

## Architecture

The project follows Clean Architecture per feature module. Each module owns
four layers; dependencies only point *inward*:

```
presentation ──> application ──> domain
       └────────> infrastructure ──> domain
```

- **domain/** — Entities, value objects, repository *interfaces*, domain
  exceptions. Zero framework imports. The business invariants live here.
- **application/** — Use cases (one class per business action), application
  DTOs, and *ports* (interfaces) for anything that must touch the outside
  world (e.g. `PasswordHasher`, `TokenService`).
- **infrastructure/** — Concrete adapters: Prisma repository implementations,
  bcrypt hasher, JWT token service, Passport strategies, mappers between
  Prisma rows and domain entities.
- **presentation/** — HTTP layer: controllers, request/response DTOs, guards,
  per-route validation pipes. Controllers are thin and delegate to use cases.

Wiring happens in each `*.module.ts` via Nest providers, with `Symbol` tokens
binding domain interfaces to their infrastructure implementations:

```ts
providers: [
  { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
]
```

This means use cases depend only on interfaces from the domain/application
layer — swap Prisma for anything else by replacing one binding.

### Source layout

```
src/
├── main.ts                     # Bootstrap: pipes, filters, Swagger, CORS
├── app.module.ts               # Composition root: global guards/filter/interceptor
├── config/
│   ├── env.schema.ts           # Zod schema + validateEnv()
│   └── app.config.ts
├── shared/
│   ├── domain/                 # Entity/AggregateRoot/ValueObject bases, DomainException
│   ├── application/            # UseCase<I,O>, pagination helpers
│   ├── infrastructure/
│   │   ├── prisma/             # Global PrismaModule + PrismaService
│   │   └── logger/             # Pino logger module (request-id, redactions)
│   └── presentation/
│       ├── filters/            # AllExceptionsFilter (domain → HTTP)
│       ├── interceptors/       # TransformInterceptor ({ data, timestamp })
│       ├── decorators/         # @CurrentUser, @Roles, @Public
│       └── pipes/              # ZodValidationPipe
└── modules/
    ├── users/
    │   ├── domain/             # User entity, UserRepository interface
    │   ├── application/        # CreateUser/Update/Delete/Get/List use cases, ports
    │   ├── infrastructure/     # PrismaUserRepository, BcryptPasswordHasher, mapper
    │   ├── presentation/       # UsersController, request DTOs
    │   └── users.module.ts
    ├── auth/
    │   ├── domain/             # RefreshToken entity, RefreshTokenRepository
    │   ├── application/        # Login/Refresh/Logout use cases, TokenService port
    │   ├── infrastructure/     # JwtTokenService, JwtStrategy, PrismaRefreshTokenRepository
    │   ├── presentation/       # AuthController, JwtAuthGuard, RolesGuard
    │   └── auth.module.ts
    └── streams/
        ├── domain/             # Channel + Stream entities (with state transitions)
        ├── application/        # Create/list/get + transition use cases
        ├── infrastructure/     # Prisma repositories + mappers
        ├── presentation/       # ChannelsController, StreamsController
        └── streams.module.ts
```

### Cross-cutting concerns

- **AuthN**: `JwtAuthGuard` is registered as `APP_GUARD`, so *all* routes
  require a bearer token unless decorated with `@Public()`.
- **AuthZ**: `RolesGuard` is also global. Use `@Roles('ADMIN', 'EDITOR')` on
  handlers to gate by role. No `@Roles()` ⇒ any authenticated user.
- **Errors**: Domain exceptions (`EntityNotFoundException`,
  `ValidationException`, `ConflictException`, `UnauthorizedDomainException`)
  are translated to proper HTTP responses by `AllExceptionsFilter`.
- **Response shape**: `TransformInterceptor` wraps every successful response as
  `{ data, timestamp }`.
- **Logging**: every request gets an `x-request-id` (echoed in the response
  header and included in log lines). Sensitive fields (`Authorization` header,
  `password`, `refreshToken` body keys) are redacted.

## Getting started

### 1. Install

```bash
npm install
cp .env.example .env
# edit .env (in particular replace the two JWT secrets)
```

### 2. Database

Either bring up the bundled Postgres:

```bash
docker compose up -d postgres
```

…or point `DATABASE_URL` at any Postgres instance you already have.

Then apply the schema:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Run

```bash
npm run start:dev
```

- API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/api/docs>

### 4. Tests

```bash
npm test              # unit
npm run test:e2e      # e2e
```

## Full Docker stack

```bash
docker compose up --build
```

This starts Postgres + the API on port 3000. Apply migrations the first time:

```bash
docker compose exec api npx prisma migrate deploy
```

## Adding a new module

1. Create `src/modules/<feature>/{domain,application,infrastructure,presentation}/`.
2. Define your entity and a repository **interface** in `domain/`.
3. Write use cases in `application/use-cases/`, injecting the repository
   interface via a `Symbol` token.
4. Add the Prisma model, generate the client, write a mapper +
   repository implementation in `infrastructure/`.
5. Add a controller in `presentation/` and bind everything in
   `<feature>.module.ts`. Import the module in `app.module.ts`.

The shared base classes (`Entity`, `AggregateRoot`, `UseCase<I,O>`,
`DomainException`) and pipes/filters/decorators take care of the rest.
