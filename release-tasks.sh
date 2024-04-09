#!/bin/bash
echo "Running in $APP_ENV"

echo "Performing php artisan migrate --force --seed"
php8.2 artisan migrate --force --seed

echo "Clear application cache"
php8.2 artisan cache:clear
