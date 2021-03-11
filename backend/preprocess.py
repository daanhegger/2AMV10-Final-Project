import pandas as pd


def preprocess(df: pd.DataFrame):
    """Preprocess the dataset in-place"""

    # Convert time column to datetime format
    df.time = df.time.astype("datetime64")

    # Replace nan's (float) to empty strings s.t. text processing works for every row
    df.message = df.message.fillna('')