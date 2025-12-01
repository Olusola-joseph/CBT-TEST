// Diagram Integration for Mathematics Questions
// This file handles the integration of SVG diagrams with mathematics questions

// Import the diagram utility functions
import { getDiagramHTMLByQuestionId } from './diagram_utils.js';

// Function to integrate diagrams into mathematics questions
function integrateDiagramsIntoQuestions() {
    // Get all question containers that might need diagrams
    const questionElements = document.querySelectorAll('.question-container, .question-item, [id*="question"], .question');
    
    questionElements.forEach(element => {
        // Extract question ID from the element
        const questionId = extractQuestionId(element);
        
        if (questionId && isMathQuestion(questionId)) {
            // Check if this question needs a diagram
            if (hasDiagramForQuestion(questionId)) {
                // Get the diagram for this question
                const diagramHTML = getDiagramHTMLByQuestionId(questionId);
                
                if (diagramHTML) {
                    // Insert the diagram into the question element
                    element.insertAdjacentHTML('beforeend', diagramHTML);
                    
                    console.log(`Diagram integrated for question ${questionId}`);
                }
            }
        }
    });
}

// Function to extract question ID from an element
function extractQuestionId(element) {
    // Try to get ID from various possible attributes
    let questionId = element.id || element.dataset.questionId || element.getAttribute('data-question-id');
    
    // If no direct ID found, try to extract from class or other attributes
    if (!questionId) {
        const classList = element.className || '';
        const idMatch = classList.match(/question-(\d+)/i);
        if (idMatch) {
            questionId = parseInt(idMatch[1]);
        }
    }
    
    // If still no ID, try to parse from text content
    if (!questionId) {
        const text = element.textContent || element.innerText || '';
        const textIdMatch = text.match(/question\s*#?\s*(\d+)|id\s*:\s*(\d+)/i);
        if (textIdMatch) {
            questionId = parseInt(textIdMatch[1] || textIdMatch[2]);
        }
    }
    
    return questionId ? parseInt(questionId) : null;
}

// Function to determine if a question is a math question
function isMathQuestion(questionId) {
    // For now, we'll assume that if the question ID is within the range of 
    // known math questions (1-20), it's a math question
    // In a real application, you might have a more sophisticated way to determine this
    return questionId >= 1 && questionId <= 20;
}

// Function to check if a question has a diagram
function hasDiagramForQuestion(questionId) {
    // Use the utility function to check if a diagram exists
    return getDiagramHTMLByQuestionId(questionId) !== null;
}

// Function to update question elements when diagrams are loaded
function updateQuestionWithDiagram(questionId) {
    // Find the question element with the given ID
    let questionElement = document.getElementById(`question-${questionId}`) || 
                         document.querySelector(`[data-question-id="${questionId}"]`) ||
                         document.querySelector(`.question-${questionId}`);
    
    if (!questionElement) {
        // Try to find by class name pattern
        questionElement = document.querySelector(`[class*="question"][class*="${questionId}"]`);
    }
    
    if (questionElement) {
        // Check if diagram already exists to avoid duplicates
        if (!questionElement.querySelector('.diagram-container')) {
            const diagramHTML = getDiagramHTMLByQuestionId(questionId);
            if (diagramHTML) {
                questionElement.insertAdjacentHTML('beforeend', diagramHTML);
            }
        }
    }
}

// Function to initialize diagram integration
function initDiagramIntegration() {
    console.log('Initializing diagram integration...');
    
    // Wait for the DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            integrateDiagramsIntoQuestions();
        });
    } else {
        // DOM is already loaded
        integrateDiagramsIntoQuestions();
    }
    
    // Also integrate diagrams after a short delay to ensure all content is loaded
    setTimeout(() => {
        integrateDiagramsIntoQuestions();
    }, 100);
    
    // Listen for custom events that might indicate new questions are loaded
    document.addEventListener('questionsLoaded', () => {
        integrateDiagramsIntoQuestions();
    });
    
    // Listen for question-specific events
    document.addEventListener('questionLoaded', (event) => {
        const questionId = event.detail?.questionId;
        if (questionId) {
            updateQuestionWithDiagram(questionId);
        }
    });
}

// Export functions for use in other modules
export {
    integrateDiagramsIntoQuestions,
    updateQuestionWithDiagram,
    initDiagramIntegration
};

// Initialize diagram integration when this module is loaded
initDiagramIntegration();