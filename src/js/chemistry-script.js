// Chemistry CBT Exam Application - Robust functionality with proper error handling
// Import database functionality

class ChemistryCBTExamApp {
    constructor() {
        this.currentScreen = 'year-selection-screen';
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes in seconds
        this.timerInterval = null;
        this.questions = [];
        this.selectedSubject = 'Chemistry';
        this.selectedYear = 'jamb_2010'; // Default year for Chemistry
        this.years = []; // Will be populated dynamically
        
        // Initialize database
        this.initDatabase();
        
        this.initializeEventListeners();
        this.setupKeyboardNavigation();
        this.loadAvailableYears().then(() => {
            this.renderYearSelection();
        });
    }
    
    async initDatabase() {
        try {
            await examDB.init();
            console.log('Database initialized successfully');
            // Load questions into database if not already present
            this.loadQuestionsToDatabase();
        } catch (error) {
            console.error('Error initializing database:', error);
            // Fallback to JSON file if database fails
            console.log('Falling back to JSON file for questions');
        }
    }
    
    async loadQuestionsToDatabase() {
        // This would load questions from the JSON file to the database
        // For now, we'll just load from the JSON file as before
        // In a production environment, this would populate the database
    }
    
    // Function to dynamically load all available years for Chemistry by checking what files exist
    async loadAvailableYears() {
        try {
            // Test a range of years to see which ones have data files
            const possibleYears = [];
            const startYear = 1980;
            const endYear = 2024;
            
            // Check for each year in the range
            for (let year = startYear; year <= endYear; year++) {
                const fileName = `src/data/subjects/chemistry_questions_jamb_${year}.json`;
                try {
                    const response = await fetch(fileName, { method: 'HEAD' });
                    if (response.ok) {
                        possibleYears.push(`jamb_${year}`);
                    }
                } catch (fetchError) {
                    // File doesn't exist, continue to next year
                    continue;
                }
            }
            
            this.years = possibleYears;
            
            if (this.years.length === 0) {
                // If no files found, use a default year
                this.years = ['jamb_2010'];
                console.warn('No chemistry question files found, using default year');
            } else {
                console.log(`Loaded ${this.years.length} available years for Chemistry:`, this.years);
            }
        } catch (error) {
            console.error('Error loading available years:', error);
            // Fallback to a default year
            this.years = ['jamb_2010'];
        }
    }
    
