# CBT-TEST

A robust Computer-Based Test (CBT) examination platform with comprehensive functionality and responsive design.

## Features

- **Student Authentication**: Secure login with Student ID and Exam Code
- **Exam Instructions**: Clear instructions before starting the exam
- **Timer Functionality**: Countdown timer with warning when time is running low
- **Question Navigation**: Move between questions with Previous/Next buttons
- **Question List**: Visual overview of all questions with answered status
- **Auto-save**: Answers are saved automatically as you select them
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Results Display**: Shows score and percentage upon completion
- **Exam Restart**: Option to take another exam after completion

## Functionality

- **Login Screen**: Students enter their ID and exam code to start
- **Instructions Screen**: Shows exam guidelines and time limit
- **Exam Screen**: Main testing interface with:
  - Question display
  - Multiple choice options
  - Timer and progress indicator
  - Navigation controls
  - Question list overview
- **Results Screen**: Shows final score and percentage

## Technical Implementation

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Responsive design with animations and transitions
- **JavaScript ES6**: Object-oriented programming with error handling
- **Modern UI**: Clean, intuitive interface with visual feedback

## How to Run

1. Clone the repository
2. Open `index.html` in a web browser, or
3. Use a local server (e.g., `npx serve .`)

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - Responsive styling with animations
- `script.js` - Core functionality and exam logic
- `database.js` - IndexedDB functionality for local storage
- `package.json` - Project dependencies and scripts
- `exams.json` - Original combined questions file
- `english_questions.json` - English subject questions
- `mathematics_questions.json` - Mathematics subject questions
- `physics_questions.json` - Physics subject questions
- `biology_questions.json` - Biology subject questions
- `chemistry_questions.json` - Chemistry subject questions
- `government_questions.json` - Government subject questions
- `economics_questions.json` - Economics subject questions
- `financial_account_questions.json` - Financial Accounting subject questions

## Database and Question Management

The application now supports loading questions from individual subject-specific JSON files, improving organization and maintainability. Questions are loaded dynamically based on the selected subject, and the IndexedDB is used for caching questions locally for faster access.

## Sample Questions

The application includes comprehensive questions for 8 subjects (English, Mathematics, Physics, Biology, Chemistry, Government, Economics, and Financial Accounting) with 100 questions each, organized in subject-specific JSON files. This structure allows for easy maintenance and expansion of question sets.