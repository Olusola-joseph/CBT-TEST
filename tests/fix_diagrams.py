#!/usr/bin/env python3
import json
import re

def fix_chord_diagram(svg_content):
    """Fix the chord diagram to properly show a chord from one edge of circle to another"""
    # Replace the current chord line with a proper chord that goes from one edge to another
    # The current chord is horizontal at y=200, from x=100 to x=200
    # This is not a proper chord - it's just a horizontal line
    # We'll make it go from one side of the circle to the other side
    # Circle center is at (150, 150) with radius 100
    # A proper chord would go from (80, 80) to (220, 80) - this is a proper chord
    
    fixed_svg = svg_content.replace(
        '<line x1=\"100\" y1=\"200\" x2=\"200\" y2=\"200\" stroke=\"red\" stroke-width=\"3\"/>',
        '<line x1=\"80\" y1=\"80\" x2=\"220\" y2=\"80\" stroke=\"red\" stroke-width=\"3\"/>'
    )
    # Fix the perpendicular from center to chord - should go from (150,150) to (150,80) - midpoint of chord
    fixed_svg = fixed_svg.replace(
        '<line x1=\"150\" y1=\"150\" x2=\"150\" y2=\"200\" stroke=\"blue\" stroke-width=\"2\" stroke-dasharray=\"5,5\"/>',
        '<line x1=\"150\" y1=\"150\" x2=\"150\" y2=\"80\" stroke=\"blue\" stroke-width=\"2\" stroke-dasharray=\"5,5\"/>'
    )
    # Fix the radius line - should go from center (150,150) to one end of chord, let's say (220,80)
    fixed_svg = fixed_svg.replace(
        '<line x1=\"150\" y1=\"150\" x2=\"200\" y2=\"200\" stroke=\"green\" stroke-width=\"2\"/>',
        '<line x1=\"150\" y1=\"150\" x2=\"220\" y2=\"80\" stroke=\"green\" stroke-width=\"2\"/>'
    )
    # Also fix the chord length label to point to the new chord
    fixed_svg = fixed_svg.replace(
        '<text x=\"175\" y=\"205\" font-size=\"12\" fill=\"red\">12 cm</text>',
        '<text x=\"140\" y=\"70\" font-size=\"12\" fill=\"red\">12 cm</text>'
    )
    # Update the '8 cm' label for the perpendicular distance (now it goes from (150,150) to (150,80), so distance is 150-80=70, but the question says 8cm)
    fixed_svg = fixed_svg.replace(
        '<text x=\"155\" y=\"180\" font-size=\"12\" fill=\"blue\">8 cm</text>',
        '<text x=\"155\" y=\"120\" font-size=\"12\" fill=\"blue\">8 cm</text>'
    )
    # Update the chord points labels
    fixed_svg = fixed_svg.replace(
        '<text x=\"95\" y=\"205\" font-size=\"12\" fill=\"black\">B</text>',
        '<text x=\"70\" y=\"75\" font-size=\"12\" fill=\"black\">B</text>'
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"195\" y=\"205\" font-size=\"12\" fill=\"black\">A</text>',
        '<text x=\"215\" y=\"75\" font-size=\"12\" fill=\"black\">A</text>'
    )
    # Update the midpoint label - now at (150, 80)
    fixed_svg = fixed_svg.replace(
        '<text x=\"155\" y=\"205\" font-size=\"12\" fill=\"black\">M</text>',
        '<text x=\"155\" y=\"85\" font-size=\"12\" fill=\"black\">M</text>'
    )
    # Update the 'r = ?' label position to be near the radius line
    fixed_svg = fixed_svg.replace(
        '<text x=\"180\" y=\"180\" font-size=\"12\" fill=\"green\">r = ?</text>',
        '<text x=\"190\" y=\"120\" font-size=\"12\" fill=\"green\">r = ?</text>'
    )
    
    return fixed_svg

