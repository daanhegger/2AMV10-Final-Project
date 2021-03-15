import numpy as np
from flask import Blueprint, abort, jsonify
from flask_cors import CORS
from flask import request
from sklearn.decomposition import PCA
import spacy
from sklearn.manifold import TSNE

print("Downloading spacy language model")
nlp = spacy.load('en_core_web_lg')

similar_words_routes = Blueprint('similar_words', __name__)

CORS(similar_words_routes)


@similar_words_routes.route("/similar-words")
def volume():
    # User request similar words for a given "seed" word
    query = request.args.get('query')

    # Reject if no seed is given
    if query is None:
        abort(400, "No query specified")

    # Generate word vector for seed
    word_doc = nlp(query)
    # Amount of similar words to compute
    topn = 100

    # Find all similar word vectors based no cosine similarity
    keys, best_rows, scores = nlp.vocab.vectors.most_similar(
        word_doc.vector.reshape(1, word_doc.vector.shape[0]),
        n=topn
    )

    # Find the actual words for vectors
    words = [nlp.vocab.strings[w] for w in keys[0]]
    # Extract the 300 dimension vectors
    vectors = np.array([nlp.vocab.vectors[w] for w in keys[0]])

    # Dimensionality reduction
    # pca = PCA(n_components=2)
    # vectors_2d = pca.fit_transform(vectors)

    tsne = TSNE(n_components=2)
    vectors_2d = tsne.fit_transform(vectors)

    # Convert data to easy format
    data = [
        {
            "word": w.lower(),
            "vector": [str(c) for c in v],
            "score": str(s)
        }
        for w, v, s in zip(words, vectors_2d, scores[0])
    ]

    # De duplicate tokens, keep the highest one
    de_duplicated = []
    for token in data:
        if token["word"] not in [t["word"] for t in de_duplicated]:
            de_duplicated.append(token)

    return jsonify(de_duplicated)

