### Project setup

```sh
npm install

composer install

mysql -u root
# run: create database database_name;

cp .env.example .env
code .env
# edit if needed: DB_PORT=, DB_DATABASE=, DB_USERNAME=, DB_PASSWORD=

php artisan key:generate
php artisan migrate:fresh --seed
```

### Run project

Run in 1 terminal the javascript development server:

```sh
npm run dev
```

Run in another terminal the laravel development server:

```sh
php artisan serve
```

PHPCS

```sh
.\vendor\bin\phpcs -v
.\vendor\bin\phpcbf
```

Note: as of vue 3.2.13+ and @vitejs/plugin-vue 1.9.0+, @vue/compiler-sfc is no longer required as a peer dependency.

### Deployment notes

Add these environment variables for mailing:

MAIL_FROM_ADDRESS=no-reply@timeinsight.com
MAIL_FROM_NAME=TimeInsight

### Admin login details

```sh
name:       admin
email:      admin@script.nl
password:   admin
```

### API calls

| Method | URL                           | Data               | Description               |
| ------ | ----------------------------- | ------------------ | ------------------------- |
| POST   | api/cards/{card_id}/tag_scans | card_id, timestamp | register checkin/checkout |

-   example of a RFID tag id: 428255304
-   example of a tag scan http call:
    -   method: POST
    -   content type: application/json
    -   url: http://localhost:8000/api/cards/{card_id}/tag_scans

### Info links

# Custom store implentation Vue3 composition API:

https://vueschool.io/articles/vuejs-tutorials/home-rolled-store-with-the-vue-js-composition-api/

https://vueschool.io/articles/vuejs-tutorials/state-management-with-composition-api/
