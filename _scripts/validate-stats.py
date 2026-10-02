"""Reject error cards before they replace the last working GitHub statistics."""
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

def validate(path):
    root = ET.parse(path).getroot()
    if root.tag != "{http://www.w3.org/2000/svg}svg":
        raise ValueError("not an SVG")
    text = " ".join(root.itertext()).lower()
    errors = ("something went wrong", "resource not accessible", "rate limit", "bad credentials")
    if any(message in text for message in errors):
        raise ValueError("GitHub statistics service returned an error card")
    if not any(node.get("data-testid") == "commits" for node in root.iter()):
        raise ValueError("missing expected statistics")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Usage: validate-stats.py CARD.svg [CARD.svg ...]")
    for filename in sys.argv[1:]:
        try:
            validate(Path(filename))
        except (OSError, ET.ParseError, ValueError) as error:
            sys.exit(f"{filename}: {error}")
    print("Validated all statistics cards.")
