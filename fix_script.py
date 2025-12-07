#!/usr/bin/env python3
import re

# Read the file
with open('/workspace/src/js/script.js', 'r') as f:
    content = f.read()

# Replace the problematic line at line 771
# Find the pattern with the incorrect regex
pattern = r"const fixedOptionText = option\.text\.replace\(/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\(/g, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\('\)\.replace\(/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\)/g, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\)'\)\.replace\(/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\[/g, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\['\)\.replace\(/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\]/g, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\]'\);"

replacement = r"const fixedOptionText = option.text.replace(/\\\\\\\\\\\\(/g, '\\\\(').replace(/\\\\\\\\\\\\)/g, '\\\\)').replace(/\\\\\\\\\\\\[/g, '\\\\[').replace(/\\\\\\\\\\\\]/g, '\\\\]');"

content = re.sub(pattern, replacement, content)

# Write the file back
with open('/workspace/src/js/script.js', 'w') as f:
    f.write(content)

print("Fixed the regex issue in script.js")