keywords = ["pie", "line", "bar", "table", "piechart", "barchart", "linechart", "bargraph", "linegraph", "graph",
            "chart", "charts", "graphs"]


def prompt_parser(query):
    prompt = """You are provided with a DataFrame named df containing information about individuals. The DataFrame has Nine columns:
    first_name: Contains first names.
    last_name: Contains last names.
    phone number:contains phone numbers
    age:contains age of employees
    experience:contains experience of employees
    email: contains mail address of employees
    role : contains role of an employee,
    skill : contains different skillset of an employee,
    location: Contains addresses.
    {}
    """.format(query)
    return prompt
