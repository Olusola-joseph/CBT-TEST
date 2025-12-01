// CBT Exam Application - Robust functionality with proper error handling
// Import database functionality

class CBTExamApp {
    constructor() {
        this.currentScreen = 'login-screen';
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes in seconds
        this.timerInterval = null;
        this.questions = [];
        this.selectedSubject = '';
        this.subjects = ['English', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Government', 'Economics', 'Financial_Account'];
        
        // Initialize database
        this.initDatabase();
        
        this.initializeEventListeners();
        this.renderSubjectSelection();
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
    
    renderSubjectSelection() {
        const subjectContainer = document.getElementById('subject-container');
        if (!subjectContainer) return;
        
        subjectContainer.innerHTML = '';
        
        this.subjects.forEach(subject => {
            const subjectBtn = document.createElement('button');
            subjectBtn.className = 'subject-btn';
            subjectBtn.textContent = subject.replace('_', ' ');
            subjectBtn.addEventListener('click', () => {
                this.selectedSubject = subject;
                this.loadQuestionsForSubject(subject);
            });
            subjectContainer.appendChild(subjectBtn);
        });
    }
    
    async loadQuestionsForSubject(subject) {
        try {
            // Try to load from database first
            if (examDB && examDB.db) {
                try {
                    this.questions = await examDB.getQuestionsBySubject(subject);
                    if (this.questions.length > 0) {
                        console.log(`Loaded ${this.questions.length} questions from database for ${subject}`);
                        this.selectRandomQuestions(); // Select 10 random questions
                        this.renderQuestionList(); // Initialize the question list after loading questions
                        this.showScreen('login-screen');
                        return;
                    }
                } catch (dbError) {
                    console.error('Error loading questions from database:', dbError);
                    // Continue to fallback method
                }
            }
            
            // Fallback to subject-specific JSON files
            // Convert subject name to lowercase and replace underscores with hyphens for filename
            const fileName = `src/data/subjects/${subject.toLowerCase()}_questions.json`;
            const response = await fetch(fileName);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            }
            
            const subjectData = await response.json();
            
            if (subjectData && subjectData.questions) {
                this.questions = subjectData.questions;
                // Optionally, add questions to database for future use
                if (examDB && examDB.db) {
                    try {
                        await examDB.addQuestions(subject, subjectData.questions);
                        console.log(`Added ${subjectData.questions.length} questions to database for ${subject}`);
                    } catch (addError) {
                        console.error('Error adding questions to database:', addError);
                    }
                }
                this.selectRandomQuestions(); // Select 10 random questions
                this.renderQuestionList(); // Initialize the question list after loading questions
                this.showScreen('login-screen');
            } else {
                console.error(`Subject ${subject} not found in exams data`);
                alert(`Questions for ${subject} are not available.`);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('There was an error loading the exam questions. Please try again.');
        }
    }

    // Select 10 random questions from the available questions
    selectRandomQuestions() {
        if (this.questions.length <= 10) {
            // If there are 10 or fewer questions, use all of them
            return;
        }
        
        // Create a copy of the questions array to avoid modifying the original
        const allQuestions = [...this.questions];
        const selectedQuestions = [];
        
        // Randomly select 10 questions
        for (let i = 0; i < 10; i++) {
            if (allQuestions.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            selectedQuestions.push(allQuestions[randomIndex]);
            // Remove the selected question to avoid duplicates
            allQuestions.splice(randomIndex, 1);
        }
        
        // Assign new sequential IDs to the selected questions (1 to 10)
        this.questions = selectedQuestions.map((question, index) => {
            return {
                ...question,
                id: index + 1  // Sequential numbering from 1 to 10
            };
        });
        
        console.log(`Selected ${this.questions.length} random questions from original pool with new sequential IDs`);
    }

    // Determine if a question needs a diagram based on keywords
    questionNeedsDiagram(questionText) {
        const diagramKeywords = [
            'chord', 'circle', 'triangle', 'rectangle', 'square', 'polygon', 
            'angle', 'diagram', 'figure', 'graph', 'plot', 'coordinate',
            'geometry', 'trigonometry', 'bearing', 'distance', 'length',
            'area', 'perimeter', 'volume', 'pythagoras', 'theorem',
            'sin', 'cos', 'tan', 'sine', 'cosine', 'tangent',
            'angle of elevation', 'angle of depression',
            'construct', 'draw', 'sketch', 'shape', 'diagram',
            'right-angled', 'isosceles', 'equilateral', 'scalene',
            'parallelogram', 'trapezium', 'rhombus', 'kite',
            'sector', 'arc', 'diameter', 'radius', 'circumference',
            'tangent to', 'chord of', 'segment', 'sector',
            'coordinates of', 'line segment', 'parallel lines',
            'perpendicular', 'bisector', 'midpoint', 'intersection',
            'area of', 'perimeter of', 'volume of', 'surface area',
            'pyramid', 'prism', 'cylinder', 'cone', 'sphere'
        ];
        
        const lowerQuestion = questionText.toLowerCase();
        return diagramKeywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()));
    }

    // Fetch diagram from centralized file based on question ID
    async fetchDiagramForQuestion(questionId) {
        try {
            const response = await fetch(`/api/diagram/${questionId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const diagramData = await response.json();
            return diagramData;
        } catch (error) {
            console.error(`Error fetching diagram for question ${questionId}:`, error);
            // Return a default response if the API call fails
            return {
                success: true,
                questionId: questionId,
                diagram: null,
                hasDiagram: false
            };
        }
    }

    // Process explanation to extract only one image/diagram
    processExplanationForDiagrams(explanation) {
        // Remove duplicate diagram containers, keeping only the first one
        const diagramContainerRegex = /<div class="diagram-container">[\s\S]*?<\/svg>\s*<\/div>/g;
        const allDiagrams = explanation.match(diagramContainerRegex);
        
        if (allDiagrams && allDiagrams.length > 1) {
            // Keep only the first diagram container and remove the rest
            let firstDiagramFound = false;
            let processedExplanation = explanation.replace(diagramContainerRegex, (match) => {
                if (!firstDiagramFound) {
                    firstDiagramFound = true;
                    return match; // Keep the first diagram
                }
                // Remove subsequent diagrams by returning empty string
                return '';
            });
            
            // Clean up any extra spaces or line breaks left by removed diagrams
            processedExplanation = processedExplanation.replace(/\s*\n\s*\n\s*/g, '\n');
            return processedExplanation.trim();
        }
        
        return explanation;
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
            startExamBtn.addEventListener('click', () => {
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

    handleLogin() {
        const studentId = document.getElementById('student-id').value.trim();
        const examCode = document.getElementById('exam-code').value.trim();

        // Basic validation
        if (!studentId || !examCode) {
            alert('Please enter both Student ID and Exam Code');
            return;
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
        document.getElementById('q-number').textContent = question.id;
        // Clean up the question text to remove BODMAS references and fix underlines
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, '');
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, '');
        
        // Add diagram container if available and question needs it
        let questionHtml = cleanQuestion;
        if (question.diagram && this.questionNeedsDiagram(question.question)) {
            // Check if the question text already contains an SVG diagram
            if (!questionHtml.includes('<svg')) {
                // Decode the diagram data and add it directly to the question
                try {
                    const decodedDiagram = decodeURIComponent(question.diagram);
                    if (decodedDiagram.startsWith('<svg')) {
                        questionHtml += `<div class="diagram-container"><h5>Diagram:</h5>${decodedDiagram}</div>`;
                    } else {
                        questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                    }
                } catch (e) {
                    questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                }
            }
        }
        
        // Fix MathJax delimiters from double backslashes to single backslashes for proper rendering
        const fixedQuestionHtml = questionHtml.replace(/\\\\\\\(/g, '\\(').replace(/\\\\\\\)/g, '\\)').replace(/\\\\\\[/g, '\\[').replace(/\\\\\\]/g, '\\]');
        document.getElementById('question-text').innerHTML = fixedQuestionHtml; // Changed to innerHTML to support HTML tags
        document.getElementById('current-q').textContent = index + 1;
        document.getElementById('total-q').textContent = this.questions.length;
        
        // Trigger MathJax to re-render the mathematical expressions
        if (window.MathJax) {
            MathJax.typesetPromise([document.getElementById('question-text')]).then(function() {
                if (typeof typesetMath === 'function') {
                    typesetMath();
                }
            }).catch(function (err) {
                console.error('MathJax error:', err);
            });
        }
        
        // Render options
        this.renderOptions(question);
        
        // Update question list highlighting
        this.updateQuestionList();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Add animation class for smooth transition
        const questionContainer = document.querySelector('.question-body');
        questionContainer.classList.add('question-transition');
        setTimeout(() => {
            questionContainer.classList.remove('question-transition');
        }, 300);
    }

    renderOptions(question) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.dataset.optionId = option.id;
            
            // Check if this option was previously selected
            const isSelected = this.answers[question.id] === option.id;
            if (isSelected) {
                optionElement.classList.add('selected');
            }
            
            // Fix MathJax delimiters in option text before rendering
            const fixedOptionText = option.text.replace(/\\\\\\\(/g, '\\(').replace(/\\\\\\\)/g, '\\)').replace(/\\\\\\[/g, '\\[').replace(/\\\\\\]/g, '\\]');
            optionElement.innerHTML = `
                <input type="radio" id="opt-${question.id}-${option.id}" name="question-${question.id}" 
                    value="${option.id}" ${isSelected ? 'checked' : ''}>
                <label for="opt-${question.id}-${option.id}">${option.id}. ${fixedOptionText}</label>
            `;
            
            optionElement.addEventListener('click', () => {
                this.selectOption(question.id, option.id);
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Trigger MathJax to re-render mathematical expressions in the options
        if (window.MathJax) {
            MathJax.typesetPromise([optionsContainer]).then(function() {
                if (typeof typesetMath === 'function') {
                    typesetMath();
                }
            }).catch(function (err) {
                console.error('MathJax error in options:', err);
            });
        }
    }

    selectOption(questionId, optionId) {
        // Update answers object
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
        this.updateQuestionList();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
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

        this.questions.forEach((_, index) => {
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
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, '');
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, '');
        
        // Add diagram to the question if available
        if (question.diagram && this.questionNeedsDiagram(question.question)) {
            // Check if the question text already contains an SVG diagram
            if (!cleanQuestion.includes('<svg')) {
                // Decode the diagram data and add it directly to the question
                try {
                    const decodedDiagram = decodeURIComponent(question.diagram);
                    if (decodedDiagram.startsWith('<svg')) {
                        cleanQuestion += `<div class="diagram-container"><h5>Diagram:</h5>${decodedDiagram}</div>`;
                    } else {
                        cleanQuestion += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                    }
                } catch (e) {
                    cleanQuestion += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                }
            }
        }
        
        // Clean up explanation too
        let cleanExplanation = question.explanation || 'No explanation available.';
        cleanExplanation = cleanExplanation.replace(/BODMAS/gi, '');
        
        // Process explanation to extract only one image (prioritizing non-SVG over SVG)
        let processedExplanation = this.processExplanationForDiagrams(cleanExplanation);
        
        reviewContainer.innerHTML = `
            <div class="review-header">
                <h3>Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</h3>
                <div class="question-status ${isCorrect ? 'correct' : userAnswer ? 'incorrect' : 'unanswered'}">
                    ${isCorrect ? '✓ Correct' : userAnswer ? '✗ Incorrect' : '? Not Answered'}
                </div>
            </div>
            <div class="review-question">
                <h4>${cleanQuestion}</h4>  <!-- Using cleaned question to render HTML -->
                
                <div class="options-review">
                    ${question.options.map(option => {
                        const isUserSelection = userAnswer === option.id;
                        const isCorrectOption = question.correctAnswer === option.id;
                        
                        let optionClass = 'option-review';
                        if (isCorrectOption) optionClass += ' correct-answer';
                        if (isUserSelection && !isCorrectOption) optionClass += ' user-wrong-answer';
                        if (isUserSelection && isCorrectOption) optionClass += ' user-correct-answer';
                        
                        return `
                            <div class="${optionClass}">
                                <strong>${option.id}.</strong> ${option.text}
                                ${isUserSelection ? ' <span class="user-selection">(Your answer)</span>' : ''}
                                ${isCorrectOption ? ' <span class="correct-indicator">(Correct answer)</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="explanation">
                    <h5>Explanation:</h5>
                    <p>${processedExplanation}</p>
                </div>
            </div>
        `;

        // Trigger MathJax to re-render the mathematical expressions in the review section
        if (window.MathJax) {
            MathJax.typesetPromise([reviewContainer]).then(function() {
                if (typeof typesetMath === 'function') {
                    typesetMath();
                }
            }).catch(function (err) {
                console.error('MathJax error in review section:', err);
            });
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
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // Reset to 60 minutes
        this.questions = []; // Clear questions to force reload
        this.selectedSubject = ''; // Clear selected subject
        
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
        
        // Show subject selection screen again
        this.showScreen('subject-selection-screen');
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
        
        // Show subject selection screen again
        this.showScreen('subject-selection-screen');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new CBTExamApp();
        window.cbtApp = app; // Make it accessible globally for debugging
    } catch (error) {
        console.error('Error initializing CBT Exam App:', error);
        alert('There was an error initializing the exam application. Please refresh the page.');
    }
});

// Function to show diagram in a modal
function showDiagram(content, isImageUrl = false) {
    // Create modal container if it doesn't exist
    let modal = document.getElementById('diagram-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'diagram-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeDiagramModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Question Diagram</h3>
                    <button class="modal-close" onclick="closeDiagramModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="diagram-display"></div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeDiagramModal()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Set the diagram content
    const diagramDisplay = document.getElementById('diagram-display');
    if (isImageUrl) {
        // If it's an image URL, create an img element
        diagramDisplay.innerHTML = `<img src="${content}" alt="Question Diagram" style="max-width: 100%; max-height: 70vh; display: block; margin: 0 auto; width: auto; height: auto;">`;
    } else {
        // If it's SVG content, decode and display it
        let decodedContent = content;
        try {
            decodedContent = decodeURIComponent(content);
        } catch (e) {
            // If decoding fails, use the content as is
            decodedContent = content;
        }
        
        // Check if the content is an SVG data URL
        if (decodedContent.startsWith('<svg')) {
            diagramDisplay.innerHTML = decodedContent;
        } else if (content.startsWith('data:image/svg+xml')) {
            // Handle SVG data URLs
            let svgContent = content;
            if (content.startsWith('data:image/svg+xml;utf8,')) {
                svgContent = decodeURIComponent(content.substring(24));
            } else if (content.startsWith('data:image/svg+xml;base64,')) {
                svgContent = atob(content.substring(26));
            }
            diagramDisplay.innerHTML = svgContent;
        } else {
            // For regular image URLs
            diagramDisplay.innerHTML = `<img src="${decodedContent}" alt="Question Diagram" style="max-width: 100%; max-height: 70vh; display: block; margin: 0 auto; width: auto; height: auto;">`;
        }
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Function to close the diagram modal
function closeDiagramModal() {
    const modal = document.getElementById('diagram-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Handle page unload to warn user
window.addEventListener('beforeunload', (e) => {
    if (window.cbtApp && window.cbtApp.currentScreen === 'exam-screen') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
        return 'Are you sure you want to leave? Your exam progress will be lost.';
    }
});