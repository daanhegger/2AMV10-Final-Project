# 2AMV10 - Final Project
*A Visual Analytics tool for reconstructing a timeline of events from tweet-like data*

![Screenshot of the tool](docs/screenshot.png)

## Quick start

**Backend: Python/Flask REST API**

1. _Optional_: create a venv
2. Install pip dependencies `pip install -r requirements.txt`
3. Install Spacy english language model `python -m spacy download en_core_web_lg`
4. Start the server: `FLASK_APP=main.py flask run`
5. _Optional_ Start the server in development mode: `FLASK_APP=main.py FLASK_ENV=development flask run`

**Frontend: ReactJS Web Application**

1. Install dependencies: `yarn install`
2. Run in development mode: `yarn run start`
