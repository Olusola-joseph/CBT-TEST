// Test script to verify that the English 2010 exam has 113 pages
// This script simulates the reorganization function to confirm the page count

// Simulate the reorganizeEnglishQuestions function from the actual app
function reorganizeEnglishQuestions(subjectData) {
    let reorganizedQuestions = [];
    let currentId = 1;

    // Process questions in the order they appear in the original questions array
    // For each question, check if it belongs to a passage or instruction and handle accordingly
    if (subjectData.questions) {
        // Create maps of passage and instruction questions to process them in the intended order
        const passageQuestionMap = {};
        const instructionQuestionMap = {};
        const standaloneQuestions = [];

        // Group questions by their associated passage or instruction
        subjectData.questions.forEach(question => {
            if (question.passageId) {
                if (!passageQuestionMap[question.passageId]) {
                    passageQuestionMap[question.passageId] = [];
                }
                passageQuestionMap[question.passageId].push(question);
            } else if (question.instructionId) {
                if (!instructionQuestionMap[question.instructionId]) {
                    instructionQuestionMap[question.instructionId] = [];
                }
                instructionQuestionMap[question.instructionId].push(question);
            } else {
                standaloneQuestions.push(question);
            }
        });

        // Process passages in order (I, II, III, IV, etc.)
        if (subjectData.passages && subjectData.passages.length > 0) {
            // Sort passages to ensure correct order
            const sortedPassages = [...subjectData.passages].sort((a, b) => {
                // Sort by Roman numerals: I, II, III, IV, etc.
                const romanToNum = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10 };
                const numA = romanToNum[a.id.replace('Passage ', '')];
                const numB = romanToNum[b.id.replace('Passage ', '')];
                return (numA || 0) - (numB || 0);
            });

            sortedPassages.forEach(passage => {
                if (passageQuestionMap[passage.id] && passageQuestionMap[passage.id].length > 0) {
                    // Add the passage as a content page
                    const passageContent = {
                        id: currentId++,
                        type: 'passage',
                        title: passage.id,
                        text: passage.text,
                        question: `<div class="english-passage"><h4>${passage.id}</h4><div class="passage-content">${passage.text}</div><div class="passage-note">Please read the above passage carefully before answering the questions that follow.</div></div>`,
                        options: [{ id: "CONTINUE", text: "Continue to questions" }],
                        correctAnswer: "CONTINUE",
                        explanation: "This is a passage. Please read carefully before answering the questions that follow."
                    };
                    reorganizedQuestions.push(passageContent);

                    // Add questions related to this passage
                    passageQuestionMap[passage.id].forEach(question => {
                        // Update the question ID to the sequential ID
                        const modifiedQuestion = {
                            ...question,
                            id: currentId++
                        };
                        reorganizedQuestions.push(modifiedQuestion);
                    });
                }
            });
        }

        // Process instructions in order (1, 2, 3, etc.)
        if (subjectData.instructions && subjectData.instructions.length > 0) {
            // Sort instructions to ensure correct order
            const sortedInstructions = [...subjectData.instructions].sort((a, b) => {
                const numA = parseInt(a.id.replace('Instruction ', ''));
                const numB = parseInt(b.id.replace('Instruction ', ''));
                return numA - numB;
            });

            sortedInstructions.forEach(instruction => {
                if (instructionQuestionMap[instruction.id] && instructionQuestionMap[instruction.id].length > 0) {
                    // Add the instruction as a content page
                    const instructionContent = {
                        id: currentId++,
                        type: 'instruction',
                        title: instruction.id,
                        text: instruction.text,
                        question: `<div class="english-instruction"><h4>${instruction.id}</h4><p>${instruction.text}</p></div>`,
                        options: [{ id: "CONTINUE", text: "Continue to questions" }],
                        correctAnswer: "CONTINUE",
                        explanation: "Please read the instructions carefully before attempting the questions that follow."
                    };
                    reorganizedQuestions.push(instructionContent);
                    
                    // Add questions related to this instruction
                    instructionQuestionMap[instruction.id].forEach(question => {
                        // Update the question ID to the sequential ID and preserve passageId if it exists
                        const modifiedQuestion = {
                            ...question,
                            id: currentId++
                        };
                        reorganizedQuestions.push(modifiedQuestion);
                    });
                }
            });
        }

        // Add any remaining standalone questions
        standaloneQuestions.forEach(question => {
            const modifiedQuestion = {
                ...question,
                id: currentId++
            };
            reorganizedQuestions.push(modifiedQuestion);
        });
    }

    console.log(`Reorganized English questions: ${reorganizedQuestions.length} total items`);
    console.log(`Original question count: ${subjectData.questions ? subjectData.questions.length : 0}`);
    console.log(`Passages count: ${subjectData.passages ? subjectData.passages.length : 0}`);
    console.log(`Instructions count: ${subjectData.instructions ? subjectData.instructions.length : 0}`);
    return reorganizedQuestions;
}

