#!/usr/bin/env python3
"""
Script to fix missing images in physics questions and implement MathJax for mathematical expressions
"""

import json
import os
from pathlib import Path

def update_json_file(file_path):
    """Update a JSON file to add missing imagePath entries and fix mathematical expressions."""
    print(f"Processing {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Get the year from the filename
    year = data.get('year', 0)
    
    # Check if figures section exists
    if 'figures' not in data:
        data['figures'] = []
    
    # Create a mapping of existing figure IDs to avoid duplicates
    existing_figure_ids = {fig['id']: fig for fig in data['figures']}
    
    # Process each question
    for i, question in enumerate(data['questions']):
        q_id = question.get('id', 0)
        question_text = question.get('question', '')
        
        # Check if the question needs an image based on the question text
        needs_image = False
        image_filename = f"{year}_Q{q_id}.png"
        
        # Look for indicators that an image is needed
        if ("diagram above" in question_text.lower() or 
            "graph" in question_text.lower() or 
            "figure" in question_text.lower() or 
            "the diagram" in question_text.lower()):
            needs_image = True
        elif question.get('instruction') and ("diagram" in question.get('instruction', '').lower() or 
                                             "figure" in question.get('instruction', '').lower()):
            needs_image = True
        
        # Check if image file exists
        image_path = f"src/data/subjects/images/physics_images/{image_filename}"
        full_image_path = Path("/workspace") / image_path
        
        # If question doesn't have imagePath but image file exists, add it
        if not question.get('imagePath') and full_image_path.exists():
            print(f"  Adding imagePath to question {q_id} in {year}: {image_path}")
            question['imagePath'] = image_path
            
            # Create figure ID if not present
            if not question.get('figureId'):
                figure_id = f"Phy{year}_Q{q_id}_Figure"
                question['figureId'] = figure_id
                
                # Add to figures if not already present
                if figure_id not in existing_figure_ids:
                    figure_entry = {
                        "id": figure_id,
                        "file": image_filename,
                        "description": f"Image for question {q_id} in {year} physics exam"
                    }
                    data['figures'].append(figure_entry)
                    existing_figure_ids[figure_id] = figure_entry
    
    # Second pass: Fix any remaining issues where figureId exists but imagePath is missing
    for question in data['questions']:
        q_id = question.get('id', 0)
        if question.get('figureId') and not question.get('imagePath'):
            image_filename = f"{year}_Q{q_id}.png"
            image_path = f"src/data/subjects/images/physics_images/{image_filename}"
            full_image_path = Path("/workspace") / image_path
            
            if full_image_path.exists():
                print(f"  Adding imagePath to question {q_id} with existing figureId: {image_path}")
                question['imagePath'] = image_path
    
    # Save the updated JSON file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {file_path}")

def fix_mathematical_expressions(text):
    """Convert LaTeX-style mathematical expressions to proper format for MathJax."""
    import re
    
    # Convert \( ... \) to \( ... \) (ensure proper MathJax delimiters)
    # The current format appears to be \( ... \) which is already correct for MathJax
    # But let's make sure there are no inconsistencies
    
    # Replace inline math expressions
    text = re.sub(r'\\\\\((.*?)\\\\\)', r'\\(\1\\)', text)
    
    # Replace display math expressions
    text = re.sub(r'\\\\\[(.*?)\\\\\]', r'\\[\1\\]', text)
    
    # Handle common mathematical notations that might need fixing
    # Like exponents, subscripts, etc.
    text = re.sub(r'\^(\{[^}]+\}|\w)', r'^{\1}', text)  # Ensure proper superscript formatting
    text = re.sub(r'_([^\\])', r'_{\1}', text)  # Ensure proper subscript formatting
    
    return text

def update_all_physics_files():
    """Process all physics JSON files."""
    physics_dir = Path("/workspace/src/data/subjects/")
    
    for json_file in physics_dir.glob("physics_questions_*.json"):
        update_json_file(json_file)
    
    print("All physics JSON files have been processed.")

if __name__ == "__main__":
    update_all_physics_files()
    
    # Update HTML files to include MathJax
    html_files = [
        "/workspace/physics.html",
        "/workspace/index.html"
    ]
    
    mathjax_script = """
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
"""
    
    for html_file in html_files:
        if os.path.exists(html_file):
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if MathJax is already included
            if "MathJax" not in content:
                # Insert MathJax script before closing </head> tag
                if '</head>' in content:
                    content = content.replace('</head>', mathjax_script + '\n</head>')
                else:
                    # If no </head>, insert after <head> if present
                    if '<head>' in content:
                        content = content.replace('<head>', '<head>' + mathjax_script)
                    else:
                        # Insert at beginning if no head tag
                        content = mathjax_script + content
                
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"Added MathJax to {html_file}")
            else:
                print(f"MathJax already present in {html_file}")
    
    print("MathJax implementation completed.")