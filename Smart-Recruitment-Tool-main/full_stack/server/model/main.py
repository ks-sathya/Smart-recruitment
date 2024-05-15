import logging
import sys
import os
import pandas as pd
from llama_index.query_engine import PandasQueryEngine
from secret import key, path

os.environ['OPENAI_API_KEY'] = key
logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
df = pd.read_csv(path)
pd.set_option('display.max_rows', None)


def parse_cmd(p_cmd: str):
    code_string = """
# Assuming 'pd' is the pandas
# Assuming 'df' is the DataFrame
global cmd_out
pd.set_option('display.max_rows',None)
cmd_out={cmd}
""".format(cmd=p_cmd)
    return code_string


def run_query(query):
    query_engine = PandasQueryEngine(df=df, verbose=False)
    response = query_engine.query(query)

    # Two statements deprecated with use of llama index
    code_string=parse_cmd(response.metadata["pandas_instruction_str"])
    exec(code_string)

    return response,cmd_out
