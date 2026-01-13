// Global variables
let currentYear = null;
let currentQuestions = [];
let userAnswers = {};
let startTime = null;
let timerInterval = null;
let currentQuestionIndex = 0;
let reviewMode = false;

// DOM Elements
const yearSelectionScreen = document.getElementById('year-selection-screen');
const loginScreen = document.getElementById('login-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const examScreen = document.getElementById('exam-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAvailableYears();
    setupEventListeners();
});

// Load available years from the data directory
function loadAvailableYears() {
    const yearContainer = document.getElementById('year-container');
    yearContainer.innerHTML = '';

    // Available physics years based on the JSON files
    const availableYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];

    availableYears.forEach(year => {
        const button = document.createElement('button');
        button.className = 'year-btn';
        button.textContent = year;
        button.onclick = () => selectYear(year);
        yearContainer.appendChild(button);
    });
}

// Select a year and proceed to login
function selectYear(year) {
    currentYear = year;
    showScreen(loginScreen);
}

// Set up event listeners
function setupEventListeners() {
    // Login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const examCode = document.getElementById('exam-code').value;
        
        // Simple validation
        if(studentId && examCode) {
            loadQuestions(currentYear);
        } else {
            alert('Please enter both Student ID and Exam Code');
        }
    });

    // Instructions back button
    document.getElementById('instructions-back-btn').addEventListener('click', function() {
        showScreen(yearSelectionScreen);
    });

    // Start exam button
    document.getElementById('start-exam-btn').addEventListener('click', function() {
        startExam();
    });

    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', goToPreviousQuestion);
    document.getElementById('next-btn').addEventListener('click', goToNextQuestion);
    document.getElementById('submit-btn').addEventListener('click', showSubmitConfirmation);

    // Modal buttons
    document.getElementById('confirm-submit').addEventListener('click', submitExam);
    document.getElementById('cancel-submit').addEventListener('click', hideSubmitModal);

    // Results screen buttons
    document.getElementById('review-btn').addEventListener('click', startReview);
    document.getElementById('restart-btn').addEventListener('click', restartExam);

    // Review navigation buttons
    document.getElementById('review-prev-btn').addEventListener('click', goToPreviousReview);
    document.getElementById('review-next-btn').addEventListener('click', goToNextReview);
    document.getElementById('review-finish-btn').addEventListener('click', finishReview);

    // Add physics-specific event listeners for the physics button in the main index
    const physicsBtn = document.getElementById('physics-btn');
    if(physicsBtn) {
        physicsBtn.addEventListener('click', () => {
            window.location.href = 'physics.html';
        });
    }
}

// Load questions for the selected year
async function loadQuestions(year) {
    try {
        const response = await fetch(`src/data/subjects/physics_questions_jamb_${year}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        currentQuestions = data.questions || data;
        showScreen(instructionsScreen);
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please try again.');
    }
}

// Show a specific screen and hide others
function showScreen(screenToShow) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    screenToShow.classList.add('active');
}

// Start the exam
function startExam() {
    currentQuestionIndex = 0;
    userAnswers = {};
    startTime = new Date();
    
    // Clear any existing interval
    if(timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start timer (60 minutes = 3600 seconds)
    startTimer(3600);
    
    showScreen(examScreen);
    renderQuestion(currentQuestionIndex);
    updateProgress();
    updateQuestionList();
}

// Start the exam timer
function startTimer(totalSeconds) {
    let remainingSeconds = totalSeconds;
    
    function updateTimerDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        if(remainingSeconds <= 0) {
            clearInterval(timerInterval);
            submitExam(); // Auto-submit when time runs out
        }
        
        remainingSeconds--;
    }
    
    updateTimerDisplay(); // Initial call to show time immediately
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Render a specific question
function renderQuestion(index) {
    if(index < 0 || index >= currentQuestions.length) return;
    
    const question = currentQuestions[index];
    const questionNumber = document.getElementById('q-number');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    
    questionNumber.textContent = index + 1;
    questionText.innerHTML = formatQuestionText(question.question, question.figureId, question.imagePath, question.answerOptionsImagePath);
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add options if they exist
    if(question.options && question.options.length > 0) {
        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" id="opt-${option.id}" name="answer-${index}" value="${option.id}">
                <label for="opt-${option.id}">${formatOptionText(option.text)}</label>
            `;
            
            // Check if user has previously selected an answer
            if(userAnswers[index] === option.id) {
                optionElement.querySelector('input').checked = true;
                optionElement.classList.add('selected');
            }
            
            // Add click event to handle answer selection
            optionElement.addEventListener('click', function() {
                userAnswers[index] = option.id;
                
                // Update UI to show selected option
                document.querySelectorAll(`input[name="answer-${index}"]`).forEach(input => {
                    const optionDiv = input.parentElement.parentElement;
                    optionDiv.classList.toggle('selected', input.checked);
                });
            });
            
            optionsContainer.appendChild(optionElement);
        });
    } else {
        // If no options, just show the question text
        optionsContainer.innerHTML = '<p>No options available for this question.</p>';
    }
    
    updateProgress();
    updateQuestionList();
}