    renderYearSelection() {
        const yearContainer = document.getElementById('year-container');
        if (!yearContainer) return;
        
        yearContainer.innerHTML = '';
        
        this.years.forEach(year => {
            const yearBtn = document.createElement('button');
            yearBtn.className = 'year-btn';
            yearBtn.textContent = year.replace('jamb_', 'JAMB ');
            yearBtn.addEventListener('click', async () => {
                this.selectedYear = year;
                await this.loadQuestionsForSubject(this.selectedSubject);
                this.showScreen('login-screen');
            });
            yearContainer.appendChild(yearBtn);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Only handle keyboard navigation during exam
            if (this.currentScreen !== 'exam-screen') {
                return;
            }

            // Prevent default behavior for keys we're handling
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'b', 'c', 'd', 'e'].includes(event.key)) {
                event.preventDefault();
            }

            // Handle navigation keys
            switch (event.key) {
                case 'ArrowLeft':
                    this.previousQuestion();
                    break;
                case 'ArrowRight':
                    this.nextQuestion();
                    break;
                case 'ArrowUp':
                    this.selectPreviousOption();
                    break;
                case 'ArrowDown':
                    this.selectNextOption();
                    break;
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                    this.selectOptionByKey(event.key);
                    break;
            }
        });
    }

    selectPreviousOption() {
        const options = document.querySelectorAll('.option-item');
        if (options.length === 0) return;

        // Find currently selected option
        let currentIndex = -1;
        options.forEach((option, index) => {
            if (option.classList.contains('selected')) {
                currentIndex = index;
            }
        });

        // If no option is selected, select the last one
        if (currentIndex === -1) {
            currentIndex = options.length;
        }

        // Select the previous option (with wrap-around)
        const targetIndex = (currentIndex - 1 + options.length) % options.length;
        options[targetIndex].click();
    }

    selectNextOption() {
        const options = document.querySelectorAll('.option-item');
        if (options.length === 0) return;

        // Find currently selected option
        let currentIndex = -1;
        options.forEach((option, index) => {
            if (option.classList.contains('selected')) {
                currentIndex = index;
            }
        });

        // If no option is selected, start with the first one
        if (currentIndex === -1) {
            currentIndex = -1;
        }

        // Select the next option (with wrap-around)
        const targetIndex = (currentIndex + 1) % options.length;
        options[targetIndex].click();
    }

    selectOptionByKey(key) {
        // Map key to option letter
        const optionLetter = key.toUpperCase();
        
        // Find the option element with this letter
        const options = document.querySelectorAll('.option-item');
        options.forEach(option => {
            const optionLabel = option.querySelector('label');
            if (optionLabel && optionLabel.textContent.trim().startsWith(optionLetter + '.')) {
                option.click();
            }
        });
    }
    
    async loadQuestionsForSubject(subject) {
        try {
            // Clear the database and repopulate with the selected year's data
            if (examDB && examDB.db) {
                await examDB.clearAllData();
                console.log('Database cleared before loading new data');
            }
            
            // Load from the selected year's JSON file
            const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_${this.selectedYear}.json`;
            const response = await fetch(fileName);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            }
            
            const subjectData = await response.json();
            
            if (subjectData) {
                if (subjectData.questions) {
                    this.questions = subjectData.questions;
                }
                
                // Store figures data for use in getDiagramPath method
                if (subjectData.figures) {
                    this.figures = subjectData.figures;
                }
                
                // Update the database with the loaded questions
                if (examDB && examDB.db) {
                    try {
                        await examDB.addQuestions(subject, subjectData.questions || []);
                        console.log(`Added ${subjectData.questions ? subjectData.questions.length : 0} questions to database for ${subject} (${this.selectedYear})`);
                    } catch (addError) {
                        console.error('Error adding questions to database:', addError || 'Unknown error');
                        if (addError && addError.stack) {
                            console.error('Stack trace:', addError.stack);
                        }
                    }
                }
                
                // For Chemistry, use all questions in their original order
                // Assign sequential IDs to maintain consistent numbering
                this.questions = this.questions.map((question, index) => {
                    return {
                        ...question,
                        id: index + 1  // Sequential numbering from 1 to total
                    };
                });
                console.log(`Loaded ${this.questions.length} chemistry questions for ${this.selectedYear} with sequential IDs`);
                
                this.renderQuestionList(); // Initialize the question list after loading questions
                // Questions are loaded, but don't change the screen - let the normal flow continue
                // The user should still go through login and instructions as normal
            } else {
                console.error(`Subject ${subject} not found in exams data`);
                alert(`Questions for ${subject} are not available.`);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('There was an error loading the exam questions. Please try again.');
        }
    }

    initializeEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Start exam button
        const startExamBtn = document.getElementById('start-exam-btn');
        if (startExamBtn) {
            startExamBtn.addEventListener('click', async () => {
                // Ensure questions are loaded before starting exam
                if (this.questions.length === 0) {
                    // If questions haven't been loaded yet, load them using the selected year
                    await this.loadQuestionsForSubject(this.selectedSubject);
                }
                this.startExam();
            });
        }

        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousQuestion();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.showSubmitConfirmation();
            });
        }

        // Modal buttons
        const confirmSubmitBtn = document.getElementById('confirm-submit');
        const cancelSubmitBtn = document.getElementById('cancel-submit');
        
        if (confirmSubmitBtn) {
            confirmSubmitBtn.addEventListener('click', () => {
                this.endExam();
                this.hideSubmitModal();
            });
        }
        
        if (cancelSubmitBtn) {
            cancelSubmitBtn.addEventListener('click', () => {
                this.hideSubmitModal();
            });
        }

        // Instructions screen back button
        const instructionsBackBtn = document.getElementById('instructions-back-btn');
        if (instructionsBackBtn) {
            instructionsBackBtn.addEventListener('click', () => {
                this.showScreen('year-selection-screen');
            });
        }
        
        // Restart button
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartExam();
            });
        }
        
        // Review button
        const reviewBtn = document.getElementById('review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                this.showReview();
            });
        }
        
        // Review finish button
        const reviewFinishBtn = document.getElementById('review-finish-btn');
        if (reviewFinishBtn) {
            reviewFinishBtn.addEventListener('click', () => {
                this.finishReview();
            });
        }
    }

    showSubmitConfirmation() {
        const modal = document.getElementById('submit-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideSubmitModal() {
        const modal = document.getElementById('submit-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async handleLogin() {
        const studentId = document.getElementById('student-id').value.trim();
        const examCode = document.getElementById('exam-code').value.trim();

        // Basic validation
        if (!studentId || !examCode) {
            alert('Please enter both Student ID and Exam Code');
            return;
        }

        // Ensure questions are loaded before proceeding
        if (this.questions.length === 0) {
            await this.loadQuestionsForSubject(this.selectedSubject);
        }

        // Simulate login validation
        if (studentId.length < 3) {
            alert('Student ID must be at least 3 characters long');
            return;
        }

        if (examCode.length < 4) {
            alert('Exam Code must be at least 4 characters long');
            return;
        }

        // Clear the form inputs after successful validation to prevent remembering
        document.getElementById('student-id').value = '';
        document.getElementById('exam-code').value = '';

        // If validation passes, show instructions screen
        this.showScreen('instructions-screen');
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show the requested screen
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        } else {
            console.error(`Screen ${screenId} not found`);
        }
    }

    startExam() {
        this.showScreen('exam-screen');
        this.startTimer();
        this.currentQuestionIndex = 0; // Reset to first question
        this.loadQuestion(this.currentQuestionIndex);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.examTime--;
            
            if (this.examTime <= 0) {
                this.endExam();
                return;
            }
            
            this.updateTimerDisplay();
            
            // Add warning class when time is running low (last 5 minutes)
            if (this.examTime <= 300) { // 5 minutes
                document.getElementById('timer').classList.add('warning');
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.examTime / 60);
        const seconds = this.examTime % 60;
        
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    async loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) {
            console.error('Invalid question index:', index);
            return;
        }

        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // Update question display - using innerHTML to support HTML tags like <u>
        document.getElementById("q-number").textContent = `Question ${question.id}`;
        
        // Handle diagrams in chemistry questions
        let questionHtml = question.question;
        
        // If the question has a figureId, add the diagram to the question display
        if (question.figureId) {
            // Find the figure information in the loaded subject data
            // For now, we'll add a placeholder that would be replaced with actual diagram
            questionHtml = `<div class="question-with-diagram">
                <div class="diagram-placeholder">
                    <img src="${this.getDiagramPath(question.figureId)}" alt="Diagram for question" class="question-diagram" onerror="this.style.display='none';">
                </div>
                <div class="question-text">${question.question}</div>
            </div>`;
        }
        
        document.getElementById("question-text").innerHTML = questionHtml;
        
        // Load options
        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";
        
        if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option, idx) => {
                // Handle both formats: object with id/text and simple string
                let optionLetter, optionText;
                if (typeof option === 'object' && option.id && option.text) {
                    optionLetter = option.id;
                    optionText = option.text;
                } else {
                    // Fallback to array index if option is not an object
                    optionLetter = String.fromCharCode(65 + idx); // A, B, C, D, E...
                    optionText = option;
                }
                
                const optionElement = document.createElement("div");
                optionElement.className = "option-item";
                optionElement.dataset.optionId = optionLetter;
                
                // Check if this option was previously selected
                const isSelected = this.answers[question.id] === optionLetter;
                if (isSelected) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.innerHTML = `
                    <input type="radio" id="opt-${question.id}-${optionLetter}" name="question-${question.id}"
                        value="${optionLetter}" ${isSelected ? 'checked' : ''}>
                    <label for="opt-${question.id}-${optionLetter}">${optionLetter}. ${optionText}</label>
                `;
                
                optionElement.addEventListener('click', () => {
                    this.selectOption(question.id, optionLetter);
                });
                
                optionsContainer.appendChild(optionElement);
            });
        }
        
        // Update question counter and progress
        document.getElementById("current-q").textContent = index + 1;
        document.getElementById("total-q").textContent = this.questions.length;
        
        // Update navigation buttons state
        this.updateNavigationButtons();
        
        // Update question list to highlight current question
        this.updateQuestionListHighlight();
        
        // Render MathJax equations if present
        this.renderMathJax();
    }
    
    getDiagramPath(figureId) {
        // Return the path to the diagram image based on the figureId
        // This looks up the figure in the loaded figures data
        if (this.figures && Array.isArray(this.figures)) {
            const figure = this.figures.find(fig => fig.id === figureId);
            if (figure) {
                return figure.file;
            }
        }
        // If not found in figures data, return a default path
        return `src/data/images/${figureId.toLowerCase()}.png`;
    }
    
    selectOption(questionId, optionId) {
        // Store the answer in the answers object
        this.answers[questionId] = optionId;

        // Update UI to show selected option
        const options = document.querySelectorAll(`.option-item[data-option-id="${optionId}"]`);
        options.forEach(option => {
            option.classList.add('selected');
        });

        // Remove selection from other options for this question
        const allOptions = document.querySelectorAll(`.option-item`);
        allOptions.forEach(option => {
            if (option.dataset.optionId !== optionId) {
                option.classList.remove('selected');
            }
        });

        // Update question list to show answered state
        this.updateQuestionListStatus();
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion(this.currentQuestionIndex);
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion(this.currentQuestionIndex);
        } else {
            // If we're at the last question, show submit confirmation
            this.showSubmitConfirmation();
        }
    }
    
    renderQuestionList() {
        const questionListContainer = document.getElementById('question-list-container');
        if (!questionListContainer) return;
        
        questionListContainer.innerHTML = '';
        
        for (let i = 0; i < this.questions.length; i++) {
            const questionBtn = document.createElement('button');
            questionBtn.className = 'question-list-item';
            questionBtn.textContent = i + 1;
            questionBtn.dataset.index = i;
            
            // Add click event to jump to question
            questionBtn.addEventListener('click', () => {
                this.currentQuestionIndex = i;
                this.loadQuestion(i);
            });
            
            questionListContainer.appendChild(questionBtn);
        }
        
        // Update the counter in the review section as well
        if (document.getElementById('review-question-counter')) {
            document.getElementById('review-question-counter').textContent = 
                `1 / ${this.questions.length}`;
        }
    }
    
    updateQuestionListStatus() {
        // Update the question list to show which questions have been answered
        const questionListItems = document.querySelectorAll('.question-list-item');
        
        questionListItems.forEach((item, index) => {
            // Remove answered class first
            item.classList.remove('answered');
            
            // Check if this question has been answered
            if (this.answers[this.questions[index].id]) {
                item.classList.add('answered');
            }
        });
    }
    
    updateQuestionListHighlight() {
        // Update the question list to highlight the current question
        const questionListItems = document.querySelectorAll('.question-list-item');
        
        questionListItems.forEach((item, index) => {
            // Remove current class first
            item.classList.remove('current');
            
            // Add current class to the current question
            if (index === this.currentQuestionIndex) {
                item.classList.add('current');
            }
        });
    }
    
    calculateScore() {
        let score = 0;
        
        for (let i = 0; i < this.questions.length; i++) {
            const question = this.questions[i];
            const userAnswer = this.answers[question.id];
            
            // Check if the answer is correct
            if (userAnswer && userAnswer === question.correct_answer) {
                score++;
            }
        }
        
        return score;
    }
    
    async endExam() {
        // Clear the timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Calculate score
        const score = this.calculateScore();
        const percentage = Math.round((score / this.questions.length) * 100);
        
        // Save exam result to database
        try {
            const studentId = document.getElementById('student-id').value || 'Anonymous';
            await examDB.saveExamResult(studentId, this.selectedSubject, this.answers, score, this.questions.length);
            console.log('Exam result saved to database');
        } catch (error) {
            console.error('Error saving exam result:', error);
        }
        
        // Show results screen
        this.showScreen('results-screen');
        
        // Update results display
        document.getElementById('score-display').textContent = score;
        document.getElementById('total-questions').textContent = this.questions.length;
        document.getElementById('percentage').textContent = percentage;
        
        // Store questions and answers for review
        this.reviewQuestions = this.questions;
        this.reviewAnswers = { ...this.answers };
    }
    
    showReview() {
        this.currentQuestionIndex = 0;
        this.showScreen('review-screen');
        this.renderReviewQuestion();
        this.updateReviewNavigation();
    }

    renderReviewQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const reviewContainer = document.getElementById('review-container');

        if (!reviewContainer) return;

        const userAnswer = this.answers[question.id];
        const isCorrect = userAnswer === question.correct_answer;

        let userAnswerText = 'No answer selected';
        if (userAnswer) {
            // Find the option text based on the user's answer
            let optionText = '';
            if (Array.isArray(question.options)) {
                for (const option of question.options) {
                    if (typeof option === 'object' && option.id === userAnswer) {
                        optionText = option.text;
                        break;
                    } else if (typeof option === 'string' && 
                              String.fromCharCode(65 + question.options.indexOf(option)) === userAnswer) {
                        optionText = option;
                        break;
                    }
                }
            }
            userAnswerText = `${userAnswer}. ${optionText}`;
        }

        // Find correct answer text
        let correctAnswerText = 'Unknown';
        if (question.correct_answer && Array.isArray(question.options)) {
            for (const option of question.options) {
                if (typeof option === 'object' && option.id === question.correct_answer) {
                    correctAnswerText = `${question.correct_answer}. ${option.text}`;
                    break;
                } else if (typeof option === 'string' && 
                          String.fromCharCode(65 + question.options.indexOf(option)) === question.correct_answer) {
                    correctAnswerText = `${question.correct_answer}. ${option}`;
                    break;
                }
            }
        }

        // Handle diagrams in chemistry questions
        let questionHtml = question.question;
        if (question.figureId) {
            questionHtml = `<div class="question-with-diagram">
                <div class="diagram-placeholder">
                    <img src="${this.getDiagramPath(question.figureId)}" alt="Diagram for question" class="question-diagram" onerror="this.style.display='none';">
                </div>
                <div class="question-text">${question.question}</div>
            </div>`;
        }

        // Create beginner-friendly explanation
        let explanation = question.explanation || 'No explanation available.';
        // Make the explanation more beginner-friendly by adding some context
        if (explanation && explanation !== 'No explanation available.') {
            explanation = this.makeExplanationBeginnerFriendly(explanation);
        } else if (explanation === 'No explanation available.') {
            // Provide a basic explanation when none exists
            explanation = "No detailed explanation is provided for this question. Review the concepts related to this topic in your chemistry textbook for better understanding.";
        }

        reviewContainer.innerHTML = `
            <div class="review-header">
                <h3>Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</h3>
                <div class="question-status ${isCorrect ? 'correct' : userAnswer ? 'incorrect' : 'unanswered'}">
                    ${isCorrect ? '✓ Correct' : userAnswer ? '✗ Incorrect' : '? Not Answered'}
                </div>
            </div>
            <div class="review-question">
                <h4>${questionHtml}</h4>

                <div class="options-review">
                    ${Array.isArray(question.options) ? question.options.map(option => {
                        let optionId, optionText;
                        if (typeof option === 'object' && option.id && option.text) {
                            optionId = option.id;
                            optionText = option.text;
                        } else {
                            // Handle simple string options
                            const idx = question.options.indexOf(option);
                            optionId = String.fromCharCode(65 + idx); // A, B, C, D, E...
                            optionText = option;
                        }

                        const isUserSelection = userAnswer === optionId;
                        const isCorrectOption = question.correct_answer === optionId;

                        let optionClass = 'option-review';
                        if (isCorrectOption) optionClass += ' correct-answer';
                        if (isUserSelection && !isCorrectOption) optionClass += ' user-wrong-answer';
                        if (isUserSelection && isCorrectOption) optionClass += ' user-correct-answer';

                        return `
                            <div class="${optionClass}">
                                <strong>${optionId}.</strong> ${optionText}
                                ${isUserSelection ? ' <span class="user-selection">(Your answer)</span>' : ''}
                                ${isCorrectOption ? ' <span class="correct-indicator">(Correct answer)</span>' : ''}
                            </div>
                        `;
                    }).join('') : ''}
                </div>

                <div class="explanation">
                    <h5>Detailed Explanation:</h5>
                    <p>${explanation}</p>
                    
                    <!-- Additional learning resources section -->
                    <div class="additional-learning">
                        <h6>Key Concepts:</h6>
                        <ul>
                            <li>This question tests your understanding of fundamental chemistry principles.</li>
                            <li>Review the relevant chapter in your textbook for more practice.</li>
                            <li>Pay attention to the chemical formulas, equations, and reaction conditions.</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Render MathJax equations if present
        this.renderMathJax();
    }

    // Method to make explanations more beginner-friendly
    makeExplanationBeginnerFriendly(explanation) {
        // Replace complex terms with simpler explanations
        let friendlyExplanation = explanation;
        
        // Common chemistry terms that need simplification
        friendlyExplanation = friendlyExplanation.replace(/\b(mole|moles)\b/gi, 'amount of substance (6.02 x 10²³ particles)');
        friendlyExplanation = friendlyExplanation.replace(/\b(molarity)\b/gi, 'concentration (how much of a substance in solution, measured in mol/dm³)');
        friendlyExplanation = friendlyExplanation.replace(/\b(ionic bond)\b/gi, 'bond between charged atoms (ions)');
        friendlyExplanation = friendlyExplanation.replace(/\b(covalent bond)\b/gi, 'bond where atoms share electrons');
        friendlyExplanation = friendlyExplanation.replace(/\b(electronegativity)\b/gi, 'how strongly an atom attracts electrons in a bond');
        friendlyExplanation = friendlyExplanation.replace(/\b(catalyst)\b/gi, 'substance that speeds up a reaction without being consumed');
        friendlyExplanation = friendlyExplanation.replace(/\b(activation energy)\b/gi, 'minimum energy needed for a reaction to occur');
        friendlyExplanation = friendlyExplanation.replace(/\b(Le Chatelier's principle)\b/gi, 'when conditions change, the equilibrium shifts to oppose the change');
        friendlyExplanation = friendlyExplanation.replace(/\b(pH)\b/gi, 'measure of how acidic or basic a solution is (0-14 scale)');
        friendlyExplanation = friendlyExplanation.replace(/\b(oxidation)\b/gi, 'loss of electrons or addition of oxygen');
        friendlyExplanation = friendlyExplanation.replace(/\b(reduction)\b/gi, 'gain of electrons or removal of oxygen');
        friendlyExplanation = friendlyExplanation.replace(/\b(redox)\b/gi, 'reaction involving both oxidation and reduction');
        friendlyExplanation = friendlyExplanation.replace(/\b(electrolysis)\b/gi, 'using electricity to cause a chemical reaction');
        friendlyExplanation = friendlyExplanation.replace(/\b(isotopes)\b/gi, 'atoms of the same element with different numbers of neutrons');
        friendlyExplanation = friendlyExplanation.replace(/\b(atomic number)\b/gi, 'number of protons in an atom');
        friendlyExplanation = friendlyExplanation.replace(/\b(mass number)\b/gi, 'total number of protons and neutrons in an atom');
        friendlyExplanation = friendlyExplanation.replace(/\b(valence electrons)\b/gi, 'electrons in the outermost shell of an atom');
        friendlyExplanation = friendlyExplanation.replace(/\b(periodic table)\b/gi, 'organized arrangement of all known chemical elements');
        friendlyExplanation = friendlyExplanation.replace(/\b(chemical equation)\b/gi, 'written representation of a chemical reaction');
        friendlyExplanation = friendlyExplanation.replace(/\b(balancing equations)\b/gi, 'making sure the same number of each type of atom appears on both sides');
        friendlyExplanation = friendlyExplanation.replace(/\b(reactants)\b/gi, 'substances that react (on the left side of equation)');
        friendlyExplanation = friendlyExplanation.replace(/\b(products)\b/gi, 'substances formed (on the right side of equation)');
        friendlyExplanation = friendlyExplanation.replace(/\b(concentration)\b/gi, 'amount of substance in a given volume');
        friendlyExplanation = friendlyExplanation.replace(/\b(saturation)\b/gi, 'when no more solute can dissolve in a solvent');
        friendlyExplanation = friendlyExplanation.replace(/\b(solubility)\b/gi, 'ability of a substance to dissolve in a solvent');
        friendlyExplanation = friendlyExplanation.replace(/\b(ionic equation)\b/gi, 'chemical equation showing only the ions that participate in the reaction');
        friendlyExplanation = friendlyExplanation.replace(/\b(spectator ions)\b/gi, 'ions that do not participate in the reaction');
        friendlyExplanation = friendlyExplanation.replace(/\b(gas laws)\b/gi, 'rules describing how gases behave under different conditions');
        friendlyExplanation = friendlyExplanation.replace(/\b(ideal gas)\b/gi, 'theoretical gas that follows gas laws perfectly');
        friendlyExplanation = friendlyExplanation.replace(/\b(standard temperature and pressure)\b/gi, 'conditions of 0°C and 1 atm used for gas calculations');
        friendlyExplanation = friendlyExplanation.replace(/\b(STP)\b/gi, 'standard temperature and pressure (0°C and 1 atm)');
        friendlyExplanation = friendlyExplanation.replace(/\b(empirical formula)\b/gi, 'simplest whole number ratio of atoms in a compound');
        friendlyExplanation = friendlyExplanation.replace(/\b(molecular formula)\b/gi, 'actual number of each type of atom in a molecule');
        friendlyExplanation = friendlyExplanation.replace(/\b(structural formula)\b/gi, 'shows how atoms are arranged and bonded in a molecule');
        
        // Add more context for beginners
        if (!friendlyExplanation.toLowerCase().includes('because') && 
            !friendlyExplanation.toLowerCase().includes('this is because') &&
            !friendlyExplanation.toLowerCase().includes('reason') &&
            !friendlyExplanation.toLowerCase().includes('why')) {
            // Add a simple reason explanation if not already present
            if (friendlyExplanation.length > 50) { // Only for longer explanations
                friendlyExplanation += " This occurs due to the fundamental principles of chemistry.";
            } else {
                friendlyExplanation += " This is a fundamental principle in chemistry.";
            }
        }
        
        // Add context for chemical reactions
        if (friendlyExplanation.toLowerCase().includes('react') || 
            friendlyExplanation.toLowerCase().includes('reaction') ||
            friendlyExplanation.toLowerCase().includes('equation')) {
            friendlyExplanation += " Chemical reactions involve rearranging atoms to form new substances while conserving mass and charge.";
        }
        
        return friendlyExplanation;
    }

    // Method to render MathJax equations in dynamically loaded content
    renderMathJax() {
        // Check if MathJax is loaded
        if (window.MathJax) {
            // Defer the typesetting to ensure content is rendered first
            setTimeout(() => {
                try {
                    // Clear the restart queue to avoid conflicts
                    MathJax.typesetClear();
                    // Typeset all content with math
                    MathJax.typeset(["#question-text", "#options-container", "#review-container"]);
                } catch (error) {
                    console.warn('MathJax rendering error:', error);
                }
            }, 100); // Small delay to ensure DOM is updated
        }
    }

    updateReviewNavigation() {
        const prevBtn = document.getElementById('review-prev-btn');
        const nextBtn = document.getElementById('review-next-btn');
        const questionCounter = document.getElementById('review-question-counter');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
            prevBtn.onclick = () => {
                if (this.currentQuestionIndex > 0) {
                    this.currentQuestionIndex--;
                    this.renderReviewQuestion();
                    this.updateReviewNavigation();
                }
            };
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
            nextBtn.onclick = () => {
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.currentQuestionIndex++;
                    this.renderReviewQuestion();
                    this.updateReviewNavigation();
                }
            };
        }

        if (questionCounter) {
            questionCounter.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
        }
    }

    finishReview() {
        this.showScreen('results-screen');
    }
    
    restartExam() {
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes
        
        // Clear timer if it exists
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Go back to year selection
        this.showScreen('year-selection-screen');
    }
    
    // Method to get all available years for chemistry
    getAvailableYears() {
        return this.years;
    }
}

// Initialize the Chemistry CBT Exam Application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.chemistryApp = new ChemistryCBTExamApp();
});