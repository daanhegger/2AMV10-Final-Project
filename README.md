# 2AMV10

## Backend

When added dependency: `conda env export > backend/environment.yml`

Updating local env: `conda env update --file backend/environment.yml  --prune`

Starting the server:
`FLASK_APP=main.py flask run`

Starting the server in developer mode:
`FLASK_APP=main.py FLASK_ENV=development flask run`

## Frontend

Installing dependencies
`yarn install`

Running the react app
`yarn run start`