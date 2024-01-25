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

   run:

   ```bash
   yarn watch:app
   ```

   then open url `http://127.0.0.1:{port}` (port is defined in `.env` file) in browser. or run:

   ```bash
   yarn start:app
   ```

   then open `http://127.0.0.1:8888` in browser.
