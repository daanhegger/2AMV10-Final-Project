from itertools import dropwhile

import nltk
from flask import Blueprint, abort
from flask_cors import CORS
import pandas as pd
from flask import request
from nltk import TweetTokenizer
from nltk.corpus import stopwords
from preprocess import df
from collections import Counter

nltk.download('stopwords')
stopwords_en = stopwords.words('english')

with open("./popular_tokens.txt") as p_file:
    popular_tokens = [w.strip() for w in p_file.readlines()]

word_frequency_routes = Blueprint('word_frequency', __name__)

CORS(word_frequency_routes)


def filter_token(token):
    """
    Return true if token is allowed, false otherwise
    """
    # Should not be a stopword
    if token in stopwords_en or token in popular_tokens:
        return False

    # At least one real letter
    valid = False
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if letter in token:
            valid = True
    if not valid:
        return False

    # If all checks passed, return true, token is allowed
    return True


@word_frequency_routes.route("/word-frequency")
def volume():
    start_interval = request.args.get('start_interval')
    end_interval = request.args.get('end_interval')

    if start_interval is None or end_interval is None:
        abort(400, "interval required")

    # start_interval, end_interval = pd.Timestamp(int(start_interval)), pd.Timestamp(int(end_interval))

    print(df["time_raw"].dtype)

    df_filtered = df[(df["time_raw"] >= start_interval) & (df["time_raw"] <= end_interval)]

    tokenizer = TweetTokenizer()


    # List of all tokens in all messages in the timespan
    tokenized_messages = []

    for message in df_filtered["message"]:
        # Extract tokens from a single message, ignore stopwords
        tokens = [t.lower() for t in tokenizer.tokenize(message) if filter_token(t.lower())]

        # Add tokens to list of all tokens
        tokenized_messages.extend(tokens)

    counter = Counter(tokenized_messages)

    minimum_count_for_word = 5

    for key, count in dropwhile(lambda key_count: key_count[1] >= minimum_count_for_word, counter.most_common()):
        del counter[key]

    return counter

