// Economics CBT Exam Application - Robust functionality with proper error handling
// Import database functionality

class EconomicsCBTExamApp {
    constructor() {
        this.currentScreen = 'year-selection-screen';
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes in seconds
        this.timerInterval = null;
        this.questions = [];
        this.selectedSubject = 'Economics';
        this.selectedYear = 'jamb_1983'; // Default year for Economics
        // Economics has years from 1983-1993
        this.years = ['jamb_1983', 'jamb_1984', 'jamb_1985', 'jamb_1986', 'jamb_1987', 'jamb_1988', 'jamb_1989', 'jamb_1990', 'jamb_1991', 'jamb_1992', 'jamb_1993']; // Available years for Economics
        
        // Initialize database
        this.initDatabase();
        
        this.initializeEventListeners();
        this.setupKeyboardNavigation();
        this.renderYearSelection();
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
                
                // For Economics, use all questions in their original order
                // Assign sequential IDs to maintain consistent numbering
                this.questions = this.questions.map((question, index) => {
                    return {
                        ...question,
                        id: index + 1  // Sequential numbering from 1 to total
                    };
                });
                console.log(`Loaded ${this.questions.length} economics questions for ${this.selectedYear} with sequential IDs`);
                
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
        
        // Handle diagrams in economics questions
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
        document.getElementById("current-q").textContent = index + 1;
        document.getElementById("total-q").textContent = this.questions.length;
        
        // Render options
        this.renderOptions(question);
        
        // Update question list highlighting
        this.updateQuestionList();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Add animation class for smooth transition
        const questionBody = document.querySelector('.question-body');
        if (questionBody) {
            questionBody.classList.add('question-transition');
            setTimeout(() => {
                questionBody.classList.remove('question-transition');
            }, 300);
        }
        
        // Focus the first option for better keyboard navigation
        setTimeout(() => {
            const firstOption = document.querySelector('.option-item');
            if (firstOption) {
                firstOption.focus();
            }
        }, 100);
    }

    renderOptions(question) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        // For Economics questions, render standard radio button options
        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.dataset.optionId = option.id;
            optionElement.tabIndex = 0; // Make the option focusable

            // Check if this option was previously selected
            const isSelected = this.answers[question.id] === option.id;
            if (isSelected) {
                optionElement.classList.add('selected');
            }

            const fixedOptionText = option.text
            optionElement.innerHTML = `
                <input type="radio" id="opt-${question.id}-${option.id}" name="question-${question.id}"
                    value="${option.id}" ${isSelected ? 'checked' : ''}>
                <label for="opt-${question.id}-${option.id}">${option.id}. ${fixedOptionText}</label>
            `;

            optionElement.addEventListener('click', () => {
                this.selectOption(question.id, option.id);
            });
            
