const fs = require('fs');
const path = require('path');

// Function to load and analyze all math questions
function analyzeMathQuestions() {
    const subjectsDir = './src/data/subjects/';
    const mathFiles = fs.readdirSync(subjectsDir).filter(file => 
        file.startsWith('mathematics_questions_jamb_') && file.endsWith('.json')
    );
    
    console.log('Analyzing Mathematics questions across all years...\n');
    
    const issues = [];
    
    for (const file of mathFiles) {
        const filePath = path.join(subjectsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        console.log(`Processing ${file}...`);
        
        for (const question of data.questions) {
            // Check if correctAnswer exists in the options
            const validOptions = ['A', 'B', 'C', 'D'];
            const optionIds = question.options.map(opt => opt.id);
            
            if (!validOptions.includes(question.correctAnswer)) {
                issues.push({
                    file: file,
                    questionId: question.id,
                    question: question.question,
                    correctAnswer: question.correctAnswer,
                    options: question.options,
                    issue: 'Correct answer not in valid options (A, B, C, D)'
                });
            }
            
            // Check if the correctAnswer exists in the options array
            const correctOptionExists = question.options.some(opt => opt.id === question.correctAnswer);
            if (!correctOptionExists) {
                issues.push({
                    file: file,
                    questionId: question.id,
                    question: question.question,
                    correctAnswer: question.correctAnswer,
                    options: question.options,
                    issue: 'Correct answer does not exist in options array'
                });
            }
            
            // Check for any obvious errors in the question or options
            if (question.question && question.question.includes('s') && question.correctAnswer === 'C' && question.options.find(opt => opt.id === 'C' && opt.text === 's')) {
                // This might be a typo where 's' was used instead of a number
                issues.push({
                    file: file,
                    questionId: question.id,
                    question: question.question,
                    correctAnswer: question.correctAnswer,
                    options: question.options,
                    issue: 'Option C contains "s" which might be a typo for a number'
                });
            }
            
            // Check for mathematical inconsistencies in explanations
            if (question.explanation) {
                // Look for explanations that indicate the correct answer is not among options
                if (question.explanation.toLowerCase().includes('none of the options') || 
                    question.explanation.toLowerCase().includes('not listed correctly') ||
                    question.explanation.toLowerCase().includes('answer doesn\'t match') ||
                    question.explanation.toLowerCase().includes('possible error') ||
                    question.explanation.toLowerCase().includes('typo') ||
                    question.explanation.toLowerCase().includes('speculative') ||
                    (question.explanation.toLowerCase().includes('mathematically') && question.explanation.toLowerCase().includes('should be'))) {
                    issues.push({
                        file: file,
                        questionId: question.id,
                        question: question.question,
                        correctAnswer: question.correctAnswer,
                        options: question.options,
                        issue: 'Explanation indicates mathematical error or answer not in options',
                        explanation: question.explanation
                    });
                }
            }
        }
    }
    
    console.log(`\nFound ${issues.length} issues in Mathematics questions:\n`);
    
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        console.log(`Issue ${i + 1}:`);
        console.log(`File: ${issue.file}`);
        console.log(`Question ID: ${issue.questionId}`);
        console.log(`Issue: ${issue.issue}`);
        console.log(`Question: ${issue.question}`);
        console.log(`Correct Answer: ${issue.correctAnswer}`);
        console.log('Options:');
        for (const opt of issue.options) {
            console.log(`  ${opt.id}: ${opt.text}`);
        }
        console.log('---\n');
    }
    
    // Write issues to a file
    fs.writeFileSync('./math_issues_report.json', JSON.stringify(issues, null, 2));
    console.log(`\nReport saved to math_issues_report.json`);
    
    return issues;
}

// Run the analysis
analyzeMathQuestions();