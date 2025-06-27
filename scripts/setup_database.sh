#!/bin/bash
# Apply all SQL files in supabase/ to the target database

set -e

if [ -z "$SUPABASE_DB_URL" ]; then
  echo "SUPABASE_DB_URL environment variable is not set"
  echo "Please export the Postgres connection string and retry."
  exit 1
fi

for sql_file in $(ls supabase/*.sql | sort); do
  echo "Applying $sql_file"
  psql "$SUPABASE_DB_URL" < "$sql_file"
  echo "-- applied $sql_file"
  echo
done

echo "Database setup complete"

