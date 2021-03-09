from gensim.models import Word2Vec, FastText
import pandas as pd
from nltk.tokenize import TweetTokenizer
from sklearn.decomposition import PCA
from backend.preprocess import preprocess


# def get_spam():
#     with open("../stopwords.txt") as f:
#         stopwords = [l.strip() for l in f if l.strip() != "\n"]
#
#     spam = []
#
#     for m in df['message']:
#         if not isinstance(m, str):
#             continue
#
#         clean = False
#         for token in simple_preprocess(m):
#             if token not in stopwords:
#                 clean = True
#
#         if not clean:
#             spam.append(m)
#
#     print(len(spam), "/", len(df['message']))
#     for m in spam:
#         print(m, simple_preprocess(m))


def generate_word2vec(messages: list):
    return Word2Vec(
        messages,
        min_count=5,
        workers=8,
        size=100,
        window=5
    )


def generate_fasttext(messages: list):
    model = FastText(
        min_count=3,
        workers=8,
        window=3,
        min_n=1
    )
    model.build_vocab(sentences=messages)
    model.train(sentences=messages, total_examples=len(messages), epochs=10)
    return model


def init_word2vec(df: pd.DataFrame):
    preprocess(df)
    tokenizer = TweetTokenizer()
    messages = [tokenizer.tokenize(m) for m in df['message']]

    """word2vec"""
    model = generate_word2vec(messages)
    model.save("./storage/word2vec.model")


def get_word2vec_vectors():
    model = Word2Vec.load("./storage/word2vec.model")
    X = model.wv[model.wv.vocab]
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X)
    words = list(model.wv.vocab)

    rows = [
        (vector[0], vector[1], word) for vector, word in zip(X_pca, words)
    ]

    return rows