#!/usr/bin/env python3
"""
Script to specifically fix missing images in physics questions that were mentioned in the issue.
Handles cases where images are shared between different years.
"""

import json
import os
from pathlib import Path

def get_image_mapping():
    """Create a mapping of question-year combinations to image files."""
    image_map = {}
    
    # Get all physics images
    image_dir = Path("/workspace/src/data/subjects/images/physics_images/")
    
    for img_file in image_dir.glob("*.png"):
        filename = img_file.name
        # Parse filenames like: 2010_Q40&2018_Q36.png
        base_name = filename.replace('.png', '')
        
        # Handle shared images (with &)
        if '&' in base_name:
            parts = base_name.split('&')
            for part in parts:
                if '_Q' in part:
                    year_q = part.split('_Q')
                    if len(year_q) == 2:
                        year = int(year_q[0])
                        q_num = int(year_q[1])
                        image_map[(year, q_num)] = str(img_file.relative_to(Path("/workspace")))
        else:
            # Handle single images like: 2010_Q3.png
            if '_Q' in base_name:
                year_q = base_name.split('_Q')
                if len(year_q) == 2:
                    year = int(year_q[0])
                    q_num = int(year_q[1])
                    image_map[(year, q_num)] = str(img_file.relative_to(Path("/workspace")))
    
    return image_map

def update_json_file_with_specific_fixes(file_path, image_map):
    """Update a specific JSON file with missing image paths."""
    print(f"Processing {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    year = data.get('year', 0)
    
    # Check if figures section exists
    if 'figures' not in data:
        data['figures'] = []
    
    # Create a mapping of existing figure IDs to avoid duplicates
    existing_figure_ids = {fig['id']: fig for fig in data['figures']}
    
    # Process each question
    for question in data['questions']:
        q_id = question.get('id', 0)
        
        # Check if this year-question combination has an image
        key = (year, q_id)
        if key in image_map:
            image_path = image_map[key]
            full_image_path = Path("/workspace") / image_path
            
            if full_image_path.exists() and not question.get('imagePath'):
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
                            "file": image_path.split('/')[-1],
                            "description": f"Image for question {q_id} in {year} physics exam"
                        }
                        data['figures'].append(figure_entry)
                        existing_figure_ids[figure_id] = figure_entry
        else:
            # Check if any other year-question combination maps to this same image
            # This handles cases where an image from another year should be used
            for (map_year, map_q), image_path in image_map.items():
                if map_year != year and map_q == q_id:
                    # For example, if 2017_Q16 uses 2012_Q12's image
                    # We need to be careful here - only add if there's a specific known mapping
                    pass
    
    # Special handling for specific cases mentioned in the issue
    # Some images are shared between years (e.g., 2012_Q12&2017_Q16 means both questions use the same image)
    for question in data['questions']:
        q_id = question.get('id', 0)
        key = (year, q_id)
        
        # Specific check for shared images
        for (map_year, map_q), image_path in image_map.items():
            if map_year == year and map_q == q_id and not question.get('imagePath'):
                full_image_path = Path("/workspace") / image_path
                if full_image_path.exists():
                    print(f"  Adding imagePath to question {q_id} in {year}: {image_path}")
                    question['imagePath'] = image_path
                    
                    if not question.get('figureId'):
                        figure_id = f"Phy{year}_Q{q_id}_Figure"
                        question['figureId'] = figure_id
                        
                        if figure_id not in existing_figure_ids:
                            figure_entry = {
                                "id": figure_id,
                                "file": image_path.split('/')[-1],
                                "description": f"Image for question {q_id} in {year} physics exam"
                            }
                            data['figures'].append(figure_entry)
                            existing_figure_ids[figure_id] = figure_entry
                            
                    break
    
    # Save the updated JSON file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {file_path}")

def update_all_physics_files():
    """Process all physics JSON files with specific fixes."""
    image_map = get_image_mapping()
    print("Image mapping:", image_map)
    
    physics_dir = Path("/workspace/src/data/subjects/")
    
    for json_file in physics_dir.glob("physics_questions_*.json"):
        update_json_file_with_specific_fixes(json_file, image_map)
    
    print("All physics JSON files have been processed.")

