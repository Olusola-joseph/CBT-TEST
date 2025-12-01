#!/usr/bin/env python3

import json

# Read the file
with open('/workspace/mathematics_questions.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old and new SVG content for the trigonometry question
old_svg = '''<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Triangle -->
      <polygon points="100,150 200,150 150,80" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Right angle marker -->
      <line x1="145" y1="150" x2="145" y2="145" stroke="black" stroke-width="2"/>
      <line x1="145" y1="145" x2="150" y2="145" stroke="black" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="90" y="155" font-size="14">3</text>
      <text x="175" y="155" font-size="14">4</text>
      <text x="140" y="100" font-size="14">5</text>
      <text x="145" y="165" font-size="14">Adjacent</text>
      <text x="175" y="125" font-size="14">Hypotenuse</text>
      <text x="115" y="125" font-size="14">Opposite</text>
    </svg>'''

new_svg = '''<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Triangle -->
      <polygon points="100,150 200,150 100,90" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Right angle marker -->
      <line x1="100" y1="150" x2="100" y2="140" stroke="black" stroke-width="2"/>
      <line x1="100" y1="150" x2="110" y2="150" stroke="black" stroke-width="2"/>
      
      <!-- Sides of the triangle -->
      <line x1="100" y1="150" x2="200" y2="150" stroke="blue" stroke-width="2" stroke-dasharray="4,2"/>
      <line x1="100" y1="150" x2="100" y2="90" stroke="red" stroke-width="2" stroke-dasharray="4,2"/>
      <line x1="100" y1="90" x2="200" y2="150" stroke="green" stroke-width="2" stroke-dasharray="4,2"/>
      
      <!-- Labels -->
      <text x="145" y="155" font-size="12" fill="blue">Adjacent = 4</text>
      <text x="90" y="120" font-size="12" fill="red">Opposite = 3</text>
      <text x="155" y="120" font-size="12" fill="green">Hypotenuse = 5</text>
    </svg>'''

# Replace the trigonometry SVG (which should be in the explanation of the sin theta question)
updated_content = content.replace(old_svg, new_svg)

# Write the updated content back to the file
with open('/workspace/mathematics_questions.json', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Trigonometry diagram updated successfully!")