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

## Mathematical Expression Formatting

For proper display of mathematical expressions, including fractions, exponentials, roots, and other mathematical elements, in the Mathematics section of the CBT platform, refer to these additional resources:

### Files Included

1. **math_formatting_guide.md** - A markdown guide showing proper mathematical formatting
2. **math_fractions_display.html** - An HTML file with MathJax for rendering mathematical expressions in browsers
3. **math_fractions_example.tex** - A LaTeX document demonstrating proper mathematical formatting
4. **math_expressions_guide.md** - A comprehensive guide to formatting all mathematical expressions including fractions, exponentials, roots, logarithms, and more
5. **math_expressions_demo.html** - An HTML demonstration of all mathematical expressions with proper rendering using MathJax
6. **math_expressions_example.tex** - A LaTeX document with examples of all mathematical expressions

### Key Formatting Tips for Mathematical Questions

1. **Fractions**: Use `\frac{numerator}{denominator}`
   - Example: `\frac{a}{b}` renders as $\frac{a}{b}$

2. **Exponentials**: Use `^{exponent}`
   - Example: `x^{2}` renders as $x^{2}$
   - Example: `e^{x}` renders as $e^{x}$
   - Example: `x^{\frac{1}{2}}` renders as $x^{\frac{1}{2}}$

3. **Roots**: Use `\sqrt{expression}` or `\sqrt[n]{expression}`
   - Example: `\sqrt{16}` renders as $\sqrt{16}$
   - Example: `\sqrt[3]{27}` renders as $\sqrt[3]{27}$

4. **Logarithms**: Use `\log`, `\ln`, or `\log_{base}`
   - Example: `\log(x)` renders as $\log(x)$
   - Example: `\ln(x)` renders as $\ln(x)$
   - Example: `\log_2(x)` renders as $\log_2(x)$

5. **Trigonometric Functions**: Use `\sin`, `\cos`, `\tan`, etc.
   - Example: `\sin(x)` renders as $\sin(x)$
   - Example: `\sin^2(x)` renders as $\sin^2(x)$

6. **For displayed equations (centered), use double dollar signs**:
   - `$$\frac{a}{b}$$` for displayed fractions

7. **For inline math, use single dollar signs**:
   - `$\frac{a}{b}$` for inline fractions

### Example Problem Format

When creating mathematics questions, format them properly as:

"Simplify: $$\frac{3^{-1} \times 9^{\frac{1}{2}}}{27^{-\frac{1}{3}}}$$"

This ensures that fractions, exponentials, and other mathematical expressions are displayed correctly in the examination interface.

These resources will help ensure that all mathematical expressions, especially fractions, exponentials, and other complex expressions, are displayed clearly and correctly in the mathematics questions.