// Format question text to include image if needed
function formatQuestionText(text, figureId = null, imagePath = null, answerOptionsImagePath = null) {
    let formattedText = text;
    
    // Add the main question image if available
    if(imagePath) {
        const questionNum = figureId ? extractQuestionNumber(figureId) : 'diagram';
        formattedText += `<br><img src="${imagePath}" alt="Question ${questionNum} Diagram" class="question-image" onerror="this.style.display='none';">`;
    }
    
    // Add the answer options image if available (for questions like 2017 Q16 that have both)
    if(answerOptionsImagePath) {
        const questionNum = figureId ? extractQuestionNumber(figureId) : 'diagram';
        formattedText += `<br><img src="${answerOptionsImagePath}" alt="Question ${questionNum} Answer Options Diagram" class="question-image" onerror="this.style.display='none';">`;
    }
    
    // Otherwise fallback to the old method
    else if(figureId && figureId.includes('Phy')) {
        // Extract year and question info from figureId (e.g., "Phy2010_Q3_VelocityTimeGraph")
        const match = figureId.match(/Phy(\d{4})_Q(\d+)/);
        if(match) {
            const year = match[1];
            const questionNum = match[2];
            const imgPath = `src/data/subjects/images/physics_images/${year}_Q${questionNum}.png`;
            
            formattedText += `<br><img src="${imgPath}" alt="Question ${questionNum} Diagram" class="question-image" onerror="this.style.display='none';">`;
        }
    }
    
    // Trigger MathJax rendering after a short delay
    setTimeout(() => {
        if (window.MathJax && MathJax.typeset) {
            MathJax.typeset();
        } else if (window.MathJax && MathJax.Hub) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    }, 100);
    
    return formattedText;
}

// Helper function to extract question number from figureId
function extractQuestionNumber(figureId) {
    const match = figureId.match(/Phy\d{4}_Q(\d+)/);
    return match ? match[1] : 'diagram';
}

// Format option text (to handle any special formatting)
function formatOptionText(text) {
    return text;
}

// Navigate to next question
function goToNextQuestion() {
    if(currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    }
}

// Navigate to previous question
function goToPreviousQuestion() {
    if(currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
    }
}

// Update progress display
function updateProgress() {
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('total-q').textContent = currentQuestions.length;
}

// Update question list display
function updateQuestionList() {
    const container = document.getElementById('question-list-container');
    container.innerHTML = '';
    
    currentQuestions.forEach((_, index) => {
        const button = document.createElement('button');
        button.className = 'question-list-btn';
        button.textContent = index + 1;
        
        if(index === currentQuestionIndex) {
            button.classList.add('current');
        }
        
        if(userAnswers[index] !== undefined) {
            button.classList.add('answered');
        }
        
        button.addEventListener('click', () => {
            currentQuestionIndex = index;
            renderQuestion(currentQuestionIndex);
        });
        
        container.appendChild(button);
    });
}

// Show submit confirmation modal
function showSubmitConfirmation() {
    document.getElementById('submit-modal').style.display = 'block';
}

// Hide submit confirmation modal
function hideSubmitModal() {
    document.getElementById('submit-modal').style.display = 'none';
}

