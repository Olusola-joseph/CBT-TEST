// English Language CBT Exam Application - Robust functionality with proper error handling
// Import database functionality

class EnglishCBTExamApp {
    constructor() {
        this.currentScreen = 'year-selection-screen';
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes in seconds
        this.timerInterval = null;
        this.questions = [];
        this.selectedSubject = 'English';
        this.selectedYear = 'jamb_2010'; // Default year
        this.years = ['jamb_2010', 'jamb_2011', 'jamb_2012', 'jamb_2013', 'jamb_2014', 'jamb_2015', 'jamb_2016', 'jamb_2017', 'jamb_2018', 'jamb_2019']; // Available years
        
        // Initialize database
        this.initDatabase();
        
        this.initializeEventListeners();
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
    
    async loadQuestionsForSubject(subject) {
        try {
            // Try to load from database first
            if (examDB && examDB.db) {
                try {
                    this.questions = await examDB.getQuestionsBySubject(subject);
                    
                    // For English from database, we need to load the passages and instructions separately
                    // Get the passages and instructions from the database
                    const subjectContent = await examDB.getAllSubjectContent(subject);
                    
                    // Check if we have both questions and content to reorganize
                    if (this.questions.length > 0 && (subjectContent.passages.length > 0 || subjectContent.instructions.length > 0)) {
                        console.log(`Loaded ${this.questions.length} questions from database for ${subject}`);
                        
                        // Reorganize the questions using the passages and instructions from the database
                        const subjectData = {
                            questions: this.questions,
                            passages: subjectContent.passages,
                            instructions: subjectContent.instructions
                        };
                        
                        this.questions = this.reorganizeEnglishQuestions(subjectData);
                        console.log(`Reorganized ${this.questions.length} English questions (with passages and instructions) from database`);
                        
                        this.renderQuestionList(); // Initialize the question list after loading questions
                        return;
                    }
                } catch (dbError) {
                    console.error('Error loading questions from database:', dbError);
                    // Continue to fallback method
                }
            }
            
            // Fallback to subject-specific JSON files with year selection
            // Convert subject name to lowercase and replace underscores with hyphens for filename
            // Use the selected year for the filename
            const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_${this.selectedYear}.json`;
            const response = await fetch(fileName);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            }
            
            const subjectData = await response.json();
            
            if (subjectData) {
                // For English subject, we need to handle passages, instructions, and questions differently
                if (subjectData.passages || subjectData.instructions) {
                    this.questions = this.reorganizeEnglishQuestions(subjectData);
                } else if (subjectData.questions) {
                    this.questions = subjectData.questions;
                }
                
                // Optionally, add questions to database for future use
                if (examDB && examDB.db) {
                    try {
                        await examDB.addQuestions(subject, subjectData.questions || []);
                        console.log(`Added ${subjectData.questions ? subjectData.questions.length : 0} questions to database for ${subject}`);
                        
                        // Add passages and instructions to database if they exist
                        if (subjectData.passages && subjectData.passages.length > 0) {
                            await examDB.addSubjectContent(subject, 'passage', subjectData.passages);
                            console.log(`Added ${subjectData.passages.length} passages to database for ${subject}`);
                        }
                        
                        if (subjectData.instructions && subjectData.instructions.length > 0) {
                            await examDB.addSubjectContent(subject, 'instruction', subjectData.instructions);
                            console.log(`Added ${subjectData.instructions.length} instructions to database for ${subject}`);
                        }
                    } catch (addError) {
                        console.error('Error adding questions to database:', addError);
                    }
                }
                
                // For English, we already have the reorganized questions with proper IDs
                console.log(`Using all ${this.questions.length} reorganized English questions (passages, instructions, and questions)`);
                
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

    // Reorganize English questions to follow the sequence: passage -> questions, instruction -> questions
    reorganizeEnglishQuestions(subjectData) {
        let reorganizedQuestions = [];
        let currentId = 1;

        // Process questions in the order they appear in the original questions array
        // For each question, check if it belongs to a passage or instruction and handle accordingly
        if (subjectData.questions) {
            // Create maps of passage and instruction questions to process them in the intended order
            const passageQuestionMap = {};
            const instructionQuestionMap = {};
            const standaloneQuestions = [];

            // Group questions by their associated passage or instruction
            subjectData.questions.forEach(question => {
                if (question.passageId) {
                    if (!passageQuestionMap[question.passageId]) {
                        passageQuestionMap[question.passageId] = [];
                    }
                    passageQuestionMap[question.passageId].push(question);
                } else if (question.instructionId) {
                    if (!instructionQuestionMap[question.instructionId]) {
                        instructionQuestionMap[question.instructionId] = [];
                    }
                    instructionQuestionMap[question.instructionId].push(question);
                } else {
                    standaloneQuestions.push(question);
                }
            });

            // Process passages in order (I, II, III, IV, etc.)
            if (subjectData.passages && subjectData.passages.length > 0) {
                // Sort passages to ensure correct order
                const sortedPassages = [...subjectData.passages].sort((a, b) => {
                    // Sort by Roman numerals: I, II, III, IV, etc.
                    const romanToNum = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10 };
                    const numA = romanToNum[a.id.replace('Passage ', '')];
                    const numB = romanToNum[b.id.replace('Passage ', '')];
                    return (numA || 0) - (numB || 0);
                });

                sortedPassages.forEach(passage => {
                    if (passageQuestionMap[passage.id] && passageQuestionMap[passage.id].length > 0) {
                        // Add the passage as a content page
                        const passageContent = {
                            id: currentId++,
                            type: 'passage',
                            title: passage.id,
                            text: passage.text,
                            question: `<div class="english-passage"><div class="passage-content">${passage.text}</div><div class="passage-note">Please read the above passage carefully before answering the questions that follow.</div></div>`,
                            options: [{ id: "CONTINUE", text: "Continue to questions" }],
                            correctAnswer: "CONTINUE",
                            explanation: "This is a passage. Please read carefully before answering the questions that follow."
                        };
                        reorganizedQuestions.push(passageContent);

                        // Add questions related to this passage
                        passageQuestionMap[passage.id].forEach(question => {
                            // Update the question ID to the sequential ID
                            const modifiedQuestion = {
                                ...question,
                                id: currentId++
                            };
                            reorganizedQuestions.push(modifiedQuestion);
                        });
                    }
                });
            }

            // Process instructions in order (1, 2, 3, etc.)
            if (subjectData.instructions && subjectData.instructions.length > 0) {
                // Sort instructions to ensure correct order
                const sortedInstructions = [...subjectData.instructions].sort((a, b) => {
                    const numA = parseInt(a.id.replace('Instruction ', ''));
                    const numB = parseInt(b.id.replace('Instruction ', ''));
                    return numA - numB;
                });

                sortedInstructions.forEach(instruction => {
                    if (instructionQuestionMap[instruction.id] && instructionQuestionMap[instruction.id].length > 0) {
                        // Add the instruction as a content page
                        const instructionContent = {
                            id: currentId++,
                            type: 'instruction',
                            title: instruction.id,
                            text: instruction.text,
                            question: `<div class="english-instruction"><p>${instruction.text}</p></div>`,
                            options: [{ id: "CONTINUE", text: "Continue to questions" }],
                            correctAnswer: "CONTINUE",
                            explanation: "Please read the instructions carefully before attempting the questions that follow."
                        };
                        reorganizedQuestions.push(instructionContent);
                        
                        // Add questions related to this instruction
                        instructionQuestionMap[instruction.id].forEach(question => {
                            // Update the question ID to the sequential ID and preserve passageId if it exists
                            const modifiedQuestion = {
                                ...question,
                                id: currentId++
                            };
                            reorganizedQuestions.push(modifiedQuestion);
                        });
                    }
                });
            }

            // Add any remaining standalone questions
            standaloneQuestions.forEach(question => {
                const modifiedQuestion = {
                    ...question,
                    id: currentId++
                };
                reorganizedQuestions.push(modifiedQuestion);
            });
        }

        console.log(`Reorganized English questions: ${reorganizedQuestions.length} total items`);
        console.log(`Original question count: ${subjectData.questions ? subjectData.questions.length : 0}`);
        console.log(`Passages count: ${subjectData.passages ? subjectData.passages.length : 0}`);
        console.log(`Instructions count: ${subjectData.instructions ? subjectData.instructions.length : 0}`);
        return reorganizedQuestions;
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

        // Calculate actual question number (excluding passages and instructions)
        const actualQuestionNumber = this.getActualQuestionNumber(index);
        const actualTotalQuestions = this.getActualQuestionCount();

        // Update question display - using innerHTML to support HTML tags like <u>
        // For passages and instructions, show more descriptive labels
        if (question.type === 'passage') {
            document.getElementById('q-number').textContent = question.title; // "Passage I", "Passage II", etc.
        } else if (question.type === 'instruction') {
            document.getElementById('q-number').textContent = question.title; // "Instruction 1", "Instruction 2", etc.
        } else {
            document.getElementById("q-number").textContent = `Question ${actualQuestionNumber}`;
        }
        // For passages and instructions, use the pre-formatted question HTML which already contains the content
        if (question.type === "passage" || question.type === "instruction") {
            // Use the question field directly as it contains formatted HTML for passages and instructions
            document.getElementById("question-text").innerHTML = question.question;
        } else {
            // For regular questions, just display the question text
            document.getElementById("question-text").innerHTML = question.question;
        }
        document.getElementById("current-q").textContent = actualQuestionNumber;
        document.getElementById("total-q").textContent = actualTotalQuestions;
        
        // Update question container class based on content type for better styling
        const questionContainer = document.querySelector('.question-container');
        if (questionContainer) {
            // Remove previous content type classes
            questionContainer.classList.remove('passage-content-page', 'instruction-content-page');
            
            // Add appropriate class based on question type
            if (question.type === 'passage') {
                questionContainer.classList.add('passage-content-page');
            } else if (question.type === 'instruction') {
                questionContainer.classList.add('instruction-content-page');
            }
        }
        
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
    }

    // Helper method to get the actual question number (excluding passages and instructions)
    getActualQuestionNumber(index) {
        let actualQuestionNumber = 0;
        for (let i = 0; i <= index; i++) {
            if (this.questions[i].type !== 'passage' && this.questions[i].type !== 'instruction') {
                actualQuestionNumber++;
            }
        }
        return actualQuestionNumber;
    }

    // Helper method to get the total count of actual questions (excluding passages and instructions)
    getActualQuestionCount() {
        let count = 0;
        for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i].type !== 'passage' && this.questions[i].type !== 'instruction') {
                count++;
            }
        }
        return count;
    }

    renderOptions(question) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        // For content pages (passages and instructions), render a prominent continue button
        if (question.type === 'passage' || question.type === 'instruction') {
            question.options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option-item';
                optionElement.dataset.optionId = option.id;

                // Check if this option was previously selected
                const isSelected = this.answers[question.id] === option.id;
                if (isSelected) {
                    optionElement.classList.add('selected');
                }

                // For content pages, create a button-style element instead of radio button
                optionElement.innerHTML = `
                    <button type="button" class="continue-btn" onclick="englishApp.selectOption(${question.id}, '${option.id}')">
                        ${option.text}
                    </button>
                `;

                optionsContainer.appendChild(optionElement);
            });
        } else {
            // For regular questions, render standard radio button options
            question.options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option-item';
                optionElement.dataset.optionId = option.id;

                // Check if this option was previously selected
                const isSelected = this.answers[question.id] === option.id;
                if (isSelected) {
                    optionElement.classList.add('selected');
                }

                optionElement.innerHTML = `
                    <input type="radio" id="opt-${question.id}-${option.id}" name="question-${question.id}"
                        value="${option.id}" ${isSelected ? 'checked' : ''}>
                    <label for="opt-${question.id}-${option.id}">${option.id}. ${option.text}</label>
                `;

                optionElement.addEventListener('click', () => {
                    this.selectOption(question.id, option.id);
                });

                optionsContainer.appendChild(optionElement);
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

        // Auto-advance to next question if this is a content page (passage/instruction) with CONTINUE option
        const currentQuestion = this.questions[this.currentQuestionIndex];
        if (currentQuestion && (currentQuestion.type === 'passage' || currentQuestion.type === 'instruction') && optionId === 'CONTINUE') {
            // Show a brief visual feedback that we're moving to questions
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) {
                nextBtn.textContent = 'Loading Questions...';
                nextBtn.disabled = true;
            }

            setTimeout(() => {
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.nextQuestion();
                }
                // Restore button text after navigation
                if (nextBtn) {
                    nextBtn.textContent = 'Next';
                    nextBtn.disabled = false;
                }
                // Update navigation buttons state after moving to the next question
                this.updateNavigationButtons();
                // Update question list to highlight current question
                this.updateQuestionList();
                // Update progress indicators
                document.getElementById('current-q').textContent = this.currentQuestionIndex + 1;
                document.getElementById('total-q').textContent = this.questions.length;
            }, 800); // Slightly longer delay to make transition clear
        }
    }

    previousQuestion() {
        // Skip backwards over passages and instructions
        let newIndex = this.currentQuestionIndex - 1;
        while (newIndex >= 0 && (this.questions[newIndex].type === 'passage' || this.questions[newIndex].type === 'instruction')) {
            newIndex--;
        }
        
        if (newIndex >= 0) {
            this.loadQuestion(newIndex);
        }
    }

    nextQuestion() {
        // Skip forwards over passages and instructions
        let newIndex = this.currentQuestionIndex + 1;
        while (newIndex < this.questions.length && (this.questions[newIndex].type === 'passage' || this.questions[newIndex].type === 'instruction')) {
            newIndex++;
        }
        
        if (newIndex < this.questions.length) {
            this.loadQuestion(newIndex);
        }
    }

    updateNavigationButtons() {
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (nextBtn) {
            // Find the next actual question (skip passages and instructions)
            let nextQuestionIndex = this.currentQuestionIndex + 1;
            while (nextQuestionIndex < this.questions.length && (this.questions[nextQuestionIndex].type === 'passage' || this.questions[nextQuestionIndex].type === 'instruction')) {
                nextQuestionIndex++;
            }
            
            // Disable next button if on the last question
            nextBtn.disabled = nextQuestionIndex >= this.questions.length;
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

            // Add specific class based on question type
            if (question.type === 'instruction') {
                button.classList.add('instruction');
            } else if (question.type === 'passage') {
                button.classList.add('passage');
            }

            // Display actual question number if it's a real question
            if (question.type !== 'passage' && question.type !== 'instruction') {
                const actualNumber = this.getActualQuestionNumber(index);
                button.textContent = actualNumber;
            } else {
                // For passages and instructions, show a visual indicator
                if (question.type === 'passage') {
                    button.textContent = 'P';
                } else if (question.type === 'instruction') {
                    button.textContent = 'I';
                }
            }
            
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
            // Preserve type classes (instruction, passage) when updating
            const question = this.questions[index];
            if (question && question.type) {
                if (question.type === 'instruction' && !button.classList.contains('instruction')) {
                    button.classList.add('instruction');
                } else if (question.type === 'passage' && !button.classList.contains('passage')) {
                    button.classList.add('passage');
                }
            }

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
        const totalQuestions = this.getActualQuestionCount();
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

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
                <h4>${cleanQuestion}</h4>  <!-- Using cleaned and fixed question to render HTML -->

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
        this.selectedSubject = 'English'; // Reset to English

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
        const app = new EnglishCBTExamApp();
        window.englishApp = app; // Make it accessible globally for debugging
    } catch (error) {
        console.error('Error initializing English CBT Exam App:', error);
        alert('There was an error initializing the exam application. Please refresh the page.');
    }
});

// Handle page unload to warn user
window.addEventListener('beforeunload', (e) => {
    if (window.englishApp && window.englishApp.currentScreen === 'exam-screen') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
        return 'Are you sure you want to leave? Your exam progress will be lost.';
    }
});