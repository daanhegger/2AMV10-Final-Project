import json
from flask import Blueprint, abort
from flask_cors import CORS
import pandas as pd
from flask import request
from preprocess import df

tweets_routes = Blueprint('tweets', __name__)

CORS(tweets_routes)


@tweets_routes.route("/tweets")
def volume():
    date_start = request.args.get('date_start')
    date_end = request.args.get('date_end')

    df_filtered = df.copy()

    if date_start is not None:
        date_start = int(date_start)
        df_filtered = df[df['time'] > date_start]

    if date_end is not None:
        date_end = int(date_end)
        df_filtered = df[df['time'] < date_end]

    return df_filtered.to_json(orient="records")