def fix_trigonometry_diagram(svg_content):
    """Fix the trigonometry diagram to correctly show hypotenuse, opposite, and adjacent"""
    # The current triangle is defined as points (100,150 200,150 150,80)
    # This creates a triangle with right angle at (150,150), horizontal base from (100,150) to (200,150), 
    # and vertical side from (150,150) to (150,80), with hypotenuse from (100,150) to (150,80)
    
    # Let's create a proper right triangle with right angle at (100,150)
    # Points: (100,150) - right angle, (200,150) - along x-axis (adjacent), (100,80) - along y-axis (opposite)
    # So the triangle will be (100,150), (200,150), (100,80)
    
    fixed_svg = svg_content.replace(
        '<polygon points=\"100,150 200,150 150,80\" fill=\"none\" stroke=\"black\" stroke-width=\"2\"/>',
        '<polygon points=\"100,150 200,150 100,80\" fill=\"none\" stroke=\"black\" stroke-width=\"2\"/>'
    )
    
    # Update the right angle marker to be at the right position (at 100,150)
    fixed_svg = fixed_svg.replace(
        '<line x1=\"145\" y1=\"150\" x2=\"145\" y2=\"145\" stroke=\"black\" stroke-width=\"2\"/>',
        '<line x1=\"100\" y1=\"150\" x2=\"105\" y2=\"150\" stroke=\"black\" stroke-width=\"2\"/>'
    )
    fixed_svg = fixed_svg.replace(
        '<line x1=\"145\" y1=\"145\" x2=\"150\" y2=\"145\" stroke=\"black\" stroke-width=\"2\"/>',
        '<line x1=\"105\" y1=\"150\" x2=\"105\" y2=\"145\" stroke=\"black\" stroke-width=\"2\"/>'
    )
    
    # Update labels to match the new triangle with proper sides
    # Original: 3 (vertical from 150,80), 4 (horizontal from 100,150 to 200,150), 5 (hypotenuse from 100,150 to 150,80)
    # New: 3 (vertical side from 100,150 to 100,80), 4 (horizontal side from 100,150 to 200,150), 5 (hypotenuse from 100,80 to 200,150)
    # Actually, let's make it: 3 (vertical side), 4 (horizontal side), 5 (hypotenuse)
    # So: 3 (from 100,150 to 100,80), 4 (from 100,150 to 200,150), 5 (from 100,80 to 200,150)
    fixed_svg = fixed_svg.replace(
        '<text x=\"90\" y=\"155\" font-size=\"14\">3</text>',  # Originally on horizontal, now on vertical side
        '<text x=\"90\" y=\"115\" font-size=\"14\">3</text>'   # Now on vertical side
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"175\" y=\"155\" font-size=\"14\">4</text>',  # Originally on horizontal
        '<text x=\"140\" y=\"160\" font-size=\"14\">4</text>'   # Now on horizontal side
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"140\" y=\"100\" font-size=\"14\">5</text>',  # Originally on diagonal
        '<text x=\"150\" y=\"120\" font-size=\"14\">5</text>'   # Now on hypotenuse
    )
    
    # Update the side labels to be accurate
    fixed_svg = fixed_svg.replace(
        '<text x=\"145\" y=\"165\" font-size=\"14\">Adjacent</text>',  # This was on horizontal
        '<text x=\"140\" y=\"165\" font-size=\"14\">Adjacent</text>'   # Horizontal side (from 100,150 to 200,150)
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"175\" y=\"125\" font-size=\"14\">Hypotenuse</text>',  # This was on diagonal
        '<text x=\"150\" y=\"100\" font-size=\"14\">Hypotenuse</text>'   # Diagonal side (from 100,80 to 200,150)
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"115\" y=\"125\" font-size=\"14\">Opposite</text>',  # This was on diagonal
        '<text x=\"85\" y=\"115\" font-size=\"14\">Opposite</text>'     # Vertical side (from 100,150 to 100,80)
    )
    
    return fixed_svg

def process_questions_file(input_file, output_file):
    """Process the questions file to fix diagrams"""
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for question in data['questions']:
        # Process explanation
        if 'explanation' in question:
            explanation = question['explanation']
            
            # Fix chord diagram if present
            if 'chord' in explanation.lower():
                # Find SVG content and fix it
                svg_pattern = r'(<svg[^>]*>.*?</svg>)'
                matches = re.findall(svg_pattern, explanation, re.DOTALL)
                for match in matches:
                    fixed_svg = fix_chord_diagram(match)
                    explanation = explanation.replace(match, fixed_svg)
            
            # Fix trigonometry diagram if present
            if any(term in explanation.lower() for term in ['hypotenuse', 'opposite', 'adjacent', 'sin', 'cos', 'tan']):
                # Find SVG content and fix it
                svg_pattern = r'(<svg[^>]*>.*?</svg>)'
                matches = re.findall(svg_pattern, explanation, re.DOTALL)
                for match in matches:
                    fixed_svg = fix_trigonometry_diagram(match)
                    explanation = explanation.replace(match, fixed_svg)
            
            question['explanation'] = explanation
    
    # Write the processed data back to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_questions_file('/workspace/mathematics_questions.json', '/workspace/mathematics_questions_diagrams_fixed.json')
    print("Processing complete. Output saved to mathematics_questions_diagrams_fixed.json")