#!/usr/bin/env python3

# Read the file line by line
with open('/workspace/src/js/script.js', 'r') as f:
    lines = f.readlines()

# Fix the specific line (771, which is index 770)
# Note: line numbers start from 1, list indices start from 0
target_line_index = 770  # This is line 771

if target_line_index < len(lines):
    old_line = lines[target_line_index]
    
    # Replace the problematic regex patterns
    new_line = old_line.replace("replace(/\\\\\\\\\\\\(/g, '\\\\\\\\(')", "replace(/\\\\\\\\\\\\(/g, '\\\\(')")
    new_line = new_line.replace("replace(/\\\\\\\\\\\\)/g, '\\\\\\\\)')", "replace(/\\\\\\\\\\\\)/g, '\\\\)')")
    new_line = new_line.replace("replace(/\\\\\\\\\\\\\\\\\\\\\\\\[/g, '\\\\\\\\[')", "replace(/\\\\\\\\\\\\[/g, '\\\\[')")
    new_line = new_line.replace("replace(/\\\\\\\\\\\\\\\\\\\\\\\\]/g, '\\\\\\\\]')", "replace(/\\\\\\\\\\\\]/g, '\\\\]')")
    
    lines[target_line_index] = new_line

# Write the file back
with open('/workspace/src/js/script.js', 'w') as f:
    f.writelines(lines)

print("Fixed the regex issue in script.js line by line")