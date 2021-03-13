import io
import json

import numpy as np
from flask import Blueprint, abort
from flask_cors import CORS
import pandas as pd
from flask import request
from preprocess import df
from functools import reduce
from operator import or_

volume_routes = Blueprint('volume', __name__)

CORS(volume_routes)


@volume_routes.route("/volume")
def volume():
    # frequency type: possible values --> https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#offset-aliases
    freq_type = request.args.get('freq_type')

    print(request.args.get('search_terms'))

    # frequency amount: positive integer
    try:
        freq_amount = int(request.args.get('freq_amount'))  # non-negative integer
    except ValueError:
        abort(400, 'Invalid frequency amount')
        return

    # search terms: list of strings
    search_terms = request.args.get('search_terms')
    if search_terms is not None:
        search_terms = json.loads(search_terms)
    else:
        search_terms = []

    # default values & validation
    if freq_type is None: freq_type = "H"
    if freq_amount is None: freq_amount = 1
    if freq_type not in ["H", "min", "S"] or freq_amount < 0:
        abort(400, 'Invalid frequency')

    # Filter dataset using search terms
    if len(search_terms) > 0:
        conditions = reduce(or_, [df.message.str.contains(term) for term in search_terms])
        df_filtered = df[conditions]
    else:
        df_filtered = df

    # Group tweets by time interval
    group_frequency = str(freq_amount) + str(freq_type)
    grouped = df_filtered.groupby(pd.Grouper(key="time", freq=group_frequency))['time'].count()

    return grouped.to_json()

