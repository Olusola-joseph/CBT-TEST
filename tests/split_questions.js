const fs = require('fs');

// Load the main exams.json file
const exams = JSON.parse(fs.readFileSync('exams.json', 'utf8'));

// Get all subjects
const subjects = Object.keys(exams);

// Create a separate file for each subject
subjects.forEach(subject => {
    const filename = `${subject.toLowerCase()}_questions.json`;
    const subjectData = {
        subject: subject,
        questions: exams[subject]
    };
    
    fs.writeFileSync(filename, JSON.stringify(subjectData, null, 2));
    console.log(`Created ${filename} with ${exams[subject].length} questions`);
});

console.log(`\nSplit complete! Created ${subjects.length} subject files.`);