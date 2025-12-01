#!/usr/bin/env python3
import json
import re

def remove_mathjax_inline(text):
    """Remove inline MathJax expressions and replace with plain text"""
    if not isinstance(text, str):
        return text
    
    # Replace \( ... \) with just the content inside
    text = re.sub(r'\\\\\\\((.*?)\\\\\\\)', r'\1', text)
    # Replace \[ ... \] with just the content inside  
    text = re.sub(r'\\\\\\\[(.*?)\\\\\\\]', r'\1', text)
    
    # Remove other MathJax constructs
    text = re.sub(r'\\\\\\text\\{(.*?)\\}', r'\1', text)  # \text{...} to plain text
    text = re.sub(r'\\\\\\frac\\{(.*?)\\}\\{(.*?)\\}', r'(\1/\2)', text)  # fractions
    text = re.sub(r'\\\\\\sqrt\\{(.*?)\\}', r'sqrt(\1)', text)  # square roots
    text = re.sub(r'\\\\\\log_([^{]*?)\\{(.*?)\\}', r'log_\1(\2)', text)  # logs with base
    text = re.sub(r'\\\\\\log\\{(.*?)\\}', r'log(\1)', text)  # logs
    text = re.sub(r'\\\\\\log_([a-zA-Z0-9]+)', r'log_\1', text)  # logs with base
    text = re.sub(r'\\\\\\sin ', 'sin ', text)  # sin
    text = re.sub(r'\\\\\\cos ', 'cos ', text)  # cos
    text = re.sub(r'\\\\\\tan ', 'tan ', text)  # tan
    text = re.sub(r'\\\\\\theta', 'θ', text)  # theta
    text = re.sub(r'\\\\\\propto', '∝', text)  # proportional
    text = re.sub(r'\\\\\\times', '×', text)  # times
    text = re.sub(r'\\\\\\div', '÷', text)  # division
    text = re.sub(r'\\\\\\sim', '~', text)  # similar
    text = re.sub(r'\\\\\\angle', '∠', text)  # angle
    text = re.sub(r'\\\\\\parallel', '∥', text)  # parallel
    text = re.sub(r'\\\\\\perp', '⊥', text)  # perpendicular
    text = re.sub(r'\\\\\\leq', '≤', text)  # less than or equal
    text = re.sub(r'\\\\\\geq', '≥', text)  # greater than or equal
    text = re.sub(r'\\\\\\neq', '≠', text)  # not equal
    text = re.sub(r'\\\\\\infty', '∞', text)  # infinity
    text = re.sub(r'\\\\\\int', '∫', text)  # integral
    text = re.sub(r'\\\\\\sum', 'Σ', text)  # sum
    text = re.sub(r'\\\\\\partial', '∂', text)  # partial
    text = re.sub(r'\\\\\\alpha', 'α', text)  # alpha
    text = re.sub(r'\\\\\\beta', 'β', text)  # beta
    text = re.sub(r'\\\\\\gamma', 'γ', text)  # gamma
    text = re.sub(r'\\\\\\Delta', 'Δ', text)  # Delta
    text = re.sub(r'\\\\\\delta', 'δ', text)  # delta
    text = re.sub(r'\\\\\\pi', 'π', text)  # pi
    text = re.sub(r'\\\\\\in', '∈', text)  # element of
    text = re.sub(r'\\\\\\cup', '∪', text)  # union
    text = re.sub(r'\\\\\\cap', '∩', text)  # intersection
    text = re.sub(r'\\\\\\subset', '⊂', text)  # subset
    text = re.sub(r'\\\\\\subseteq', '⊆', text)  # subset or equal
    text = re.sub(r'\\\\\\emptyset', '∅', text)  # empty set
    text = re.sub(r'\\\\\\rightarrow', '→', text)  # right arrow
    text = re.sub(r'\\\\\\Rightarrow', '⇒', text)  # right arrow (Rightarrow)
    text = re.sub(r'\\\\\\leftrightarrow', '↔', text)  # left-right arrow
    text = re.sub(r'\\\\\\Leftrightarrow', '⇔', text)  # left-right arrow (Leftrightarrow)
    text = re.sub(r'\\\\\\degree', '°', text)  # degree
    text = re.sub(r'\\\\\\overline\\{(.*?)\\}', r'\1', text)  # overline
    text = re.sub(r'\\\\\\underbrace\\{(.*?)\\}', r'\1', text)  # underbrace
    
    # Handle superscripts and subscripts
    text = re.sub(r'\\\\\\^{(.*?)}', r'^(\1)', text)  # superscripts in braces
    text = re.sub(r'\\\\\\^([a-zA-Z0-9])', r'^(\1)', text)  # superscripts single char
    text = re.sub(r'_{(.*?)}', r'_(\1)', text)  # subscripts in braces
    text = re.sub(r'_([a-zA-Z0-9])', r'_(\1)', text)  # subscripts single char
    
    # Clean up multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text

def process_questions_file(input_file, output_file):
    """Process the questions file to remove MathJax"""
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
            question['explanation'] = remove_mathjax_inline(question['explanation'])
    
    # Write the processed data back to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_questions_file('/workspace/mathematics_questions_fixed.json', '/workspace/mathematics_questions_final.json')
    print("Processing complete. Output saved to mathematics_questions_final.json")