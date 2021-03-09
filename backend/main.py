import json
from flask import Flask
from flask.cli import load_dotenv
from flask_cors import CORS
import os
import pandas as pd
from os import path
from backend.models.vectorize_words import init_word2vec, get_word2vec_vectors
from flask import jsonify

# Flask
app = Flask(__name__)
# Allow cross origin requests
CORS(app)

load_dotenv()

dataset_path = os.environ.get('DATASET_PATH')

if not dataset_path or not path.exists(dataset_path):
    raise ValueError("You need to set DATASET_PATH")

# Import dataframe only once
df = pd.read_csv(dataset_path)

# Initialize and save a word2vec model only once
# init_word2vec(df)


@app.route('/')
def hello_world():
    return f"Imported dataset from {dataset_path}"


@app.route('/word2vec')
def word2vec():
    return jsonify(
        [(str(x), str(y), w) for x, y, w in get_word2vec_vectors()]
    )
