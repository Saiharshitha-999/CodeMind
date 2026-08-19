import ast
def parse_python_code(code):
    tree = ast.parse(code)
    return tree