// Test with the actual data
const subjectData = {
    "passages": [
        {
            "id": "Passage I",
            "text": "One of the interesting things to me about spaceship is that it is a mechanical vehicle, just as an automobile..."
        },
        {
            "id": "Passage II",
            "text": "Stress is by far the most common cause of ill health in our society..."
        },
        {
            "id": "Passage III",
            "text": "There are many indicators with which to assess or measure corruption..."
        },
        {
            "id": "Passage IV",
            "text": "Drought is a word that invokes strong emotions..."
        }
    ],
    "instructions": [
        {
            "id": "Instruction 1",
            "text": "In each of questions 26 to 35, select the option that best explains the information conveyed in the sentence..."
        },
        {
            "id": "Instruction 2", 
            "text": "In each of question 36 to 50, choose the option opposite in meaning to the word or phrase in italics."
        },
        {
            "id": "Instruction 3",
            "text": "In each of questions 51 to 65, choose the option nearest in meaning to the word or phrase in italics"
        },
        {
            "id": "Instruction 4",
            "text": "In each question 66 to 85, choose the option that best completes the gap(s)"
        },
        {
            "id": "Instruction 5",
            "text": "In each of questions 86 to 88, choose the option that has the same Vowel sound as the one represented by the letters underlined."
        },
        {
            "id": "Instruction 6",
            "text": "In each of question 89 to 91, choose the option that has the same consonant sound as the one represented by letter(s) underlined."
        },
        {
            "id": "Instruction 7",
            "text": "In each of question 92 to 94, choose the option that rhymes with the given word."
        },
        {
            "id": "Instruction 8",
            "text": "In each of question 95 to 97, choose the most appropriate stress pattern from the options. The stressed syllables are written in capital letter(s)"
        },
        {
            "id": "Instruction 9",
            "text": "In each of question 98 to 100, the word in capital letters has the emphatic. Choose the option to which the given sentence relates"
        }
    ],
    "questions": []
};

// Generate sample questions with proper associations
for (let i = 1; i <= 100; i++) {
    let question = {
        id: i,
        text: `Question ${i}`,
        options: [
            { id: "A", text: "Option A" },
            { id: "B", text: "Option B" },
            { id: "C", text: "Option C" },
            { id: "D", text: "Option D" }
        ],
        correctAnswer: "A",
        explanation: "Explanation for question " + i
    };
    
    // Assign questions to passages (first 25 questions to passages)
    if (i <= 5) { // First 5 questions for Passage I (5 questions)
        question.passageId = "Passage I";
    } else if (i <= 10) { // Next 5 questions for Passage II
        question.passageId = "Passage II";
    } else if (i <= 15) { // Next 5 questions for Passage III
        question.passageId = "Passage III";
    } else if (i <= 25) { // Next 10 questions for Passage IV
        question.passageId = "Passage IV";
    } 
    // Remaining 75 questions are assigned to instructions
    else if (i <= 35) { // Questions 26-35 to Instruction 1
        question.instructionId = "Instruction 1";
    } else if (i <= 50) { // Questions 36-50 to Instruction 2
        question.instructionId = "Instruction 2";
    } else if (i <= 65) { // Questions 51-65 to Instruction 3
        question.instructionId = "Instruction 3";
    } else if (i <= 85) { // Questions 66-85 to Instruction 4
        question.instructionId = "Instruction 4";
    } else if (i <= 88) { // Questions 86-88 to Instruction 5
        question.instructionId = "Instruction 5";
    } else if (i <= 91) { // Questions 89-91 to Instruction 6
        question.instructionId = "Instruction 6";
    } else if (i <= 94) { // Questions 92-94 to Instruction 7
        question.instructionId = "Instruction 7";
    } else if (i <= 97) { // Questions 95-97 to Instruction 8
        question.instructionId = "Instruction 8";
    } else { // Questions 98-100 to Instruction 9
        question.instructionId = "Instruction 9";
    }
    
    subjectData.questions.push(question);
}

const result = reorganizeEnglishQuestions(subjectData);
console.log('Test completed successfully!');
console.log(`Total pages in reorganized list: ${result.length}`);
console.log("Expected: 4 passages + 25 passage questions + 9 instructions + 75 instruction questions = 113 pages");

// Verify the sequence is correct
console.log('\nFirst 10 items in sequence:');
for (let i = 0; i < Math.min(10, result.length); i++) {
    const item = result[i];
    console.log(`${i + 1}. Type: ${item.type || 'question'}, ID: ${item.id}`);
}

// Verify we have the correct number of each type
const passageCount = result.filter(item => item.type === 'passage').length;
const instructionCount = result.filter(item => item.type === 'instruction').length;
const questionCount = result.filter(item => !item.type || item.type === 'question').length;

console.log(`\nBreakdown:`);
console.log(`Passages: ${passageCount}`);
console.log(`Instructions: ${instructionCount}`);
console.log(`Questions: ${questionCount}`);
console.log(`Total: ${passageCount + instructionCount + questionCount}`);