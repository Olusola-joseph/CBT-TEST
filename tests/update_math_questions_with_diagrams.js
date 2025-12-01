const fs = require('fs');
const {
    generateBearingDiagram,
    generateCircleChordDiagram,
    generateTriangleDiagram,
    generateQuadrilateralDiagram,
    generateConeDiagram
} = require('./generate_diagrams');

// Read the current mathematics questions file
const questionsData = JSON.parse(fs.readFileSync('/workspace/src/data/subjects/mathematics_questions_jamb_2010.json', 'utf8'));

// Function to add diagrams to relevant questions
function addDiagramsToQuestions(questions) {
    return questions.map(question => {
        // Check for bearing questions
        if (question.question.toLowerCase().includes('bearing')) {
            const bearingMatch = question.question.match(/bearing of ([0-9]+)°/i);
            if (bearingMatch) {
                const bearing = parseInt(bearingMatch[1]);
                return {
                    ...question,
                    diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateBearingDiagram(bearing))}`,
                    explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateBearingDiagram(bearing)}</div>`
                };
            } else {
                // For bearing questions without specific bearing value
                return {
                    ...question,
                    diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateBearingDiagram(135))}`, // Default bearing
                    explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateBearingDiagram(135)}</div>`
                };
            }
        }
        // Check for circle/chord questions
        else if (question.question.toLowerCase().includes('chord') && question.question.toLowerCase().includes('centre')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateCircleChordDiagram())}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateCircleChordDiagram()}</div>`
            };
        }
        // Check for trigonometry questions
        else if (question.question.toLowerCase().includes('sin') || 
                 question.question.toLowerCase().includes('cos') || 
                 question.question.toLowerCase().includes('tan') ||
                 question.question.toLowerCase().includes('triangle')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateTriangleDiagram())}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateTriangleDiagram()}</div>`
            };
        }
        // Check for quadrilateral angle questions
        else if (question.question.toLowerCase().includes('quadrilateral') || 
                 question.question.toLowerCase().includes('ratio') && question.question.toLowerCase().includes('angle')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateQuadrilateralDiagram())}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateQuadrilateralDiagram()}</div>`
            };
        }
        // Check for cone volume questions
        else if (question.question.toLowerCase().includes('cone') && 
                 (question.question.toLowerCase().includes('volume') || 
                  question.question.toLowerCase().includes('radius') || 
                  question.question.toLowerCase().includes('height'))) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateConeDiagram())}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateConeDiagram()}</div>`
            };
        }
        // For other geometric questions, we can add a general diagram field placeholder
        else {
            // Return the question as is, without diagram
            return question;
        }
    });
}

// Update the questions with diagrams where appropriate
const updatedQuestions = addDiagramsToQuestions(questionsData.questions);

// Create the updated data object
const updatedData = {
    questions: updatedQuestions
};

// Write the updated questions back to the file
fs.writeFileSync('/workspace/src/data/subjects/mathematics_questions_jamb_2010.json', JSON.stringify(updatedData, null, 2));

console.log('Mathematics questions updated with diagrams where appropriate.');
console.log(`Updated ${updatedQuestions.filter(q => q.diagram).length} questions with diagrams out of ${updatedQuestions.length} total questions.`);