from flask import Blueprint, abort
from flask_cors import CORS
import pandas as pd
from flask import request
from preprocess import df
import json
from functools import reduce
from operator import or_

stacked_routes = Blueprint('stacked', __name__)

CORS(stacked_routes)


@stacked_routes.route("/stacked")
def stacked():
    # frequency type: possible values --> https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#offset-aliases
    freq_type = request.args.get('freq_type')

    # frequency amount: positive integer
    try:
        freq_amount = int(request.args.get('freq_amount'))  # non-negative integer
    except ValueError:
        abort(400, 'Invalid frequency amount')
        return

    # search terms: list of strings
    topics_string = request.args.get('topics')
    topics = [
        {"title": "Fire & Smoke", "terms": ["fire", "smoke", "burn"]},
        {"title": "Water & Flood", "terms": ["water", "flood", "leak", "contaminated"]},
    ]

    if topics_string is not None:
        topics_json = json.loads(topics_string)
        if len(topics_json) > 0:
            topics = topics_json

    # default values & validation
    if freq_type is None: freq_type = "H"
    if freq_amount is None: freq_amount = 1
    if freq_type not in ["H", "min", "S"] or freq_amount < 0:
        abort(400, 'Invalid frequency')

    group_frequency = str(freq_amount) + str(freq_type)

    # df_count for every topic
    grouped_data = []

    for topic in topics:
        # Add "or" filter condition for every term in the topic
        # tweet should be including if any of the terms are in the tweet
        conditions = reduce(or_, [df.message.str.contains(term) for term in topic["terms"]])

        # Only tweets in the topic
        relavant_tweets = df[conditions]

        # Count number of tweets per bin
        df_count = relavant_tweets.groupby(pd.Grouper(key="time", freq=group_frequency))['time'].count().reset_index(name="count")

        # Add current topic tweets to list
        grouped_data.append(
            pd.DataFrame.from_dict({
                topic["title"]: pd.Series(df_count['count'].values),
                'time': pd.Series(df_count['time'].values)
            })
        )

    # Concat all topics
    if len(grouped_data):
        data = pd.concat(grouped_data).fillna(0).groupby(pd.Grouper(key="time")).sum()

        # Compute relative percentages
        data_perc = data.divide(data.sum(axis=1), axis=0).fillna(0)

        # Add index to other column to make sure it returns in json
        data_perc['time'] = data_perc.index
        print(data_perc)
        return data_perc.to_json(orient='records')

    else:
        return {'error': 'No search terms'}
    # Convert to json for http response

