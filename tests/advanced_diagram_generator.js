const fs = require('fs');

// Function to generate physics diagrams
function generatePhysicsDiagram(type) {
    switch(type) {
        case 'force':
            return `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Block -->
              <rect x="100" y="100" width="100" height="50" fill="none" stroke="black" stroke-width="2"/>
              <!-- Force arrow -->
              <line x1="200" y1="125" x2="250" y2="125" stroke="red" stroke-width="3" marker-end="url(#arrowhead)"/>
              <!-- Arrowhead definition -->
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="red" />
                </marker>
              </defs>
              <!-- Label -->
              <text x="210" y="115" font-size="14" fill="red">F</text>
            </svg>`;
        case 'circuit':
            return `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Battery -->
              <line x1="50" y1="100" x2="80" y2="100" stroke="black" stroke-width="2"/>
              <line x1="65" y1="90" x2="65" y2="110" stroke="black" stroke-width="4"/>
              <line x1="75" y1="95" x2="75" y2="105" stroke="black" stroke-width="2"/>
              
              <!-- Wire -->
              <line x1="80" y1="100" x2="150" y2="100" stroke="black" stroke-width="2"/>
              
              <!-- Resistor -->
              <line x1="150" y1="100" x2="170" y2="80" stroke="black" stroke-width="2"/>
              <line x1="170" y1="80" x2="190" y2="120" stroke="black" stroke-width="2"/>
              <line x1="190" y1="120" x2="210" y2="80" stroke="black" stroke-width="2"/>
              <line x1="210" y1="80" x2="230" y2="120" stroke="black" stroke-width="2"/>
              <line x1="230" y1="120" x2="250" y2="100" stroke="black" stroke-width="2"/>
              
              <!-- Ammeter -->
              <circle cx="260" cy="100" r="10" stroke="black" stroke-width="2" fill="none"/>
              <text x="255" y="105" font-size="12">A</text>
            </svg>`;
        case 'wave':
            return `<svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
              <!-- Sine wave -->
              <path d="M 0,50 Q 50,0 100,50 T 200,50 T 300,50" fill="none" stroke="blue" stroke-width="2"/>
              <!-- Amplitude line -->
              <line x1="50" y1="50" x2="50" y2="0" stroke="red" stroke-width="1" stroke-dasharray="5,5"/>
              <text x="55" y="25" font-size="12" fill="red">Amplitude</text>
              <!-- Wavelength line -->
              <line x1="0" y1="70" x2="100" y2="70" stroke="green" stroke-width="2"/>
              <text x="30" y="85" font-size="12" fill="green">Wavelength</text>
            </svg>`;
        default:
            return `<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="50" width="100" height="50" fill="none" stroke="black" stroke-width="2"/>
              <text x="60" y="80" font-size="14">Physics Diagram</text>
            </svg>`;
    }
}

// Function to generate chemistry diagrams
function generateChemistryDiagram(type) {
    switch(type) {
        case 'atomic_structure':
            return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Nucleus -->
              <circle cx="100" cy="100" r="30" fill="#3498db" stroke="black" stroke-width="2"/>
              <text x="90" y="105" font-size="14" fill="white">Nucleus</text>
              
              <!-- Electron orbit -->
              <circle cx="100" cy="100" r="70" fill="none" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
              
              <!-- Electrons -->
              <circle cx="170" cy="100" r="5" fill="red"/>
              <circle cx="30" cy="100" r="5" fill="red"/>
              <circle cx="100" cy="30" r="5" fill="red"/>
              <circle cx="100" cy="170" r="5" fill="red"/>
              
              <text x="175" y="95" font-size="12">e⁻</text>
              <text x="20" y="95" font-size="12">e⁻</text>
            </svg>`;
        case 'bonding':
            return `<svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
              <!-- Atoms -->
              <circle cx="80" cy="75" r="25" fill="#e74c3c" stroke="black" stroke-width="2"/>
              <circle cx="220" cy="75" r="25" fill="#3498db" stroke="black" stroke-width="2"/>
              
              <!-- Shared electrons -->
              <circle cx="150" cy="60" r="5" fill="black"/>
              <circle cx="150" cy="90" r="5" fill="black"/>
              
              <!-- Labels -->
              <text x="70" y="80" font-size="14" fill="white">A</text>
              <text x="210" y="80" font-size="14" fill="white">B</text>
              
              <!-- Bond line -->
              <line x1="105" y1="75" x2="195" y2="75" stroke="black" stroke-width="2"/>
            </svg>`;
        case 'molecular':
            return `<svg width="250" height="150" viewBox="0 0 250 150" xmlns="http://www.w3.org/2000/svg">
              <!-- Water molecule -->
              <circle cx="80" cy="80" r="15" fill="#3498db" stroke="black" stroke-width="2"/>
              <circle cx="130" cy="50" r="10" fill="#e74c3c" stroke="black" stroke-width="2"/>
              <circle cx="130" cy="110" r="10" fill="#e74c3c" stroke="black" stroke-width="2"/>
              
              <!-- Bonds -->
              <line x1="92" y1="72" x2="120" y2="58" stroke="black" stroke-width="2"/>
              <line x1="92" y1="88" x2="120" y2="102" stroke="black" stroke-width="2"/>
              
              <!-- Labels -->
              <text x="75" y="85" font-size="12" fill="white">O</text>
              <text x="125" y="55" font-size="10" fill="white">H</text>
              <text x="125" y="115" font-size="10" fill="white">H</text>
            </svg>`;
        default:
            return `<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="50" width="100" height="50" fill="none" stroke="black" stroke-width="2"/>
              <text x="60" y="80" font-size="14">Chemistry Diagram</text>
            </svg>`;
    }
}

// Function to add diagrams to mathematics questions
function addDiagramsToMathematics(questions) {
    const { 
        generateBearingDiagram,
        generateCircleChordDiagram, 
        generateTriangleDiagram, 
        generateQuadrilateralDiagram, 
        generateConeDiagram 
    } = require('./generate_diagrams');
    
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

// Function to add diagrams to physics questions
function addDiagramsToPhysics(questions) {
    return questions.map(question => {
        // Check for force/Newton's law questions
        if (question.question.toLowerCase().includes('force') || 
            question.question.toLowerCase().includes('newton') ||
            question.question.toLowerCase().includes('friction') ||
            question.question.toLowerCase().includes('acceleration')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generatePhysicsDiagram('force'))}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generatePhysicsDiagram('force')}</div>`
            };
        }
        // Check for circuit/electricity questions
        else if (question.question.toLowerCase().includes('circuit') || 
                 question.question.toLowerCase().includes('current') ||
                 question.question.toLowerCase().includes('resistance') ||
                 question.question.toLowerCase().includes('voltage') ||
                 question.question.toLowerCase().includes('ammeter') ||
                 question.question.toLowerCase().includes('voltmeter')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generatePhysicsDiagram('circuit'))}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generatePhysicsDiagram('circuit')}</div>`
            };
        }
        // Check for wave questions
        else if (question.question.toLowerCase().includes('wave') || 
                 question.question.toLowerCase().includes('frequency') ||
                 question.question.toLowerCase().includes('amplitude') ||
                 question.question.toLowerCase().includes('wavelength')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generatePhysicsDiagram('wave'))}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generatePhysicsDiagram('wave')}</div>`
            };
        }
        // For other physics questions, return as is
        else {
            return question;
        }
    });
}

