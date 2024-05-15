from .main import run_query
import pandas as pd
from .Parse_query import prompt_parser, keywords


# This function is used to find, what kind of charts user has asked in his prompt

def keyword_finder(query):
    ans_dict = {}
    for key in keywords:
        if key in query:
            if not ans_dict:
                k = key
                ans_dict[key] = {}
                query = query.replace(key, "").strip()
            else:
                query = query.replace(key, "").strip()
    if not ans_dict:
        ans_dict["answer"] = []
        k = 0
        return ans_dict, k, query
    else:
        return ans_dict, k, query


# Function to get output in dictionary format

def output_formatter(ans_dict, key, response):
    if isinstance(response, pd.core.series.Series):
        columns_list=[]
        i=response.index.to_list()
        response.to_dict()
        columns_list.append(response.index.name)
        columns_list.append(response.name)
        d=response.to_list()
        c = [[x,y] for x, y in zip(i, d)]
        if key == 0:
            key = "answer"
            ans_dict["answer"] = {}
            ans_dict[key]["columns"] = columns_list
            ans_dict[key]["data"] = d
        else:
            print(ans_dict)
            ans_dict[key]["answer"] = {}
            k="answer"
            ans_dict[key][k]["columns"] = columns_list
            ans_dict[key][k]["data"] = c
        return ans_dict
    elif isinstance(response, pd.core.frame.DataFrame):
        c = response.columns
        d = response.values.tolist()
        columns_list = []
        for col in c:
            columns_list.append(col)
        if key == 0:
            key = "answer"
            ans_dict["answer"] = {}
            ans_dict[key]["columns"] = columns_list
            ans_dict[key]["data"] = d
        else:
            ans_dict[key]["answer"]={}
            ans_dict[key]["answer"]["columns"] = columns_list
            ans_dict[key]["answer"]["data"] = d
        return ans_dict
    else:
        ans_dict["answer"] = response
        return ans_dict



def web_point(query):
    query = query.lower()
    out_fnc = keyword_finder(query)  # Invoking keyword finder function
    query = prompt_parser(out_fnc[2])
    response, cmd_out = run_query(out_fnc[2])
    out = output_formatter(out_fnc[0], out_fnc[1], cmd_out)
    print(out)

    return out


#  ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️  Remove or Comment nt this code before deploying in the web ⚠️⚠️⚠️⚠️⚠️⚠️⚠️
"""
query = ""
while query != "-1":
    query = input("Enter prompt : \n")
    query = query.lower()
    out_fnc = keyword_finder(query)  # Invoking keyword finder function
    query = prompt_parser(out_fnc[2])
    response, cmd_out = run_query(out_fnc[2])
    out = output_formatter(out_fnc[0], out_fnc[1], cmd_out)
    print(out)
"""