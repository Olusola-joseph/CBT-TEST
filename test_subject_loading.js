// Test script to verify subject loading functionality
const fs = require('fs');
const path = require('path');

// Test the subject loading logic that's in the main script
const possibleSubjects = [
    'English', 'Mathematics', 'Physics', 'Biology', 
    'Chemistry', 'Government', 'Economics', 'Financial_Account'
];

const years = ['jamb_2010', 'jamb_2011', 'jamb_2012', 'jamb_2013', 'jamb_2014', 'jamb_2015', 'jamb_2016', 'jamb_2017', 'jamb_2018', 'jamb_2019'];

console.log('Testing subject file availability...\n');

const availableSubjects = [];
for (const subject of possibleSubjects) {
    let hasFiles = false;
    
    // Check all available years for this subject
    for (const year of years) {
        const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_${year}.json`;
        
        if (fs.existsSync(path.join(__dirname, fileName))) {
            hasFiles = true;
            console.log(`✓ ${subject} - Found: ${fileName}`);
            break; // Found a valid file, no need to check other years for this subject
        }
    }
    
    if (hasFiles) {
        availableSubjects.push(subject);
    } else {
        console.log(`✗ ${subject} - No files found`);
    }
}

console.log('\nAvailable subjects detected:', availableSubjects);
console.log(`Total subjects found: ${availableSubjects.length}`);

if (availableSubjects.length === 0) {
    console.log('\nERROR: No subjects found! There may be an issue with file paths or naming.');
    console.log('Check that the file names match the expected pattern: subjectname_questions_year.json');
} else {
    console.log('\nSUCCESS: All subjects should be available for selection.');
}