import ast

def extract_features(tree):
    features = {
        "loops": 0,
        "conditionals": 0,
        "functions": 0,
        "max_loop_depth": 0,
        "recursion": False
    }

    def visit(node, loop_depth=0):

        if isinstance(node, (ast.For, ast.While)):
            features["loops"] += 1

            current_depth = loop_depth + 1

            if current_depth > features["max_loop_depth"]:
                features["max_loop_depth"] = current_depth

            for child in ast.iter_child_nodes(node):
                visit(child, current_depth)

            return

        if isinstance(node, ast.If):
            features["conditionals"] += 1

        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            features["functions"] += 1

        for child in ast.iter_child_nodes(node):
            visit(child, loop_depth)

    visit(tree)

    return features