import numpy as np
from flask import Blueprint, abort, jsonify
from flask_cors import CORS
from flask import request
from sklearn.decomposition import PCA
import spacy

print("Downloading spacy language model")
nlp = spacy.load('en_core_web_lg')

similar_words_routes = Blueprint('similar_words', __name__)

CORS(similar_words_routes)


@similar_words_routes.route("/similar-words")
def volume():
    query = request.args.get('query')

    if query is None:
        abort(400, "No query specified")

    word_doc = nlp(query)
    topn = 100

    keys, best_rows, scores = nlp.vocab.vectors.most_similar(
        word_doc.vector.reshape(1, word_doc.vector.shape[0]),
        n=topn
    )

    words = [nlp.vocab.strings[w] for w in keys[0]]
    vectors = np.array([nlp.vocab.vectors[w] for w in keys[0]])

    pca = PCA(n_components=2)

    vectors_2d = pca.fit_transform(vectors)

    data = [
        {
            "word": w,
            "vector": [str(c) for c in v],
            "score": str(s)
        }
        for w, v, s in zip(words, vectors_2d, scores[0])
    ]

    return jsonify(data)

