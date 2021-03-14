import json
from flask import Blueprint, abort
from flask_cors import CORS
import pandas as pd
from flask import request
from preprocess import df
from functools import reduce
from operator import or_

stacked_routes = Blueprint('stacked', __name__)

CORS(stacked_routes)


@stacked_routes.route("/stacked")
def stacked():
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
        if(len(json.loads(search_terms)) > 0):
            search_terms = json.loads(search_terms)
        else:
            search_terms = ['fire', 'fire alarm', 'disaster'] # top 20 words
    else:
        search_terms = ['fire', 'fire alarm', 'disaster']

    # default values & validation
    if freq_type is None: freq_type = "H"
    if freq_amount is None: freq_amount = 1
    if freq_type not in ["H", "min", "S"] or freq_amount < 0:
        abort(400, 'Invalid frequency')

    group_frequency = str(freq_amount) + str(freq_type)


    grouped_data = []
    for term in search_terms:
        df_count = df[df.message.str.contains(term)].groupby(pd.Grouper(key="time", freq=group_frequency))['time'].count()
        print(df[df.message.str.contains(term)])
        grouped_data.append({term: df_count[1], 'time': df_count[0]})

    data = pd.DataFrame(grouped_data).fillna(0)

    # data_perc = data.divide(data.sum(axis=1), axis=0)

    data["sum"] = data.sum(axis=1)



    print(data.columns)

    return data.to_json()

