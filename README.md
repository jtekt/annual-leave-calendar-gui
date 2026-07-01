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
| VITE_IDENTIFICATION_URL       | URL to query current user info          |
| VITE_OIDC_CLIENT_ID           | Custom ID field to use save in DB       |
| VITE_OIDC_AUTHORITY           | URL for OIDC login                      |
