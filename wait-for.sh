#!/bin/sh
echo "Waiting for database connection..."
until nc -z $DB_HOST 3306; do
  sleep 1
done
echo "Database is ready. Starting the application..."
exec "$@"
