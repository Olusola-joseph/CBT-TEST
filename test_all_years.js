// Comprehensive test to verify all years are available for all subjects
const fs = require('fs');
const path = require('path');

console.log('Testing all years (2010-2019) for all subjects...\n');

const subjects = ['English', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Government', 'Economics', 'Financial_Account'];
const years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];

let allFilesFound = true;
let totalFiles = 0;
let missingFiles = [];

for (const subject of subjects) {
    console.log(`\nTesting ${subject}:`);
    
    for (const year of years) {
        const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_jamb_${year}.json`;
        totalFiles++;
        
        if (fs.existsSync(fileName)) {
            try {
                const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
                const questionCount = data.questions ? data.questions.length : 0;
                console.log(`  ✓ ${year}: ${questionCount} questions`);
            } catch (error) {
                console.log(`  ✗ ${year}: Error parsing JSON - ${error.message}`);
                allFilesFound = false;
                missingFiles.push(fileName);
            }
        } else {
            console.log(`  ✗ ${year}: File not found`);
            allFilesFound = false;
            missingFiles.push(fileName);
        }
    }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Total files checked: ${totalFiles}`);
console.log(`Missing files: ${missingFiles.length}`);

if (missingFiles.length > 0) {
    console.log(`Missing files list:`);
    missingFiles.forEach(file => console.log(`  - ${file}`));
}

if (allFilesFound) {
    console.log('✓ All years loaded successfully for all subjects!');
    console.log('✓ Application is ready with years 2010-2019!');
} else {
    console.log('✗ Some files are missing or have errors');
    console.log('✗ Please check the missing files above');
}

console.log(`${'='.repeat(60)}`);