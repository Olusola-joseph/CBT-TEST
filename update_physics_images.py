import json
import os
import re

def update_json_with_correct_images(json_file_path, images_dir):
    """Update the JSON file to reference correct image files based on question IDs."""
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    year = data.get('year', 2010)
    figures = data.get('figures', [])
    questions = data.get('questions', [])
    
    # Create a mapping of figure IDs to correct image filenames
    updated_figures = []
    for figure in figures:
        figure_id = figure.get('id', '')
        
        # Extract question number from figure ID (e.g., "Phy2010_Q3_VelocityTimeGraph" -> "3")
        match = re.search(r'Phy(\d{4})_Q(\d+)', figure_id)
        if match:
            extracted_year = match.group(1)
            question_num = match.group(2)
            
            # Construct the expected image filename
            expected_image = f"{extracted_year}_Q{question_num}.png"
            image_path = os.path.join(images_dir, expected_image)
            
            # Check if the image exists
            if os.path.exists(image_path):
                # Update the figure's file reference
                figure['file'] = expected_image
                print(f"Updated figure {figure_id} to use image: {expected_image}")
            else:
                print(f"Warning: Image not found for {figure_id}: {image_path}")
        
        updated_figures.append(figure)
    
    # Update the data
    data['figures'] = updated_figures
    
    # Also update questions that reference figures to ensure correct image paths
    for question in questions:
        if 'figureId' in question:
            figure_id = question['figureId']
            
            # Extract question number from figure ID
            match = re.search(r'Phy(\d{4})_Q(\d+)', figure_id)
            if match:
                extracted_year = match.group(1)
                question_num = match.group(2)
                
                # Construct the expected image filename
                expected_image = f"{extracted_year}_Q{question_num}.png"
                image_path = os.path.join(images_dir, expected_image)
                
                # Check if the image exists
                if os.path.exists(image_path):
                    # Add the image path to the question for direct reference
                    question['imagePath'] = f"src/data/subjects/images/physics_images/{expected_image}"
                    print(f"Added imagePath to question with figureId {figure_id}: {expected_image}")
                else:
                    print(f"Warning: Image not found for question with figureId {figure_id}: {image_path}")
    
    # Write the updated JSON back to file
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Updated {json_file_path}")

def main():
    # Define the directory containing physics JSON files and images
    json_dir = "/workspace/src/data/subjects"
    images_dir = "/workspace/src/data/subjects/images/physics_images"
    
    # Get all physics JSON files
    json_files = []
    for file in os.listdir(json_dir):
        if file.startswith("physics_questions_jamb_") and file.endswith(".json"):
            json_files.append(os.path.join(json_dir, file))
    
    # Update each JSON file
    for json_file in json_files:
        print(f"Processing {json_file}...")
        update_json_with_correct_images(json_file, images_dir)
        print()
    
    print("All physics JSON files have been updated with correct image references.")

if __name__ == "__main__":
    main()