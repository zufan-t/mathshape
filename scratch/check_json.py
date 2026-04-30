import json
import sys

try:
    with open(r'd:\Website\Pengabdian\tsconfig.app.json', 'r') as f:
        # JSON standard doesn't allow comments, but TSConfig does.
        # We need to strip comments to check validity with standard json module.
        content = f.read()
        # Simple comment stripper (not perfect but enough for this)
        import re
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        content = re.sub(r'//.*', '', content)
        json.loads(content)
    print("Valid JSON (after stripping comments)")
except Exception as e:
    print(f"JSON Error: {e}")
