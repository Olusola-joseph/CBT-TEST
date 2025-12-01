#!/usr/bin/env python3
import json
import re

def clean_json_file(input_path, output_path):
    """
    Clean a JSON file by removing problematic control characters
    while preserving the structure.
    """
    with open(input_path, 'rb') as f:
        raw_bytes = f.read()
    
    # Decode as UTF-8, replacing problematic characters
    text_content = raw_bytes.decode('utf-8', errors='replace')
    
    # Fix common JSON issues by carefully handling control characters
    # Replace control characters (except tab, newline, carriage return) with spaces
    cleaned_content = ""
    i = 0
    while i < len(text_content):
        char = text_content[i]
        ord_char = ord(char) if len(char) > 0 and ord(char) < 128 else -1
        
        # Check if this is a control character
        if 0 <= ord_char < 32 and ord_char not in [9, 10, 13]:  # Control chars except tab, LF, CR
            # Replace with escaped Unicode
            cleaned_content += f'\\u{ord_char:04x}'
        else:
            cleaned_content += char
        i += 1
    
    # Write the cleaned content
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)

def merge_unique_questions(file1_path, file2_path, output_path):
    """
    Merge questions from two files, keeping unique questions only.
    """
    # Clean both files first
    clean_json_file(file1_path, '/tmp/clean_file1.json')
    clean_json_file(file2_path, '/tmp/clean_file2.json')
    
    # Load the cleaned files
    with open('/tmp/clean_file1.json', 'r', encoding='utf-8') as f:
        try:
            data1 = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error loading {file1_path}: {e}")
            data1 = {"questions": []}
    
    with open('/tmp/clean_file2.json', 'r', encoding='utf-8') as f:
        try:
            data2 = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error loading {file2_path}: {e}")
            data2 = {"questions": []}
    
    # Create a set of question texts to identify duplicates
    seen_questions = set()
    unique_questions = []
    
    # Add questions from file2 first (new file)
    for question in data2.get("questions", []):
        question_text = question.get("question", "")
        if question_text not in seen_questions:
            unique_questions.append(question)
            seen_questions.add(question_text)
    
    # Add questions from file1 (old file) that aren't already in the list
    for question in data1.get("questions", []):
        question_text = question.get("question", "")
        if question_text not in seen_questions:
            unique_questions.append(question)
            seen_questions.add(question_text)
    
    # Renumber IDs to be sequential
    for i, question in enumerate(unique_questions, 1):
        question["id"] = i
    
    # Write the merged file
    merged_data = {"questions": unique_questions}
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    # Merge the mathematics question files
    merge_unique_questions(
        '/workspace/mathematics_questions.json',
        '/workspace/mathematics_questions_new.json', 
        '/workspace/mathematics_questions_final.json'
    )
    print("Merged mathematics questions into mathematics_questions_final.json")