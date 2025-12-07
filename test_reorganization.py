#!/usr/bin/env python3
import json

def reorganize_english_questions(subject_data):
    reorganized_questions = []
    current_id = 1

    # Process questions in the order they appear in the original questions array
    # For each question, check if it belongs to a passage or instruction and handle accordingly
    if subject_data.get('questions'):
        # Create maps of passage and instruction questions to process them in the intended order
        passage_question_map = {}
        instruction_question_map = {}
        standalone_questions = []

        # Group questions by their associated passage or instruction
        for question in subject_data['questions']:
            if question.get('passageId'):
                if question['passageId'] not in passage_question_map:
                    passage_question_map[question['passageId']] = []
                passage_question_map[question['passageId']].append(question)
            elif question.get('instructionId'):
                if question['instructionId'] not in instruction_question_map:
                    instruction_question_map[question['instructionId']] = []
                instruction_question_map[question['instructionId']].append(question)
            else:
                standalone_questions.append(question)

        # Process passages in order (I, II, III, IV, etc.)
        if subject_data.get('passages') and len(subject_data['passages']) > 0:
            # Sort passages to ensure correct order
            def roman_to_num(roman_id):
                roman_map = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10}
                return roman_map.get(roman_id.replace('Passage ', ''), 0)
            
            sorted_passages = sorted(subject_data['passages'], key=lambda x: roman_to_num(x['id']))

            for passage in sorted_passages:
                if passage['id'] in passage_question_map and len(passage_question_map[passage['id']]) > 0:
                    # Add the passage as a content page
                    passage_content = {
                        'id': current_id,
                        'type': 'passage',
                        'title': passage['id'],
                        'text': passage['text'],
                        'question': f'<div class="english-passage"><h4>{passage["id"]}</h4><div class="passage-content">{passage["text"]}</div><div class="passage-note">Please read the above passage carefully before answering the questions that follow.</div></div>',
                        'options': [{'id': "CONTINUE", 'text': "Continue to questions"}],
                        'correctAnswer': "CONTINUE",
                        'explanation': "This is a passage. Please read carefully before answering the questions that follow."
                    }
                    reorganized_questions.append(passage_content)
                    current_id += 1

                    # Add questions related to this passage
                    for question in passage_question_map[passage['id']]:
                        # Update the question ID to the sequential ID
                        modified_question = {
                            **question,
                            'id': current_id
                        }
                        reorganized_questions.append(modified_question)
                        current_id += 1

        # Process instructions in order (1, 2, 3, etc.)
        if subject_data.get('instructions') and len(subject_data['instructions']) > 0:
            # Sort instructions to ensure correct order
            def instruction_to_num(instruction_id):
                return int(instruction_id.replace('Instruction ', ''))
            
            sorted_instructions = sorted(subject_data['instructions'], key=lambda x: instruction_to_num(x['id']))

            for instruction in sorted_instructions:
                if instruction['id'] in instruction_question_map and len(instruction_question_map[instruction['id']]) > 0:
                    # Add the instruction as a content page
                    instruction_content = {
                        'id': current_id,
                        'type': 'instruction',
                        'title': instruction['id'],
                        'text': instruction['text'],
                        'question': f'<div class="english-instruction"><h4>{instruction["id"]}</h4><p>{instruction["text"]}</p></div>',
                        'options': [{'id': "CONTINUE", 'text': "Continue to questions"}],
                        'correctAnswer': "CONTINUE",
                        'explanation': "Please read the instructions carefully before attempting the questions that follow."
                    }
                    reorganized_questions.append(instruction_content)
                    current_id += 1
                    
                    # Add questions related to this instruction
                    for question in instruction_question_map[instruction['id']]:
                        # Update the question ID to the sequential ID and preserve passageId if it exists
                        modified_question = {
                            **question,
                            'id': current_id
                        }
                        reorganized_questions.append(modified_question)
                        current_id += 1

        # Add any remaining standalone questions
        for question in standalone_questions:
            modified_question = {
                **question,
                'id': current_id
            }
            reorganized_questions.append(modified_question)
            current_id += 1

    print(f"Reorganized English questions: {len(reorganized_questions)} total items")
    print(f"Original question count: {len(subject_data['questions']) if subject_data.get('questions') else 0}")
    print(f"Passages count: {len(subject_data['passages']) if subject_data.get('passages') else 0}")
    print(f"Instructions count: {len(subject_data['instructions']) if subject_data.get('instructions') else 0}")
    return reorganized_questions

# Load the English questions file
with open('/workspace/src/data/subjects/english_questions_jamb_2010.json', 'r') as f:
    subject_data = json.load(f)

result = reorganize_english_questions(subject_data)
print('First 10 items in the reorganized list:')
for i, item in enumerate(result[:10]):
    item_type = item.get('type', 'question')
    print(f"{i + 1}. Type: {item_type}, ID: {item['id']}")

print(f"\nTotal items in reorganized list: {len(result)}")
print("Expected: 4 passages + 25 passage questions + 9 instructions + 75 instruction questions = 113 pages")