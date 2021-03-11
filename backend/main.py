from flask import Flask
from flask.cli import load_dotenv
from flask_cors import CORS
import os
import pandas as pd
from os import path
from models.vectorize_words import init_word2vec, get_word2vec_vectors
from flask import jsonify
from preprocess import init_df, df

# Load .env variables
load_dotenv()

dataset_path = os.environ.get('DATASET_PATH')

if not dataset_path or not path.exists(dataset_path):
    raise ValueError("You need to set DATASET_PATH")

init_df(dataset_path)
print("Loaded dataset into memory")

# Initialize and save a word2vec model only once
if not path.exists("./storage/word2vec.model"):
    init_word2vec(df)
    print("Initialized word2vec model")
else:
    print("word2vec model already exists")

# Flask
app = Flask(__name__)
# Allow cross origin requests
CORS(app)

# Add routes from other files
from routes.volume import volume_routes
app.register_blueprint(volume_routes)


@app.route('/')
def hello_world():
    return f"Imported dataset from {dataset_path}"


@app.route('/word2vec')
def word2vec():
    return jsonify(
        [(str(x), str(y), w) for x, y, w in get_word2vec_vectors()]
    )

