from flask import Blueprint, abort
from flask_cors import CORS
import pandas as pd
from flask import request
from preprocess import df
import json
from functools import reduce
from operator import or_

heatmap_routes = Blueprint('heatmap', __name__)

CORS(heatmap_routes)


@heatmap_routes.route("/heatmap", methods=["POST"])
def heatmap():
    # frequency type: possible values --> https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#offset-aliases
    freq_type = request.args.get('freq_type')

    # frequency amount: positive integer
    try:
        freq_amount = int(request.args.get('freq_amount'))  # non-negative integer
    except ValueError:
        abort(400, 'Invalid frequency amount')
        return

    # default values & validation
    if freq_type is None: freq_type = "H"
    if freq_amount is None: freq_amount = 1
    if freq_type not in ["H", "min", "S"] or freq_amount < 0:
        abort(400, 'Invalid frequency')

    topics = request.get_json()

    group_frequency = str(freq_amount) + str(freq_type)

    # df_count for every topic
    agg_per_topic = {}

    for topic in topics:
        conditions = reduce(or_, [df.message_tokenized.str.contains(term.lower()) for term in topic["terms"]])

        # Only tweets in the topic
        relavant_tweets = df[conditions]

        relavant_tweets["time2"] = relavant_tweets["time_raw"].astype("datetime64")

        # Count number of tweets per bin
        df_count = relavant_tweets.groupby([pd.Grouper(key="time2", freq=group_frequency), 'location'])['time2'].count().reset_index(name="count")

        df_count["time"] = df_count["time2"].dt.strftime('%Y-%m-%d %H:%M:%S')
        del df_count["time2"]

        agg_per_topic[topic['title']] = df_count.to_dict('records')

    return agg_per_topic
