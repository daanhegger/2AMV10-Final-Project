import pandas as pd

df = None


def preprocess(df: pd.DataFrame):
    """Preprocess the dataset in-place"""

    # Convert time column to datetime format
    df.time = df.time.astype("datetime64")

    # Replace nan's (float) to empty strings s.t. text processing works for every row
    df.message = df.message.fillna('')


def init_df(dataset_path):
    """Load data into memory, usable by rest of the app"""

    # Import dataframe only once
    global df
    df = pd.read_csv(dataset_path)
    preprocess(df)