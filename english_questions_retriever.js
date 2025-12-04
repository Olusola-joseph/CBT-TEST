// English Questions Retriever for JAMB 2010
// This script specifically retrieves and organizes English questions from 2010 with their answers and explanations

const fs = require('fs');
const path = require('path');

class EnglishQuestionsRetriever {
    constructor() {
        this.filePath = path.join(__dirname, 'src/data/subjects/english_questions_jamb_2010.json');
        this.data = null;
    }

    // Load the English questions data from 2010
    loadQuestions() {
        try {
            this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            console.log(`✅ Successfully loaded ${this.data.questions.length} English questions from JAMB 2010`);
            console.log(`✅ Found ${this.data.passages.length} passages`);
            console.log(`✅ Found ${this.data.instructions.length} instructions`);
            return true;
        } catch (error) {
            console.error('❌ Error loading English questions from 2010:', error);
            return false;
        }
    }

    // Get all questions
    getAllQuestions() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return null;
        }
        return this.data.questions;
    }

    // Get a specific question by ID
    getQuestionById(questionId) {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return null;
        }
        
        const question = this.data.questions.find(q => q.id === questionId);
        if (question) {
            return question;
        } else {
            console.log(`❌ Question with ID ${questionId} not found`);
            return null;
        }
    }

    // Get all passages
    getPassages() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return null;
        }
        return this.data.passages;
    }

    // Get all instructions
    getInstructions() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return null;
        }
        return this.data.instructions;
    }

    // Display a specific question with its answer and explanation
    displayQuestion(questionId) {
        const question = this.getQuestionById(questionId);
        if (!question) {
            return;
        }

        console.log('\n' + '='.repeat(80));
        console.log(`ENGLISH QUESTION ${question.id}`);
        console.log('=' .repeat(80));
        
        if (question.passageId) {
            console.log(`📖 PASSAGE: ${question.passageId}`);
        }
        
        console.log(`❓ QUESTION: ${question.question}`);
        
        console.log('\n📝 OPTIONS:');
        question.options.forEach(option => {
            console.log(`   ${option.id}. ${option.text}`);
        });
        
        console.log(`\n✅ CORRECT ANSWER: ${question.correctAnswer}`);
        console.log(`💡 EXPLANATION: ${question.explanation}`);
        console.log('-'.repeat(80));
    }

    // Display all questions by category
    displayQuestionsByCategory() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return;
        }

        console.log('\n' + '='.repeat(80));
        console.log('ENGLISH QUESTIONS BY CATEGORY');
        console.log('=' .repeat(80));

        // Group questions by category based on the instruction type
        const categories = {
            'COMPREHENSION': this.data.questions.filter(q => q.passageId !== undefined),
            'LEXIS AND STRUCTURE': this.data.questions.filter(q => 
                !q.passageId && 
                (q.question.toLowerCase().includes('gap') || 
                 q.question.toLowerCase().includes('fill') || 
                 q.question.toLowerCase().includes('complete') ||
                 q.question.toLowerCase().includes('best completes'))
            ),
            'VOCABULARY': this.data.questions.filter(q => 
                !q.passageId && 
                (q.question.toLowerCase().includes('opposite') || 
                 q.question.toLowerCase().includes('nearest') || 
                 q.question.toLowerCase().includes('meaning'))
            ),
            'PHONETICS': this.data.questions.filter(q => 
                !q.passageId && 
                (q.question.toLowerCase().includes('vowel') || 
                 q.question.toLowerCase().includes('sound'))
            ),
            'STRESS': this.data.questions.filter(q => 
                !q.passageId && 
                q.question.toLowerCase().includes('stress')
            ),
            'EMPHATIC STRESS': this.data.questions.filter(q => 
                !q.passageId && 
                q.question.toLowerCase().includes('emphatic')
            ),
            'IDOMS AND EXPRESSIONS': this.data.questions.filter(q => 
                !q.passageId && 
                (q.question.toLowerCase().includes('jaundiced eye') || 
                 q.question.toLowerCase().includes('steer a middle course') || 
                 q.question.toLowerCase().includes('axe to grind') ||
                 q.question.includes('idiom') || q.question.includes('expression'))
            )
        };

        // Display each category
        Object.keys(categories).forEach(category => {
            const categoryQuestions = categories[category];
            if (categoryQuestions.length > 0) {
                console.log(`\n📚 ${category.toUpperCase()} (${categoryQuestions.length} questions)`);
                console.log('-'.repeat(60));
                
                categoryQuestions.forEach((question, index) => {
                    console.log(`${index + 1}. Q${question.id}: ${question.question.substring(0, 50)}...`);
                    console.log(`   Ans: ${question.correctAnswer}`);
                });
            }
        });
    }

    // Display all passages
    displayPassages() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return;
        }

        console.log('\n' + '='.repeat(80));
        console.log('PASSAGES IN ENGLISH QUESTIONS 2010');
        console.log('=' .repeat(80));

        this.data.passages.forEach((passage, index) => {
            console.log(`\n📖 PASSAGE ${index + 1} (${passage.id}):`);
            console.log('-'.repeat(40));
            console.log(passage.text);
            console.log('-'.repeat(40));
        });
    }

    // Display all instructions
    displayInstructions() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return;
        }

        console.log('\n' + '='.repeat(80));
        console.log('INSTRUCTIONS FOR ENGLISH QUESTIONS 2010');
        console.log('=' .repeat(80));

        this.data.instructions.forEach((instruction, index) => {
            console.log(`\n📋 INSTRUCTION ${index + 1} (${instruction.id}):`);
            console.log('-'.repeat(40));
            console.log(instruction.text);
            console.log('-'.repeat(40));
        });
    }

    // Search questions by keyword
    searchQuestions(keyword) {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return [];
        }

        const keywordLower = keyword.toLowerCase();
        const matchingQuestions = this.data.questions.filter(question => 
            question.question.toLowerCase().includes(keywordLower) ||
            question.explanation.toLowerCase().includes(keywordLower)
        );

        console.log(`\n🔍 SEARCH RESULTS FOR "${keyword}":`);
        console.log('-'.repeat(40));
        
        if (matchingQuestions.length === 0) {
            console.log('No questions found matching your search.');
        } else {
            console.log(`Found ${matchingQuestions.length} question(s) matching "${keyword}":`);
            matchingQuestions.forEach((question, index) => {
                console.log(`${index + 1}. Q${question.id}: ${question.question.substring(0, 60)}...`);
                console.log(`   Ans: ${question.correctAnswer}`);
            });
        }

        return matchingQuestions;
    }

    // Get statistics about the questions
    getStatistics() {
        if (!this.data) {
            console.log('❌ No data loaded. Please call loadQuestions() first.');
            return null;
        }

        const stats = {
            totalQuestions: this.data.questions.length,
            totalPassages: this.data.passages.length,
            totalInstructions: this.data.instructions.length,
            questionsWithPassages: this.data.questions.filter(q => q.passageId !== undefined).length,
            questionsWithoutPassages: this.data.questions.filter(q => q.passageId === undefined).length,
            correctAnswerDistribution: {}
        };

        // Count correct answers
        this.data.questions.forEach(question => {
            if (question.correctAnswer) {
                if (stats.correctAnswerDistribution[question.correctAnswer]) {
                    stats.correctAnswerDistribution[question.correctAnswer]++;
                } else {
                    stats.correctAnswerDistribution[question.correctAnswer] = 1;
                }
            }
        });

        console.log('\n📊 STATISTICS FOR ENGLISH QUESTIONS 2010');
        console.log('-'.repeat(40));
        console.log(`Total Questions: ${stats.totalQuestions}`);
        console.log(`Questions with Passages: ${stats.questionsWithPassages}`);
        console.log(`Questions without Passages: ${stats.questionsWithoutPassages}`);
        console.log(`Total Passages: ${stats.totalPassages}`);
        console.log(`Total Instructions: ${stats.totalInstructions}`);
        console.log('\nCorrect Answer Distribution:');
        Object.entries(stats.correctAnswerDistribution).forEach(([answer, count]) => {
            console.log(`  ${answer}: ${count} questions`);
        });

        return stats;
    }
}

// Example usage
function main() {
    console.log('📖 Retrieving English Questions from JAMB 2010...\n');
    
    const retriever = new EnglishQuestionsRetriever();
    
    if (retriever.loadQuestions()) {
        // Display statistics
        retriever.getStatistics();
        
        // Display questions by category
        retriever.displayQuestionsByCategory();
        
        // Display all passages
        retriever.displayPassages();
        
        // Display all instructions
        retriever.displayInstructions();
        
        // Example: Display a specific question
        console.log('\n🔍 EXAMPLE: Displaying Question 2');
        retriever.displayQuestion(2);
        
        // Example: Search for questions containing "passage"
        console.log('\n🔍 EXAMPLE: Searching for questions related to "passage"');
        retriever.searchQuestions('passage');
    }
}

// Export the class for use in other modules
module.exports = EnglishQuestionsRetriever;

// Run the main function if this file is executed directly
if (require.main === module) {
    main();
}