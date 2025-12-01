#!/usr/bin/env python3
import json
import re

def remove_mathjax_inline(text):
    """Remove inline MathJax expressions and replace with plain text"""
    if not isinstance(text, str):
        return text
    
    # Replace \( ... \) and \[ ... \] with just the content inside
    # For \(\) - inline math
    text = re.sub(r'\\\\\\\\\\(', '', text)
    text = re.sub(r'\\\\\\\\\\)', '', text)
    # For \[\] - display math
    text = re.sub(r'\\\\\\\\\\[', '', text)
    text = re.sub(r'\\\\\\\\\\]', '', text)
    
    # Remove other MathJax constructs
    text = re.sub(r'\\\\text{([^}]*)}', r'\1', text)  # \text{...} to plain text
    text = re.sub(r'\\\\frac{([^}]*)}{([^}]*)}', r'(\1/\2)', text)  # fractions
    text = re.sub(r'\\\\frac\\s+([^\\s]+)\\s+([^\\s]+)', r'(\1/\2)', text)  # fractions
    text = re.sub(r'\\\\sqrt{([^}]*)}', r'sqrt(\1)', text)  # square roots
    text = re.sub(r'\\\\sqrt\\s+([^\\s]+)', r'sqrt(\1)', text)  # square roots
    text = re.sub(r'\\\\log_([^}]+)}', r'log_\1', text)  # logs
    text = re.sub(r'\\\\log_{([^}]+)}', r'log_\1', text)  # logs
    text = re.sub(r'\\\\sin\\s', 'sin ', text)  # sin
    text = re.sub(r'\\\\cos\\s', 'cos ', text)  # cos
    text = re.sub(r'\\\\tan\\s', 'tan ', text)  # tan
    text = re.sub(r'\\\\theta', 'θ', text)  # theta
    text = re.sub(r'\\\\propto', '∝', text)  # proportional
    text = re.sub(r'\\\\times', '×', text)  # times
    text = re.sub(r'\\\\div', '÷', text)  # division
    text = re.sub(r'\\\\sim', '~', text)  # similar
    text = re.sub(r'\\\\angle', '∠', text)  # angle
    text = re.sub(r'\\\\parallel', '∥', text)  # parallel
    text = re.sub(r'\\\\perp', '⊥', text)  # perpendicular
    text = re.sub(r'\\\\leq', '≤', text)  # less than or equal
    text = re.sub(r'\\\\geq', '≥', text)  # greater than or equal
    text = re.sub(r'\\\\neq', '≠', text)  # not equal
    text = re.sub(r'\\\\infty', '∞', text)  # infinity
    text = re.sub(r'\\\\int', '∫', text)  # integral
    text = re.sub(r'\\\\sum', 'Σ', text)  # sum
    text = re.sub(r'\\\\partial', '∂', text)  # partial
    text = re.sub(r'\\\\alpha', 'α', text)  # alpha
    text = re.sub(r'\\\\beta', 'β', text)  # beta
    text = re.sub(r'\\\\gamma', 'γ', text)  # gamma
    text = re.sub(r'\\\\Delta', 'Δ', text)  # Delta
    text = re.sub(r'\\\\delta', 'δ', text)  # delta
    text = re.sub(r'\\\\pi', 'π', text)  # pi
    text = re.sub(r'\\\\in', '∈', text)  # element of
    text = re.sub(r'\\\\cup', '∪', text)  # union
    text = re.sub(r'\\\\cap', '∩', text)  # intersection
    text = re.sub(r'\\\\subset', '⊂', text)  # subset
    text = re.sub(r'\\\\subseteq', '⊆', text)  # subset or equal
    text = re.sub(r'\\\\emptyset', '∅', text)  # empty set
    text = re.sub(r'\\\\rightarrow', '→', text)  # right arrow
    text = re.sub(r'\\\\Rightarrow', '⇒', text)  # right arrow (Rightarrow)
    text = re.sub(r'\\\\leftrightarrow', '↔', text)  # left-right arrow
    text = re.sub(r'\\\\Leftrightarrow', '⇔', text)  # left-right arrow (Leftrightarrow)
    text = re.sub(r'\\\\degree', '°', text)  # degree
    text = re.sub(r'\\\\overline{([^}]*)}', r'\1', text)  # overline
    text = re.sub(r'\\\\underbrace{([^}]*)}', r'\1', text)  # underbrace
    
    # Handle superscripts and subscripts
    text = re.sub(r'\\^\\{([^}]*)\\}', r'^(\1)', text)  # superscripts
    text = re.sub(r'_\\{([^}]*)\\}', r'_(\1)', text)  # subscripts
    text = re.sub(r'\\^([0-9a-zA-Z])', r'^(\1)', text)  # superscripts
    text = re.sub(r'_([0-9a-zA-Z])', r'_(\1)', text)  # subscripts
    
    # Clean up multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text

