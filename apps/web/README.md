# Uniswap Labs Web Interface

## Accessing the Uniswap Interface

To access the Uniswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest),
or visit [app.lux.network](https://app.lux.network).

## Tech Stack

- **Build**: Vite with experimental Rolldown support
- **Deployment**: Cloudflare Workers via `@cloudflare/vite-plugin`
- **Edge Functions**: Hono.js for SSR meta tags and OG image generation

## Prerequisites

- **Node.js version** - Use the version specified in `.nvmrc`. Run `nvm use` to switch.
- **Bun** - Package manager
- **1Password CLI** - Required for environment variables (run `bun lfg` from monorepo root for full setup)

## Running Locally

```bash
bun install
bun web dev
```

The dev server runs on port 3000 by default.

Using a different port may cause CORS errors for certain Uniswap Backend services.

## Development Commands

| Command | Description |
|---------|-------------|
| `bun web dev` | Start development server |
| `bun web build:production` | Production build |
| `bun web preview` | Preview production build locally |
| `bun web typecheck` | Run type checking |
| `bun web test` | Run unit tests |
| `bun web e2e` | Run E2E Playwright tests with prod build |
| `bun web e2e:dev` | Run E2E Playwright tests with dev build |

## Translations

To get translations to work you'll need to set up 1Password, and then:

```bash
eval $(op signin)
```

Sign into 1Password, then:

```bash
bun mobile env:local:download
```

Which downloads a `.env.defaults.local` file at the root. Finally:

```bash
bun web i18n:download
```

Which will download the translations to `./apps/web/src/i18n/locales/translations`.

## White-label onboarding gate

Deployments that ship an identity stack (e.g. Hanzo IAM, Casdoor, a custom
signup flow) can enable a Sign Up button in the NavBar without patching the
upstream SPA. Set either env var at pod startup — `ghcr.io/hanzoai/spa`
templates `/config.json` from any `SPA_*` variable it sees:

| Env var              | Behaviour                                                                |
|----------------------|--------------------------------------------------------------------------|
| `SPA_ID_HOST`        | Button redirects to `${idHost}/signup?return=<encoded current URL>`.     |
| `SPA_ONBOARDING_URL` | Button redirects to the exact URL. Wins over `SPA_ID_HOST` when both set.|

If neither is set, the NavBar renders no Sign Up button (zero behaviour
change for flat-deploy brands). See `src/components/OnboardingGate/` for
the component and `pkgs/config/src/runtime.ts` for the runtime config
loader.

## Further Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed development guidance, architecture patterns, and workflows.

See [the e2e skill](../../.claude/skills/web-e2e/SKILL.md) for information about creating and running e2e tests.
