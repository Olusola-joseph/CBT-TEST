// Script to retrieve and display information from English questions 2010
// This script will load the English questions from 2010 and display them with their answers and explanations

const fs = require('fs');
const path = require('path');

// Function to load English questions from 2010
function loadEnglishQuestions2010() {
    const filePath = path.join(__dirname, 'src/data/subjects/english_questions_jamb_2010.json');
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`Loaded ${data.questions.length} English questions from 2010`);
        console.log(`Found ${data.passages.length} passages`);
        console.log(`Found ${data.instructions.length} instructions`);
        
        return data;
    } catch (error) {
        console.error('Error loading English questions from 2010:', error);
        return null;
    }
}

// Function to display all questions with their answers and explanations
function displayQuestions(data) {
    if (!data || !data.questions) {
        console.log('No questions data available');
        return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('ENGLISH QUESTIONS FROM JAMB 2010');
    console.log('=' .repeat(80));

    // Display passages
    console.log('\nPASSAGES:');
    console.log('-'.repeat(40));
    data.passages.forEach((passage, index) => {
        console.log(`\nPassage ${index + 1} (${passage.id}):`);
        console.log(passage.text.substring(0, 200) + '...'); // Show first 200 chars
    });

    // Display instructions
    console.log('\n\nINSTRUCTIONS:');
    console.log('-'.repeat(40));
    data.instructions.forEach((instruction, index) => {
        console.log(`\nInstruction ${index + 1} (${instruction.id}):`);
        console.log(instruction.text);
    });

    // Display questions with answers and explanations
    console.log('\n\nQUESTIONS, ANSWERS, AND EXPLANATIONS:');
    console.log('-'.repeat(60));
    
    data.questions.forEach((question, index) => {
        console.log(`\nQuestion ${index + 1} (ID: ${question.id})`);
        
        if (question.passageId) {
            console.log(`Passage: ${question.passageId}`);
        }
        
        console.log(`Question: ${question.question}`);
        
        console.log('Options:');
        question.options.forEach(option => {
            console.log(`  ${option.id}. ${option.text}`);
        });
        
        console.log(`Correct Answer: ${question.correctAnswer}`);
        console.log(`Explanation: ${question.explanation}`);
        
        console.log('-'.repeat(40));
    });
}

// Function to display questions by category (based on instructions)
function displayQuestionsByCategory(data) {
    if (!data || !data.questions) {
        console.log('No questions data available');
        return;
    }

    console.log('\n\nQUESTIONS BY CATEGORY:');
    console.log('-'.repeat(40));
    
    // Group questions by the likely instruction type based on question patterns
    const categories = {
        'Comprehension': [],
        'Lexis and Structure': [],
        'Vocabulary': [],
        'Phonetics': [],
        'Stress': [],
        'Emphatic Stress': [],
        'Other': []
    };
    
    data.questions.forEach(question => {
        const questionText = question.question.toLowerCase();
        
        if (question.passageId) {
            categories['Comprehension'].push(question);
        } else if (questionText.includes('opposite') || questionText.includes('nearest') || questionText.includes('meaning')) {
            categories['Vocabulary'].push(question);
        } else if (questionText.includes('gap') || questionText.includes('fill')) {
            categories['Lexis and Structure'].push(question);
        } else if (questionText.includes('vowel') || questionText.includes('sound')) {
            categories['Phonetics'].push(question);
        } else if (questionText.includes('stress')) {
            categories['Stress'].push(question);
        } else if (questionText.includes('emphatic')) {
            categories['Emphatic Stress'].push(question);
        } else {
            categories['Other'].push(question);
        }
    });
    
    // Display questions by category
    Object.keys(categories).forEach(category => {
        if (categories[category].length > 0) {
            console.log(`\n${category.toUpperCase()} (${categories[category].length} questions):`);
            console.log('~'.repeat(30));
            
            categories[category].forEach((question, index) => {
                console.log(`  ${index + 1}. ${question.question.substring(0, 60)}...`);
                console.log(`     Answer: ${question.correctAnswer}`);
            });
        }
    });
}

// Function to get a specific question by ID
function getQuestionById(data, questionId) {
    if (!data || !data.questions) {
        console.log('No questions data available');
        return null;
    }
    
    const question = data.questions.find(q => q.id === questionId);
    
    if (question) {
        console.log(`\nQUESTION ${question.id}:`);
        console.log(`Question: ${question.question}`);
        
        console.log('Options:');
        question.options.forEach(option => {
            console.log(`  ${option.id}. ${option.text}`);
        });
        
        console.log(`Correct Answer: ${question.correctAnswer}`);
        console.log(`Explanation: ${question.explanation}`);
        
        return question;
    } else {
        console.log(`Question with ID ${questionId} not found`);
        return null;
    }
}

// Main function to run the retrieval
function main() {
    console.log('Retrieving English questions from JAMB 2010...');
    
    const englishData = loadEnglishQuestions2010();
    
    if (englishData) {
        // Display all questions
        displayQuestions(englishData);
        
        // Display questions by category
        displayQuestionsByCategory(englishData);
        
        // Example: Get a specific question
        console.log('\n\nSPECIFIC QUESTION EXAMPLE:');
        console.log('-'.repeat(40));
        getQuestionById(englishData, 2); // Get question 2 as example
    }
}

// Run the main function if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    loadEnglishQuestions2010,
    displayQuestions,
    displayQuestionsByCategory,
    getQuestionById
};