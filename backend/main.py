from flask import Flask
from flask_cors import CORS
import os
import pandas as pd
from os import path

# Flask
app = Flask(__name__)
# Allow cross origin requests
CORS(app)

dataset_path = os.environ.get('DATASET_PATH')

if not dataset_path or not path.exists(dataset_path):
    raise ValueError("You need to set DATASET_PATH")

df = pd.read_csv(dataset_path)

@app.route('/')
def hello_world():
    return f"Imported dataset from {dataset_path}"

@app.route('/word2vec')
def word2vec():
    pass