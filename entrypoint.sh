#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/assets/*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ...";


  sed -i 's|VITE_NENKYUU_CALENDAR_API_URL_PLACEHOLDER|'${VITE_NENKYUU_CALENDAR_API_URL}'|g' $file

  sed -i 's|VITE_GROUP_MANAGER_API_URL_PLACEHOLDER|'${VITE_GROUP_MANAGER_API_URL}'|g' $file
  sed -i 's|VITE_USER_MANAGER_API_URL_PLACEHOLDER|'${VITE_EMPLOYEE_MANAGER_API_URL}'|g' $file

  sed -i 's|VITE_LOGIN_URL_PLACEHOLDER|'${VITE_LOGIN_URL}'|g' $file
  sed -i 's|VITE_IDENTIFICATION_URL_PLACEHOLDER|'${VITE_IDENTIFICATION_URL}'|g' $file
  
  sed -i 's|VITE_LOGIN_HINT_PLACEHOLDER|'${VITE_LOGIN_HINT}'|g' $file
  sed -i 's|VITE_HOMEPAGE_URL_PLACEHOLDER|'${VITE_HOMEPAGE_URL}'|g' $file


done

echo "Starting Nginx"
nginx -g 'daemon off;'


