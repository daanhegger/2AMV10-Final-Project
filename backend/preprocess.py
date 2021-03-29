from datetime import timedelta

import pandas as pd

df = None


def preprocess(df_: pd.DataFrame):
    """Preprocess the dataset in-place"""

    # Convert time column to datetime format
    df_['time_raw'] = df_.time.copy()
    df_.time = df_.time.astype("datetime64")
    df_.time = df_.time - timedelta(hours=2)

    # Replace nan's (float) to empty strings s.t. text processing works for every row
    df_.message = df_.message.fillna('')

    df_["message_tokenized"] = df_.message.map(lambda x: x.lower())


def init_df(dataset_path):
    """Load data into memory, usable by rest of the app"""

    # Import dataframe only once
    global df
    df = pd.read_csv(dataset_path)
    preprocess(df)

    return df