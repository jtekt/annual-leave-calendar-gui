#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/assets/*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ...";


  sed -i 's|VITE_NENKYUU_CALENDAR_API_URL_PLACEHOLDER|'${VITE_NENKYUU_CALENDAR_API_URL}'|g' $file

  sed -i 's|VITE_GROUP_MANAGER_API_URL_PLACEHOLDER|'${VITE_GROUP_MANAGER_API_URL}'|g' $file
  sed -i 's|VITE_USER_MANAGER_API_URL_PLACEHOLDER|'${VITE_USER_MANAGER_API_URL}'|g' $file

  sed -i 's|VITE_LOGIN_URL_PLACEHOLDER|'${VITE_LOGIN_URL}'|g' $file
  sed -i 's|VITE_IDENTIFICATION_URL_PLACEHOLDER|'${VITE_IDENTIFICATION_URL}'|g' $file
  
  sed -i 's|VITE_LOGIN_HINT_PLACEHOLDER|'${VITE_LOGIN_HINT}'|g' $file
  sed -i 's|VITE_APPS_URL_PLACEHOLDER|'${VITE_APPS_URL}'|g' $file

  sed -i 's|VITE_MINIMUM_LEAVES_PLACEHOLDER|'${VITE_MINIMUM_LEAVES}'|g' $file

  sed -i 's|VITE_OIDC_AUTHORITY_PLACEHOLDER|'${VITE_OIDC_AUTHORITY}'|g' $file
  sed -i 's|VITE_OIDC_CLIENT_ID_PLACEHOLDER|'${VITE_OIDC_CLIENT_ID}'|g' $file
  sed -i 's|VITE_ENRICMENT_ID_PLACEHOLDER|'${VITE_ENRICMENT_ID}'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'


