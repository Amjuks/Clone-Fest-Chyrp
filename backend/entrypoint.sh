#!/bin/sh

echo "⏳ Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "✅ Database is ready!"

# Apply migrations
python chyrp_backend/manage.py makemigrations --noinput
python chyrp_backend/manage.py migrate --noinput

# Create superuser (custom command)
python chyrp_backend/manage.py createsu

# Seed categories (custom command)
python chyrp_backend/manage.py seed_categories

# Start server
exec python chyrp_backend/manage.py runserver 0.0.0.0:8000