#!/usr/bin/env python3

import json

# Read the file
with open('/workspace/mathematics_questions.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old and new SVG content
old_svg = '''<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Circle -->
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none"/>
      
      <!-- Chord -->
      <line x1="100" y1="200" x2="200" y2="200" stroke="red" stroke-width="3"/>
      
      <!-- Perpendicular from center to chord -->
      <line x1="150" y1="150" x2="150" y2="200" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius to one end of chord -->
      <line x1="150" y1="150" x2="200" y2="200" stroke="green" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="155" y="180" font-size="12" fill="blue">8 cm</text>
      <text x="175" y="205" font-size="12" fill="red">12 cm</text>
      <text x="180" y="180" font-size="12" fill="green">r = ?</text>
      <text x="155" y="145" font-size="12" fill="black">O</text>
      <text x="195" y="205" font-size="12" fill="black">A</text>
      <text x="95" y="205" font-size="12" fill="black">B</text>
      <text x="155" y="205" font-size="12" fill="black">M</text>
    </svg>'''

new_svg = '''<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Circle -->
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none"/>
      
      <!-- Chord -->
      <line x1="100" y1="100" x2="200" y2="100" stroke="red" stroke-width="3"/>
      
      <!-- Perpendicular from center to chord -->
      <line x1="150" y1="150" x2="150" y2="100" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius to one end of chord -->
      <line x1="150" y1="150" x2="200" y2="100" stroke="green" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="155" y="125" font-size="12" fill="blue">8 cm</text>
      <text x="140" y="95" font-size="12" fill="red">12 cm</text>
      <text x="180" y="130" font-size="12" fill="green">r = ?</text>
      <text x="155" y="145" font-size="12" fill="black">O</text>
      <text x="195" y="105" font-size="12" fill="black">A</text>
      <text x="95" y="105" font-size="12" fill="black">B</text>
      <text x="145" y="105" font-size="12" fill="black">M</text>
    </svg>'''

# Replace the first occurrence (and effectively all since they're the same)
updated_content = content.replace(old_svg, new_svg)

# Write the updated content back to the file
with open('/workspace/mathematics_questions.json', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Chord diagram updated successfully!")