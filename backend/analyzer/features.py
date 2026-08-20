import ast

def extract_features(tree):
    features = {
        "loops": 0,
        "conditionals": 0,
        "functions": 0,
        "max_loop_depth": 0,
        "recursion": False
    }

    function_names = set()

    def visit(node, loop_depth=0, current_function=None):

        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            features["functions"] += 1

            current_function = node.name
            function_names.add(node.name)

        # Loop
        if isinstance(node, (ast.For, ast.While)):
            features["loops"] += 1

            current_depth = loop_depth + 1

            if current_depth > features["max_loop_depth"]:
                features["max_loop_depth"] = current_depth

            for child in ast.iter_child_nodes(node):
                visit(child, current_depth, current_function)

            return

        if isinstance(node, ast.If):
            features["conditionals"] += 1

        if isinstance(node, ast.Call):
            if (
                current_function is not None
                and isinstance(node.func, ast.Name)
                and node.func.id == current_function
            ):
                features["recursion"] = True

        for child in ast.iter_child_nodes(node):
            visit(child, loop_depth, current_function)

    visit(tree)

    return features

