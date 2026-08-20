from .parser import parse_python_code
from .features import extract_features
from .complexity import analyze_complexity


def analyze_code(code, language):

    if language.lower() == "python":

        tree = parse_python_code(code)

        features = extract_features(tree)

        complexity = analyze_complexity(features)

        return {
            "language": language,
            "features": features,
            "complexity": complexity
        }

    return {
        "language": language,
        "message": "Language not supported yet"
    }