// Submit the exam
function submitExam() {
    clearInterval(timerInterval);
    hideSubmitModal();
    
    // Calculate score
    let score = 0;
    currentQuestions.forEach((question, index) => {
        if(userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });
    
    // Display results
    document.getElementById('score-display').textContent = score;
    document.getElementById('total-questions').textContent = currentQuestions.length;
    document.getElementById('percentage').textContent = Math.round((score / currentQuestions.length) * 100);
    
    showScreen(resultsScreen);
}

// Start review mode
function startReview() {
    reviewMode = true;
    currentQuestionIndex = 0;
    showScreen(reviewScreen);
    renderReviewQuestion(currentQuestionIndex);
    updateReviewProgress();
}

// Render question for review
function renderReviewQuestion(index) {
    if(index < 0 || index >= currentQuestions.length) return;
    
    const question = currentQuestions[index];
    const container = document.getElementById('review-container');
    
    // Build the question display with explanations and images
    // Pass both image paths to handle questions that have both (like 2017 Q16)
    let html = `
        <div class="review-item">
            <h4>Question ${index + 1}: ${formatQuestionTextForReview(question.question, question.figureId, question.imagePath, question.answerOptionsImagePath)}</h4>
    `;
    
    // Add options
    if(question.options && question.options.length > 0) {
        html += '<div class="review-options">';
        question.options.forEach(option => {
            const isSelected = userAnswers[index] === option.id;
            const isCorrect = question.correctAnswer === option.id;
            
            let optionClass = '';
            if(isSelected && !isCorrect) optionClass = 'incorrect';
            if(!isSelected && isCorrect) optionClass = 'correct';
            if(isSelected && isCorrect) optionClass = 'selected correct';
            
            html += `
                <div class="option ${optionClass}">
                    <strong>${option.id}:</strong> ${formatOptionText(option.text)}
                    ${isSelected ? ' (Your Answer)' : ''}
                    ${isCorrect ? ' (Correct)' : ''}
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Add explanation with potential image
    if(question.explanation) {
        let explanationText = question.explanation;
        
        // Add the main question image if available for explanation
        if(question.imagePath) {
            explanationText += `<br><img src="${question.imagePath}" alt="Explanation Diagram" class="explanation-image" onerror="this.style.display='none';">`;
        }
        
        // Add the answer options image if available for explanation (for questions like 2017 Q16 that have both)
        if(question.answerOptionsImagePath) {
            explanationText += `<br><img src="${question.answerOptionsImagePath}" alt="Explanation Diagram" class="explanation-image" onerror="this.style.display='none';">`;
        }
        
        html += `<div class="explanation"><strong>Explanation:</strong> ${explanationText}</div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Trigger MathJax rendering after a short delay for explanations
    setTimeout(() => {
        if (window.MathJax && MathJax.typeset) {
            MathJax.typeset();
        } else if (window.MathJax && MathJax.Hub) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    }, 100);
    
    updateReviewProgress();
}

// Format question text for review (with image support)
function formatQuestionTextForReview(text, figureId = null, imagePath = null, answerOptionsImagePath = null) {
    let formattedText = text;
    
    // Add the main question image if available
    if(imagePath) {
        const questionNum = figureId ? extractQuestionNumber(figureId) : 'diagram';
        formattedText += `<br><img src="${imagePath}" alt="Question ${questionNum} Diagram" class="question-image" onerror="this.style.display='none';">`;
    }
    
    // Add the answer options image if available (for questions like 2017 Q16 that have both)
    if(answerOptionsImagePath) {
        const questionNum = figureId ? extractQuestionNumber(figureId) : 'diagram';
        formattedText += `<br><img src="${answerOptionsImagePath}" alt="Question ${questionNum} Answer Options Diagram" class="question-image" onerror="this.style.display='none';">`;
    }
    
    // Otherwise fallback to the old method
    else if(figureId && figureId.includes('Phy')) {
        // Extract year and question info from figureId (e.g., "Phy2010_Q3_VelocityTimeGraph")
        const match = figureId.match(/Phy(\d{4})_Q(\d+)/);
        if(match) {
            const year = match[1];
            const questionNum = match[2];
            const imgPath = `src/data/subjects/images/physics_images/${year}_Q${questionNum}.png`;
            
            formattedText += `<br><img src="${imgPath}" alt="Question ${questionNum} Diagram" class="question-image" onerror="this.style.display='none';">`;
        }
    }
    
    return formattedText;
}

// Update review progress
function updateReviewProgress() {
    document.getElementById('review-question-counter').textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
}

// Go to next question in review
function goToNextReview() {
    if(currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderReviewQuestion(currentQuestionIndex);
        updateReviewProgress();
    }
}

// Go to previous question in review
function goToPreviousReview() {
    if(currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderReviewQuestion(currentQuestionIndex);
        updateReviewProgress();
    }
}

// Finish review and go back to results
function finishReview() {
    reviewMode = false;
    showScreen(resultsScreen);
}

// Restart the exam
function restartExam() {
    showScreen(yearSelectionScreen);
}

// Helper function to get image path for a specific question
function getImagePath(year, questionId) {
    // Standardize the image naming pattern based on the files available
    // Images are named like: 2010_Q3.png, 2010_Q7.png, etc.
    return `src/data/subjects/images/physics_images/${year}_Q${questionId}.png`;
}