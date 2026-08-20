def analyze_complexity(features):

    max_loop_depth = features["max_loop_depth"]
    recursion = features["recursion"]

    # Time complexity
    if max_loop_depth == 0:
        time_complexity = "O(1)"
    elif max_loop_depth == 1:
        time_complexity = "O(n)"
    elif max_loop_depth == 2:
        time_complexity = "O(n^2)"
    else:
        time_complexity = f"O(n^{max_loop_depth})"

    # Space complexity
    if recursion:
        space_complexity = "O(n)"
    else:
        space_complexity = "O(1)"

    return {
        "time": time_complexity,
        "space": space_complexity
    }