def fix_chord_diagram(svg_content):
    """Fix the chord diagram to properly show a chord from one edge of circle to another"""
    # Replace the current chord line with a proper chord that goes from one edge to another
    # The current chord is horizontal at y=200, from x=100 to x=200
    # We'll make it go from one edge of the circle to another edge
    # Circle center is at (150, 150) with radius 100
    # A proper chord would go from (80, 80) to (220, 80) or similar
    fixed_svg = svg_content.replace(
        '<line x1=\"100\" y1=\"200\" x2=\"200\" y2=\"200\" stroke=\"red\" stroke-width=\"3\"/>',
        '<line x1=\"80\" y1=\"80\" x2=\"220\" y2=\"80\" stroke=\"red\" stroke-width=\"3\"/>'
    )
    # Also fix the chord length label to point to the new chord
    fixed_svg = fixed_svg.replace(
        '<text x=\"175\" y=\"205\" font-size=\"12\" fill=\"red\">12 cm</text>',
        '<text x=\"140\" y=\"70\" font-size=\"12\" fill=\"red\">12 cm</text>'
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
    # Update the midpoint label
    fixed_svg = fixed_svg.replace(
        '<text x=\"155\" y=\"205\" font-size=\"12\" fill=\"black\">M</text>',
        '<text x=\"155\" y=\"75\" font-size=\"12\" fill=\"black\">M</text>'
    )
    
    return fixed_svg

def fix_trigonometry_diagram(svg_content):
    """Fix the trigonometry diagram to correctly show hypotenuse, opposite, and adjacent"""
    # The current triangle is defined as points (100,150 200,150 150,80)
    # This creates a triangle with right angle at (100,150), horizontal base from (100,150) to (200,150), 
    # and vertical side from (100,150) to (150,80)
    # The hypotenuse should be from (100,150) to (150,80)
    # The adjacent side should be from (100,150) to (200,150) 
    # The opposite side should be from (200,150) to (150,80)
    
    # Let's create a proper right triangle with right angle at (100,150)
    # Hypotenuse: from (100,150) to (150,80) 
    # Adjacent: from (100,150) to (200,150) (horizontal)
    # Opposite: from (200,150) to (150,80) (vertical component)
    
    # Update the triangle points to be clearer
    fixed_svg = svg_content.replace(
        '<polygon points=\"100,150 200,150 150,80\" fill=\"none\" stroke=\"black\" stroke-width=\"2\"/>',
        '<polygon points=\"100,150 200,150 100,80\" fill=\"none\" stroke=\"black\" stroke-width=\"2\"/>'
    )
    
    # Update the right angle marker to be at the right position
    fixed_svg = fixed_svg.replace(
        '<line x1=\"145\" y1=\"150\" x2=\"145\" y2=\"145\" stroke=\"black\" stroke-width=\"2\"/>',
        '<line x1=\"100\" y1=\"150\" x2=\"105\" y2=\"150\" stroke=\"black\" stroke-width=\"2\"/>'
    )
    fixed_svg = fixed_svg.replace(
        '<line x1=\"145\" y1=\"145\" x2=\"150\" y2=\"145\" stroke=\"black\" stroke-width=\"2\"/>',
        '<line x1=\"105\" y1=\"150\" x2=\"105\" y2=\"145\" stroke=\"black\" stroke-width=\"2\"/>'
    )
    
    # Update labels to match the new triangle
    fixed_svg = fixed_svg.replace(
        '<text x=\"90\" y=\"155\" font-size=\"14\">3</text>',  # Opposite side
        '<text x=\"90\" y=\"115\" font-size=\"14\">3</text>'   # Now vertical side
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"175\" y=\"155\" font-size=\"14\">4</text>',  # Adjacent side
        '<text x=\"140\" y=\"160\" font-size=\"14\">4</text>'   # Now horizontal side
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"140\" y=\"100\" font-size=\"14\">5</text>',  # Hypotenuse
        '<text x=\"120\" y=\"120\" font-size=\"14\">5</text>'   # Now diagonal side
    )
    
    # Update the side labels to be accurate
    fixed_svg = fixed_svg.replace(
        '<text x=\"145\" y=\"165\" font-size=\"14\">Adjacent</text>',  # This was wrong before
        '<text x=\"140\" y=\"165\" font-size=\"14\">Adjacent</text>'   # Horizontal side
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"175\" y=\"125\" font-size=\"14\">Hypotenuse</text>',  # This was wrong before
        '<text x=\"115\" y=\"110\" font-size=\"14\">Hypotenuse</text>'   # Diagonal side
    )
    fixed_svg = fixed_svg.replace(
        '<text x=\"115\" y=\"125\" font-size=\"14\">Opposite</text>',  # This was wrong before
        '<text x=\"85\" y=\"115\" font-size=\"14\">Opposite</text>'     # Vertical side
    )
    
    return fixed_svg

def process_questions_file(input_file, output_file):
    """Process the questions file to remove MathJax and fix diagrams"""
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for question in data['questions']:
        # Process question text
        if 'question' in question:
            question['question'] = remove_mathjax_inline(question['question'])
        
        # Process options
        if 'options' in question:
            for option in question['options']:
                if 'text' in option:
                    option['text'] = remove_mathjax_inline(option['text'])
        
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
            
            question['explanation'] = remove_mathjax_inline(explanation)
    
    # Write the processed data back to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_questions_file('/workspace/mathematics_questions.json', '/workspace/mathematics_questions_fixed.json')
    print("Processing complete. Output saved to mathematics_questions_fixed.json")