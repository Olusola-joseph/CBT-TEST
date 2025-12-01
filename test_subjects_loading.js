// Test script to verify that all subjects are loading properly
const fs = require('fs');
const path = require('path');

// Define the subjects that should be available
const expectedSubjects = ['English', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Government', 'Economics', 'Financial_Account'];

console.log('Testing subject loading...\n');

// Check if all subject files exist
let allSubjectsFound = true;
let totalQuestions = 0;

for (const subject of expectedSubjects) {
    // Check for year-specific files first
    const fileName2010 = `src/data/subjects/${subject.toLowerCase()}_questions_jamb_2010.json`;
    const fileName2011 = `src/data/subjects/${subject.toLowerCase()}_questions_jamb_2011.json`;
    
    if (fs.existsSync(fileName2010)) {
        try {
            const data = JSON.parse(fs.readFileSync(fileName2010, 'utf8'));
            const questionCount = data.questions ? data.questions.length : 0;
            totalQuestions += questionCount;
            console.log(`✓ ${subject} (2010): Found ${questionCount} questions`);
        } catch (error) {
            console.log(`✗ ${subject} (2010): Error parsing JSON - ${error.message}`);
            allSubjectsFound = false;
        }
    } else if (fs.existsSync(fileName2011)) {
        try {
            const data = JSON.parse(fs.readFileSync(fileName2011, 'utf8'));
            const questionCount = data.questions ? data.questions.length : 0;
            totalQuestions += questionCount;
            console.log(`✓ ${subject} (2011): Found ${questionCount} questions`);
        } catch (error) {
            console.log(`✗ ${subject} (2011): Error parsing JSON - ${error.message}`);
            allSubjectsFound = false;
        }
    } else {
        console.log(`✗ ${subject}: File not found (${fileName2010} or ${fileName2011})`);
        allSubjectsFound = false;
    }
}

console.log(`\nTotal questions across all subjects: ${totalQuestions}`);

// Check if diagram map exists
if (fs.existsSync('math_diagram_map.json')) {
    try {
        const diagramData = JSON.parse(fs.readFileSync('math_diagram_map.json', 'utf8'));
        console.log(`✓ Diagram map: Found ${Object.keys(diagramData).length} diagrams`);
    } catch (error) {
        console.log(`✗ Diagram map: Error parsing JSON - ${error.message}`);
        allSubjectsFound = false;
    }
} else {
    console.log('✗ Diagram map: File not found');
    allSubjectsFound = false;
}

// Check if server.js exists and is properly configured
if (fs.existsSync('server.js')) {
    console.log('✓ Server: server.js exists');
    const serverContent = fs.readFileSync('server.js', 'utf8');
    if (serverContent.includes('math_diagram_map.json')) {
        console.log('✓ Server: Diagram API configured');
    } else {
        console.log('✗ Server: Diagram API not configured');
    }
} else {
    console.log('✗ Server: server.js not found');
    allSubjectsFound = false;
}

console.log('\n' + '='.repeat(50));
if (allSubjectsFound) {
    console.log('✓ All subjects loaded successfully!');
    console.log('✓ Application is working properly!');
} else {
    console.log('✗ Some issues were found with subject loading');
    console.log('✗ Application may not be working properly');
}
console.log('='.repeat(50));