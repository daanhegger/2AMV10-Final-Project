import pandas as pd

df = None


def preprocess(df_: pd.DataFrame):
    """Preprocess the dataset in-place"""

    # Convert time column to datetime format
    df_.time = df_.time.astype("datetime64")

    # Replace nan's (float) to empty strings s.t. text processing works for every row
    df_.message = df_.message.fillna('')


def init_df(dataset_path):
    """Load data into memory, usable by rest of the app"""

    # Import dataframe only once
    global df
    df = pd.read_csv(dataset_path)
    preprocess(df)

    return df