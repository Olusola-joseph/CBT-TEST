import json

# Load the English questions JSON
with open('/workspace/src/data/subjects/english_questions_jamb_2010.json', 'r') as file:
    subject_data = json.load(file)

# Reorganize English questions to follow the sequence: passage -> questions, instruction -> questions
reorganized_questions = []
current_id = 1

# Process questions in the order they appear in the original questions array
# For each question, check if it belongs to a passage or instruction and handle accordingly
if subject_data['questions']:
    # Create maps of passage and instruction questions to process them in the intended order
    passage_question_map = {}
    instruction_question_map = {}
    standalone_questions = []

    # Group questions by their associated passage or instruction
    for question in subject_data['questions']:
        if 'passageId' in question:
            if question['passageId'] not in passage_question_map:
                passage_question_map[question['passageId']] = []
            passage_question_map[question['passageId']].append(question)
        elif 'instructionId' in question:
            if question['instructionId'] not in instruction_question_map:
                instruction_question_map[question['instructionId']] = []
            instruction_question_map[question['instructionId']].append(question)
        else:
            standalone_questions.append(question)

    # Process passages in order (I, II, III, IV, etc.)
    if subject_data['passages'] and len(subject_data['passages']) > 0:
        # Sort passages to ensure correct order
        def roman_to_num(roman):
            roman_map = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10}
            return roman_map.get(roman.replace('Passage ', ''), 0)
        
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
                current_id += 1
                reorganized_questions.append(passage_content)

                # Add questions related to this passage
                for question in passage_question_map[passage['id']]:
                    # Update the question ID to the sequential ID
                    modified_question = {
                        **question,
                        'id': current_id
                    }
                    current_id += 1
                    reorganized_questions.append(modified_question)

    # Process instructions in order (1, 2, 3, etc.)
    if subject_data['instructions'] and len(subject_data['instructions']) > 0:
        # Sort instructions to ensure correct order
        sorted_instructions = sorted(subject_data['instructions'], key=lambda x: int(x['id'].replace('Instruction ', '')))

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
                current_id += 1
                reorganized_questions.append(instruction_content)
                
                # Add questions related to this instruction
                for question in instruction_question_map[instruction['id']]:
                    # Update the question ID to the sequential ID and preserve passageId if it exists
                    modified_question = {
                        **question,
                        'id': current_id
                    }
                    current_id += 1
                    reorganized_questions.append(modified_question)

    # Add any remaining standalone questions
    for question in standalone_questions:
        modified_question = {
            **question,
            'id': current_id
        }
        current_id += 1
        reorganized_questions.append(modified_question)

print(f"Reorganized English questions: {len(reorganized_questions)} total items")
print(f"Original question count: {len(subject_data['questions']) if 'questions' in subject_data else 0}")
print(f"Passages count: {len(subject_data['passages']) if 'passages' in subject_data else 0}")
print(f"Instructions count: {len(subject_data['instructions']) if 'instructions' in subject_data else 0}")
print(f"Expected total: 4 passages + 9 instructions + 100 questions = 113")

# Count how many of each type we have in the final result
passage_count = sum(1 for q in reorganized_questions if q.get('type') == 'passage')
instruction_count = sum(1 for q in reorganized_questions if q.get('type') == 'instruction')
question_count = sum(1 for q in reorganized_questions if q.get('type') is None or q.get('type') not in ['passage', 'instruction'])

print(f"Final breakdown - Passages: {passage_count}, Instructions: {instruction_count}, Questions: {question_count}")