            // Add keyboard event listener for the option
            optionElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.selectOption(question.id, option.id);
                }
            });

            optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(questionId, optionId) {
        // Store the answer in the answers object
        this.answers[questionId] = optionId;

        // Update UI to show selected option
        const options = document.querySelectorAll(`.option-item[data-option-id="${optionId}"]`);
        options.forEach(option => {
            option.classList.add('selected');
            option.focus(); // Focus the selected option for better keyboard navigation
        });

        // Remove selection from other options for this question
        const allOptions = document.querySelectorAll(`.option-item`);
        allOptions.forEach(option => {
            if (option.dataset.optionId !== optionId) {
                option.classList.remove('selected');
            }
        });

        // Update question list to show answered state
        this.updateQuestionList();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
            // Focus the previous button to maintain keyboard accessibility
            setTimeout(() => {
                const prevBtn = document.getElementById('prev-btn');
                if (prevBtn) prevBtn.focus();
            }, 100);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
            // Focus the next button to maintain keyboard accessibility
            setTimeout(() => {
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn) nextBtn.focus();
            }, 100);
        }
    }

    updateNavigationButtons() {
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (nextBtn) {
            // Disable next button if on the last question
            nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
        }

        if (submitBtn) {
            // Always show submit button so student can submit at any time
            submitBtn.style.display = 'inline-block';
        }
    }

    renderQuestionList() {
        const container = document.getElementById('question-list-container');
        container.innerHTML = '';

        this.questions.forEach((question, index) => {
            const button = document.createElement('button');
            button.className = 'question-btn';
            button.textContent = index + 1;
            button.dataset.index = index;

            button.addEventListener('click', () => {
                this.loadQuestion(index);
            });

            container.appendChild(button);
        });
    }

    updateQuestionList() {
        const buttons = document.querySelectorAll('.question-btn');
        buttons.forEach((button, index) => {
            button.classList.remove('answered', 'current');

            if (this.answers[this.questions[index].id]) {
                button.classList.add('answered');
            }

            if (index === this.currentQuestionIndex) {
                button.classList.add('current');
            }
        });
    }

    getDiagramPath(figureId) {
        // This method should return the path to the diagram based on the figureId
        // First check if we have figures data loaded
        if (this.figures && Array.isArray(this.figures)) {
            // If we have figures data, find the matching figure
            const figure = this.figures.find(fig => fig.id === figureId);
            if (figure && figure.file) {
                // Return the exact path from the JSON file, which should be relative to the HTML file
                // The JSON contains paths like "images/econ1983_q4_demand_supply.png"
                // Since images are in src/data/subjects/images, the path from HTML root would be:
                // "src/data/subjects/images/econ1983_q4_demand_supply.png"
                if (figure.file.startsWith('images/')) {
                    return `src/data/subjects/${figure.file}`;
                }
                return figure.file;
            }
        }
        
        // If not found or figures not loaded, construct a default path
        // This follows the pattern from the JSON files (e.g., images/econ1983_q4_demand_supply.png)
        if (figureId && typeof figureId === 'string') {
            // Convert the figureId to the expected image path format
            // Example: "Econ1983_Fig1" -> "images/econ1983_q1_*.png" (we'll use a generic pattern)
            const idLower = figureId.toLowerCase();
            if (idLower.includes('econ')) {
                // Try to extract year and convert to image path
                const match = figureId.match(/Econ(\d{4})_Fig(\d+)/i);
                if (match) {
                    const year = match[1];
                    const figNum = match[2];
                    return `src/data/subjects/images/econ${year}_q${figNum}_diagram.png`;
                }
            }
            return `src/data/subjects/images/${figureId.toLowerCase()}.png`;
        }
        
        // Default fallback
        return `src/data/subjects/images/default_diagram.png`;
    }

    // Remove the old submitExam method since it's now handled by the modal
    // The endExam method is still used but called from the modal confirm button

    endExam() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Calculate score
        const score = this.calculateScore();

        // Show results screen
        this.showResults(score);

        // Save exam result to database
        this.saveExamResult(score);
    }

    saveExamResult(score) {
        if (examDB && examDB.db) {
            examDB.saveExamResult(
                document.getElementById('student-id').value,
                this.selectedSubject,
                this.answers,
                score,
                this.questions.length
            ).catch(error => {
                console.error('Error saving exam result:', error);
            });
        }
    }

    calculateScore() {
        let correct = 0;

        this.questions.forEach(question => {
            if (this.answers[question.id] === question.correctAnswer) {
                correct++;
            }
        });

        return correct;
    }

    showResults(score) {
        this.showScreen('results-screen');

        const totalQuestions = this.questions.length;
        const percentage = Math.round((score / totalQuestions) * 100);

        document.getElementById('score-display').textContent = score;
        document.getElementById('total-questions').textContent = totalQuestions;
        document.getElementById('percentage').textContent = percentage;

        // Add event listener for review button if it exists
        const reviewBtn = document.getElementById('review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                this.showReview();
            });
        }
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
        const isCorrect = userAnswer === question.correctAnswer;

        let userAnswerText = 'No answer selected';
        if (userAnswer) {
            const option = question.options.find(opt => opt.id === userAnswer);
            if (option) {
                userAnswerText = `${userAnswer}. ${option.text}`;
            }
        }

        const correctOption = question.options.find(opt => opt.id === question.correctAnswer);
        const correctAnswerText = correctOption ? `${question.correctAnswer}. ${correctOption.text}` : 'Unknown';

        // Clean up the question text to remove BODMAS references and fix underlines
        let cleanQuestion = question.question;

        // Handle diagrams in review section as well
        let questionDisplay = cleanQuestion;
        if (question.figureId) {
            questionDisplay = `<div class="question-with-diagram">
                <div class="diagram-placeholder">
                    <img src="${this.getDiagramPath(question.figureId)}" alt="Diagram for question" class="question-diagram" onerror="this.style.display='none';">
                </div>
                <div class="question-text">${cleanQuestion}</div>
            </div>`;
        }

        // Clean up explanation too
        let cleanExplanation = question.explanation || 'No explanation available.';

        reviewContainer.innerHTML = `
            <div class="review-header">
                <h3>Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</h3>
                <div class="question-status ${isCorrect ? 'correct' : userAnswer ? 'incorrect' : 'unanswered'}">
                    ${isCorrect ? '✓ Correct' : userAnswer ? '✗ Incorrect' : '? Not Answered'}
                </div>
            </div>
            <div class="review-question">
                <h4>${questionDisplay}</h4>  <!-- Using cleaned and fixed question to render HTML -->

                <div class="options-review">
                    ${question.options.map(option => {
                        const isUserSelection = userAnswer === option.id;
                        const isCorrectOption = question.correctAnswer === option.id;

                        const fixedOptionText = option.text;

                        let optionClass = 'option-review';
                        if (isCorrectOption) optionClass += ' correct-answer';
                        if (isUserSelection && !isCorrectOption) optionClass += ' user-wrong-answer';
                        if (isUserSelection && isCorrectOption) optionClass += ' user-correct-answer';

                        return `
                            <div class="${optionClass}">
                                <strong>${option.id}.</strong> ${fixedOptionText}
                                ${isUserSelection ? ' <span class="user-selection">(Your answer)</span>' : ''}
                                ${isCorrectOption ? ' <span class="correct-indicator">(Correct answer)</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="explanation">
                    <h5>Explanation:</h5>
                    <p>${cleanExplanation}</p>
                </div>
            </div>
        `;
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
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // Reset to 60 minutes
        this.questions = []; // Clear questions to force reload
        this.selectedSubject = 'Economics'; // Reset to Economics

        // Clear timer if it exists
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Update timer display
        this.updateTimerDisplay();

        // Remove warning class from timer
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.classList.remove('warning');
        }

        // Show year selection screen again
        this.showScreen('year-selection-screen');
    }

    restartExam() {
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // Reset to 60 minutes

        // Clear timer if it exists
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Update timer display
        this.updateTimerDisplay();

        // Remove warning class from timer
        document.getElementById('timer').classList.remove('warning');

        // Show year selection screen again
        this.showScreen('year-selection-screen');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new EconomicsCBTExamApp();
        window.economicsApp = app; // Make it accessible globally for debugging
    } catch (error) {
        console.error('Error initializing Economics CBT Exam App:', error);
        alert('There was an error initializing the exam application. Please refresh the page.');
    }
});

// Handle page unload to warn user
window.addEventListener('beforeunload', (e) => {
    if (window.economicsApp && window.economicsApp.currentScreen === 'exam-screen') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
        return 'Are you sure you want to leave? Your exam progress will be lost.';
    }
});