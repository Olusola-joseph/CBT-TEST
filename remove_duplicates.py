#!/usr/bin/env python3

import re

# Read the file
with open('/workspace/mathematics_questions.json', 'r') as f:
    content = f.read()

# Find the chord question explanation (around line with chord of length 12 cm is 8 cm from the centre)
# Replace multiple duplicate SVG diagrams with a single one
def remove_duplicate_svgs(match):
    # Get the explanation content
    explanation = match.group(0)
    
    # Find all SVG diagram containers
    diagram_pattern = r'<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>'
    diagrams = re.findall(diagram_pattern, explanation)
    
    if len(diagrams) > 1:
        # Keep only the first diagram and remove the rest
        first_diagram = diagrams[0]
        # Remove all diagram containers from the explanation
        cleaned_explanation = re.sub(diagram_pattern + r'(\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>)*', first_diagram + '",', explanation)
        return cleaned_explanation
    return explanation

# Replace the chord question explanation specifically
chord_pattern = r'("explanation": "Circle geometry relies on \*key theorems\*—here, the perpendicular from the centre to a chord \*bisects\* the chord.*?)(<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>")'
    
# Replace multiple diagrams with just one
content = re.sub(chord_pattern, lambda m: m.group(1) + '<div class=\\"diagram-container\\"><h5>Diagram:</h5>\\n    <svg width=\\"300\\" height=\\"300\\" viewBox=\\"0 0 300 300\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n      <!-- Circle -->\\n      <circle cx=\\"150\\" cy=\\"150\\" r=\\"100\\" stroke=\\"black\\" stroke-width=\\"2\\" fill=\\"none\\"/>\\n      \\n      <!-- Chord -->\\n      <line x1=\\"100\\" y1=\\"200\\" x2=\\"200\\" y2=\\"200\\" stroke=\\"red\\" stroke-width=\\"3\\"/>\\n      \\n      <!-- Perpendicular from center to chord -->\\n      <line x1=\\"150\\" y1=\\"150\\" x2=\\"150\\" y2=\\"200\\" stroke=\\"blue\\" stroke-width=\\"2\\" stroke-dasharray=\\"5,5\\"/>\\n      \\n      <!-- Radius to one end of chord -->\\n      <line x1=\\"150\\" y1=\\"150\\" x2=\\"200\\" y2=\\"200\\" stroke=\\"green\\" stroke-width=\\"2\\"/>\\n      \\n      <!-- Labels -->\\n      <text x=\\"155\\" y=\\"180\\" font-size=\\"12\\" fill=\\"blue\\">8 cm</text>\\n      <text x=\\"175\\" y=\\"205\\" font-size=\\"12\\" fill=\\"red\\">12 cm</text>\\n      <text x=\\"180\\" y=\\"180\\" font-size=\\"12\\" fill=\\"green\\">r = ?</text>\\n      <text x=\\"155\\" y=\\"145\\" font-size=\\"12\\" fill=\\"black\\">O</text>\\n      <text x=\\"195\\" y=\\"205\\" font-size=\\"12\\" fill=\\"black\\">A</text>\\n      <text x=\\"95\\" y=\\"205\\" font-size=\\"12\\" fill=\\"black\\">B</text>\\n      <text x=\\"155\\" y=\\"205\\" font-size=\\"12\\" fill=\\"black\\">M</text>\\n    </svg>\\n    </div>",', content)

# Now find and fix the other duplicate SVG issue (standard form question)
standard_form_pattern = r'("explanation": "Standard form \(scientific notation\) expresses numbers as.*?)(<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>\\s*<div class=\\"diagram-container\\"><h5>Diagram:</h5>.*?</svg>\\n    </div>")'

# Replace multiple diagrams with just one for the standard form question
content = re.sub(standard_form_pattern, lambda m: m.group(1) + '<div class=\\"diagram-container\\"><h5>Diagram:</h5>\\n    <svg width=\\"300\\" height=\\"200\\" viewBox=\\"0 0 300 200\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n      <!-- Triangle -->\\n      <polygon points=\\"100,150 200,150 150,80\\" fill=\\"none\\" stroke=\\"black\\" stroke-width=\\"2\\"/>\\n      \\n      <!-- Right angle marker -->\\n      <line x1=\\"145\\" y1=\\"150\\" x2=\\"145\\" y2=\\"145\\" stroke=\\"black\\" stroke-width=\\"2\\"/>\\n      <line x1=\\"145\\" y1=\\"145\\" x2=\\"150\\" y2=\\"145\\" stroke=\\"black\\" stroke-width=\\"2\\"/>\\n      \\n      <!-- Labels -->\\n      <text x=\\"90\\" y=\\"155\\" font-size=\\"14\\">3</text>\\n      <text x=\\"175\\" y=\\"155\\" font-size=\\"14\\">4</text>\\n      <text x=\\"140\\" y=\\"100\\" font-size=\\"14\\">5</text>\\n      <text x=\\"145\\" y=\\"165\\" font-size=\\"14\\">Adjacent</text>\\n      <text x=\\"175\\" y=\\"125\\" font-size=\\"14\\">Hypotenuse</text>\\n      <text x=\\"115\\" y=\\"125\\" font-size=\\"14\\">Opposite</text>\\n    </svg>\\n    </div>",', content)

# Write the file back
with open('/workspace/mathematics_questions.json', 'w') as f:
    f.write(content)

print("Duplicate SVG diagrams removed successfully!")