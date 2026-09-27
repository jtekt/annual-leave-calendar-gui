# 年休カレンダー GUI

[![AWS ECR](https://img.shields.io/badge/AWS%20ECR-annual--leave--calendar--gui-blue)](https://gallery.ecr.aws/jtekt-corporation/annual-leave-calendar-gui)

This is the GUI for 年休カレンダー (`nenkyuu_calendar`), an application to keep track of annual leaves.

## Environment variables

### Services

| Variable | Description |
| --- | --- |
| `VITE_NENKYUU_CALENDAR_API_URL` | Base URL of the 年休カレンダー API |
| `VITE_USER_MANAGER_API_URL` | Base URL of the user manager API |
| `VITE_GROUP_MANAGER_API_URL` | Base URL of the group manager API |

### Authentication

Both OIDC and username/password login can be configured at the same time; the login page then offers both.

| Variable | Description |
| --- | --- |
| `VITE_OIDC_AUTHORITY` | OIDC provider issuer URL (e.g. `https://keycloak.jtektrnd.net/realms/jtekt`) |
| `VITE_OIDC_CLIENT_ID` | Client ID registered in the OIDC provider |
| `VITE_LOGIN_URL` | User manager endpoint for username/password login (e.g. `…/v3/auth/login`) |
| `VITE_AUTH_IDENTIFICATION_URL` | Endpoint called after login to fetch the full user profile (e.g. `…/v3/users/self`) |
| `VITE_AUTH_ENRICHMENT_ID_FIELD` | User field used to look the user up in that endpoint (e.g. `_id`) |

### Leaves

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_MINIMUM_LEAVES` | Absolute minimum leave target (days) | 0 |
| `VITE_LEAVE_TYPES_FULL_DAY` | Comma-separated type names counting as a full leave day | 有休 |
| `VITE_LEAVE_TYPES_MORNING` | Comma-separated type names counting as a morning half-day, rendered AM | 前半休 |
| `VITE_LEAVE_TYPES_AFTERNOON` | Comma-separated type names counting as an afternoon half-day, rendered PM | 後半休 |
| `VITE_LEAVE_TYPES_EXCLUDED` | Comma-separated type names that do not count towards leave totals | 振休 |

All four lists populate the type dropdown in the create/edit entry screens, in the order above (full-day, morning, afternoon, excluded). Any type not listed anywhere counts as a full day.

### Common

These variables are shared by all the corporate-apps GUIs.

| Variable | Description |
| --- | --- |
| `VITE_I18N_LOCALE` | Default UI language (`ja` or `en`), used until the user picks one |
| `VITE_I18N_FALLBACK_LOCALE` | Language used for missing translations |
| `VITE_APPS_URL` | URL of the apps portal; shows an apps button in the app bar when set |
| `VITE_HELP_URL` | URL of the help page; shows a help button in the app bar when set |

## Runtime configuration

The variables above are read at runtime, not baked into the build: at container startup, `40-env-config.sh` writes every `VITE_*` environment variable to `/env.js`, which `src/runtimeEnv.ts` merges over the build-time values. The same image can therefore be configured per deployment through the Kubernetes manifest.

In development, values come from `.env` (i18n defaults) and `.env.development` (local URLs).

The version shown on the About page is the git tag, passed at build time (`--build-arg APP_VERSION`); it cannot be changed at runtime.

## Development

```
npm install
npm run dev
```

`npm run build` type-checks and builds for production.
