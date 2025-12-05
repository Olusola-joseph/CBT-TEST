// Test script to simulate browser fetch requests for subject files
const http = require('http');

// Test if the server can serve the subject files that the browser would fetch
const testFiles = [
    'src/data/subjects/english_questions_jamb_2010.json',
    'src/data/subjects/mathematics_questions_jamb_2010.json',
    'src/data/subjects/physics_questions_jamb_2010.json',
    'src/data/subjects/biology_questions_jamb_2010.json',
    'src/data/subjects/chemistry_questions_jamb_2010.json',
    'src/data/subjects/government_questions_jamb_2010.json',
    'src/data/subjects/economics_questions_jamb_2010.json',
    'src/data/subjects/financial_account_questions_jamb_2010.json'
];

console.log('Testing if server can serve subject files that the browser would fetch...\n');

// Test each file by making a request to the server
let completedTests = 0;

function testFile(filePath) {
    const options = {
        host: 'localhost',
        port: 8080,
        path: '/' + filePath,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            console.log(`✓ ${filePath} - Status: ${res.statusCode} (OK)`);
        } else {
            console.log(`✗ ${filePath} - Status: ${res.statusCode} (Not OK)`);
        }
        
        completedTests++;
        if (completedTests === testFiles.length) {
            console.log('\nAll file access tests completed.');
            console.log('If all files are accessible, the subject loading should work properly in the browser.');
        }
    });

    req.on('error', (e) => {
        console.log(`✗ ${filePath} - Error: ${e.message}`);
        completedTests++;
        if (completedTests === testFiles.length) {
            console.log('\nAll file access tests completed.');
        }
    });

    req.end();
}

// Test all files
testFiles.forEach(testFile);