if __name__ == "__main__":
    update_all_physics_files()
    
    # Also handle special case where images are shared between years
    # For example, if 2012_Q12 and 2017_Q16 use the same image, we need to ensure both have the image
    print("\nChecking for shared image scenarios...")
    
    # Load the specific files that need cross-year image sharing
    files_to_check = [
        "/workspace/src/data/subjects/physics_questions_jamb_2012.json",
        "/workspace/src/data/subjects/physics_questions_jamb_2017.json",
        "/workspace/src/data/subjects/physics_questions_jamb_2014.json",
        "/workspace/src/data/subjects/physics_questions_jamb_2015.json",
        "/workspace/src/data/subjects/physics_questions_jamb_2010.json",
        "/workspace/src/data/subjects/physics_questions_jamb_2018.json"
    ]
    
    for file_path in files_to_check:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            year = data.get('year', 0)
            updated = False
            
            for question in data['questions']:
                q_id = question.get('id', 0)
                
                # Special mappings based on the file names that indicate shared images
                if year == 2012 and q_id == 12:
                    # Check if 2017_Q16 should also have this image
                    img_path = "src/data/subjects/images/physics_images/2012_Q12.png"
                    if os.path.exists("/workspace/" + img_path):
                        if not question.get('imagePath'):
                            print(f"Adding image for 2012_Q12: {img_path}")
                            question['imagePath'] = img_path
                            if not question.get('figureId'):
                                question['figureId'] = f"Phy{year}_Q{q_id}_Figure"
                            updated = True
                elif year == 2017 and q_id == 16:
                    # 2017_Q16 should use the same image as 2012_Q12 according to file naming
                    img_path = "src/data/subjects/images/physics_images/2017_Q16.png"
                    if os.path.exists("/workspace/" + img_path):
                        if not question.get('imagePath'):
                            print(f"Adding image for 2017_Q16: {img_path}")
                            question['imagePath'] = img_path
                            if not question.get('figureId'):
                                question['figureId'] = f"Phy{year}_Q{q_id}_Figure"
                            updated = True
                elif year == 2015 and q_id == 36:
                    # According to 2012_Q39&2015_Q36.png, both should have images
                    img_path = "src/data/subjects/images/physics_images/2012_Q39&2015_Q36.png"
                    if os.path.exists("/workspace/" + img_path):
                        if not question.get('imagePath'):
                            print(f"Adding image for 2015_Q36: {img_path}")
                            question['imagePath'] = img_path
                            if not question.get('figureId'):
                                question['figureId'] = f"Phy{year}_Q{q_id}_Figure"
                            updated = True
                elif year == 2014 and q_id in [35, 42, 43]:
                    if q_id == 35:
                        img_path = "src/data/subjects/images/physics_images/2014_Q35&2018_Q40.png"
                    elif q_id == 42:
                        img_path = "src/data/subjects/images/physics_images/2014_Q42&Q43&2016_Q2.png"
                    elif q_id == 43:
                        img_path = "src/data/subjects/images/physics_images/2014_Q42&Q43&2016_Q2.png"
                    
                    if os.path.exists("/workspace/" + img_path):
                        if not question.get('imagePath'):
                            print(f"Adding image for 2014_Q{q_id}: {img_path}")
                            question['imagePath'] = img_path
                            if not question.get('figureId'):
                                question['figureId'] = f"Phy{year}_Q{q_id}_Figure"
                            updated = True
                elif year == 2010 and q_id in [40, 49]:
                    if q_id == 40:
                        img_path = "src/data/subjects/images/physics_images/2010_Q40&2018_Q36.png"
                    elif q_id == 49:
                        img_path = "src/data/subjects/images/physics_images/2010_Q49&2017_Q6.png"
                    
                    if os.path.exists("/workspace/" + img_path):
                        if not question.get('imagePath'):
                            print(f"Adding image for 2010_Q{q_id}: {img_path}")
                            question['imagePath'] = img_path
                            if not question.get('figureId'):
                                question['figureId'] = f"Phy{year}_Q{q_id}_Figure"
                            updated = True
            
            if updated:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"Updated {file_path} with special mappings")