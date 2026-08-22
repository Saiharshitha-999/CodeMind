import ast

def extract_features(tree):
    features = {
        "loops": 0,
        "conditionals": 0,
        "functions": 0,
        "max_loop_depth": 0,
        "recursion": False,
        "loop_details" : []
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

            if isinstance(node, ast.For):
                if isinstance(node.iter, ast.Call):

                    if isinstance(node.iter.func, ast.Name):
                        if node.iter.func.id == "range":
                            range_arg = node.iter.arg[0]

                            if isinstance(range_arg,ast.Name):
                                bound = range_arg.id
                            elif isinstance(range_arg,ast.Constant):
                                bound = range_arg.value
                            elif isinstance(range_arg,ast.BinOp):
                                if isinstance(range_arg.op, ast.Mult):
                                    left = range_arg.left
                                    right = range_arg.right

                                    if isinstance(left, ast.Name) and isinstance(right, ast.Name):
                                        if left.id == right.id:
                                            bound = f"{left.id}^2"
                            elif isinstance(range_arg.op, (ast.Add, ast.Sub,ast.Div)):
                                if isinstance(range_arg.left, ast.Name):
                                    bound = range_arg.left.id
                            else:
                                bount = "unknown"
                            features["loop_details"].append({
                                "type": "for",
                                "iterator": "range"
                            })

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