// Function to add diagrams to chemistry questions
function addDiagramsToChemistry(questions) {
    return questions.map(question => {
        // Check for atomic structure questions
        if (question.question.toLowerCase().includes('atom') || 
            question.question.toLowerCase().includes('electron') ||
            question.question.toLowerCase().includes('proton') ||
            question.question.toLowerCase().includes('neutron') ||
            question.question.toLowerCase().includes('nucleus')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateChemistryDiagram('atomic_structure'))}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateChemistryDiagram('atomic_structure')}</div>`
            };
        }
        // Check for bonding questions
        else if (question.question.toLowerCase().includes('bond') || 
                 question.question.toLowerCase().includes('ionic') ||
                 question.question.toLowerCase().includes('covalent') ||
                 question.question.toLowerCase().includes('molecule')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateChemistryDiagram('bonding'))}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateChemistryDiagram('bonding')}</div>`
            };
        }
        // Check for molecular structure questions
        else if (question.question.toLowerCase().includes('h2o') || 
                 question.question.toLowerCase().includes('water molecule') ||
                 question.question.toLowerCase().includes('molecular structure')) {
            return {
                ...question,
                diagram: `data:image/svg+xml;utf8,${encodeURIComponent(generateChemistryDiagram('molecular'))}`,
                explanation: question.explanation + ` <div class="diagram-container"><h5>Diagram:</h5>${generateChemistryDiagram('molecular')}</div>`
            };
        }
        // For other chemistry questions, return as is
        else {
            return question;
        }
    });
}

// Function to add diagrams to other subjects (placeholder for now)
function addDiagramsToOtherSubjects(questions, subject) {
    // For now, we'll just return the questions as they are for non-math/physics/chemistry subjects
    // In the future, we could add subject-specific diagrams
    return questions;
}

// List of all subjects to process
const subjects = [
    'mathematics',
    'english',
    'biology',
    'chemistry',
    'physics',
    'government',
    'economics',
    'financial_account'
];

// Process each subject
subjects.forEach(subject => {
    const fileName = `${subject}_questions.json`;
    
    try {
        console.log(`Processing ${subject} questions...`);
        
        // Read the current questions file
        const questionsData = JSON.parse(fs.readFileSync(`/workspace/${fileName}`, 'utf8'));
        
        let updatedQuestions;
        
        // Apply appropriate diagram addition based on subject
        if (subject === 'mathematics') {
            updatedQuestions = addDiagramsToMathematics(questionsData.questions);
        } else if (subject === 'physics') {
            updatedQuestions = addDiagramsToPhysics(questionsData.questions);
        } else if (subject === 'chemistry') {
            updatedQuestions = addDiagramsToChemistry(questionsData.questions);
        } else {
            updatedQuestions = addDiagramsToOtherSubjects(questionsData.questions, subject);
        }
        
        // Create the updated data object
        const updatedData = {
            questions: updatedQuestions
        };
        
        // Write the updated questions back to the file
        fs.writeFileSync(`/workspace/${fileName}`, JSON.stringify(updatedData, null, 2));
        
        console.log(`Updated ${updatedQuestions.filter(q => q.diagram).length} questions with diagrams out of ${updatedQuestions.length} total questions in ${subject}`);
        
    } catch (error) {
        console.error(`Error processing ${fileName}:`, error.message);
    }
});

console.log('All subjects processed with diagrams where applicable.');