# 年休カレンダー GUI

[![AWS ECR](https://img.shields.io/badge/AWS%20ECR-annual--leave--calendar--gui-blue)](https://gallery.ecr.aws/jtekt-corporation/annual-leave-calendar-gui)

This is the GUI for 年休カレンダー, an application to keep track of annual leaves.

## Environment variables

| Variable                      | Description                             |
| ----------------------------- | --------------------------------------- |
| VITE_NENKYUU_CALENDAR_API_URL | URL of the 年休カレンダー API           |
| VITE_USER_MANAGER_API_URL     | URL of the user management service API  |
| VITE_GROUP_MANAGER_API_URL    | URL of the group management service API |
| VITE_LOGIN_URL                | URL for login                           |
| VITE_AUTH_IDENTIFICATION_URL  | URL to query current user info          |
| VITE_OIDC_CLIENT_ID           | Custom ID field to use save in DB       |
| VITE_OIDC_AUTHORITY           | URL for OIDC login                      |
| VITE_MINIMUM_LEAVES           | Absolute minimum leave target (days)    |
| VITE_LEAVE_TYPES_FULL_DAY     | Comma-separated type names counting as a full leave day (default 有休) |
| VITE_LEAVE_TYPES_MORNING      | Comma-separated type names counting as a morning half-day, rendered AM (default 前半休) |
| VITE_LEAVE_TYPES_AFTERNOON    | Comma-separated type names counting as an afternoon half-day, rendered PM (default 後半休) |
| VITE_LEAVE_TYPES_EXCLUDED     | Comma-separated type names that do not count towards leave totals (default 振休) |

All four lists populate the type dropdown in the create/edit entry screens, in the order above (full-day, morning, afternoon, excluded). Any type not listed anywhere counts as a full day.
