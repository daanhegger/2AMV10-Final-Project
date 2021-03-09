from flask import Flask
app = Flask(__name__)
from flask_cors import CORS

# Allow cross origin requests
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/word2vec')
def word2vec():
    pass