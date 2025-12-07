#!/usr/bin/env python3

# Script to fix the commented out lines in script.js that display questions

with open('/workspace/src/js/script.js', 'r') as file:
    lines = file.readlines()

# Replace the commented lines
for i, line in enumerate(lines):
    if 'const fixedQuestionHtml' in line and line.strip().startswith('// const'):
        lines[i] = line.replace('// const', 'const')
    elif 'document.getElementById(\'question-text\')' in line and line.strip().startswith('// document.getElementById'):
        lines[i] = line.replace('// document.getElementById', 'document.getElementById')
    elif 'document.getElementById(\'current-q\')' in line and line.strip().startswith('//document.getElementById'):
        lines[i] = line.replace('//document.getElementById', 'document.getElementById')
    elif 'document.getElementById(\'total-q\')' in line and line.strip().startswith('// document.getElementById'):
        lines[i] = line.replace('// document.getElementById', 'document.getElementById')

with open('/workspace/src/js/script.js', 'w') as file:
    file.writelines(lines)

print("Fixed the commented lines in script.js")