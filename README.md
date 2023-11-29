# Xblog

A project for managing blog posts.

## development

1. install dependencies

   ```bash
   yarn install
   ```

2. create `.env` file, same as `.env.sample`

3. generate prisma client

   ```bash
   yarn generate
   ```

4. run prisma migrations

   ```bash
   yarn migrate
   ```

5. start dev backend

   ```bash
   yarn start:server
   ```

6. start dev frontend

   ```bash
   yarn watch:app
   # or
   yarn start:app
   ```

7. open url `http://127.0.0.1:{port}` in browser if you are running `watch:app` in previous step, otherwise open url `http://127.0.0.1:8888`, port is defined in `.env` file
