// Function to process mathematics questions and extract diagram-related questions
// Then generate SVG representations and create a centralized image file

const fs = require('fs');

function identifyDiagramRelatedQuestions(questions) {
    const diagramKeywords = [
        'diagram', 'line', 'circle', 'length', 'distance', 'angle', 'triangle', 
        'rectangle', 'square', 'polygon', 'chord', 'radius', 'diameter', 'arc',
        'tangent', 'secant', 'bearing', 'coordinates', 'graph', 'plot', 
        'perpendicular', 'parallel', 'intersect', 'slope', 'gradient', 'area',
        'perimeter', 'volume', 'pythagoras', 'trigonometry', 'sine', 'cosine',
        'tangent', 'sin', 'cos', 'tan', 'chord', 'segment', 'sector', 'cone',
        'cylinder', 'sphere', 'pyramid', 'prism', 'quadrilateral', 'parallelogram',
        'trapezium', 'rhombus', 'kite', 'ellipse', 'parabola', 'hyperbola'
    ];
    
    const diagramRelatedQuestions = [];
    
    questions.forEach(question => {
        const questionText = (question.question + ' ' + (question.explanation || '')).toLowerCase();
        
        // Check if any diagram keyword is in the question
        const hasDiagramKeyword = diagramKeywords.some(keyword => 
            questionText.includes(keyword)
        );
        
        // Also check if the question already has SVG content
        const hasSVG = question.explanation && question.explanation.includes('<svg');
        
        // Also check if the question has a diagram field
        const hasDiagramField = question.diagram !== null && question.diagram !== undefined;
        
        if (hasDiagramKeyword || hasSVG || hasDiagramField) {
            diagramRelatedQuestions.push({
                id: question.id,
                question: question.question,
                explanation: question.explanation,
                diagram: question.diagram,
                hasSVG: hasSVG,
                hasDiagramField: hasDiagramField,
                keywordsFound: diagramKeywords.filter(keyword => 
                    questionText.includes(keyword)
                )
            });
        }
    });
    
    return diagramRelatedQuestions;
}

function extractSVGFromExplanation(explanation) {
    if (!explanation) return null;
    
    // Extract SVG content from explanation
    const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/g;
    const matches = explanation.match(svgRegex);
    
    return matches ? matches[0] : null;
}

function generateSVGForQuestion(question) {
    // This function generates SVG for questions that need diagrams but don't have them
    // We'll implement specific generators for different types of questions
    
    const questionText = (question.question + ' ' + (question.explanation || '')).toLowerCase();
    
    // Example: For bearing questions
    if (questionText.includes('bearing')) {
        return generateBearingDiagram(question);
    }
    
    // Example: For circle/chord questions
    if (questionText.includes('chord') || questionText.includes('radius') || questionText.includes('circle')) {
        return generateCircleDiagram(question);
    }
    
    // Example: For triangle/trigonometry questions
    if (questionText.includes('triangle') || questionText.includes('sin') || questionText.includes('cos') || questionText.includes('tan')) {
        return generateTriangleDiagram(question);
    }
    
    // Example: For geometric shapes
    if (questionText.includes('quadrilateral') || questionText.includes('rectangle') || 
        questionText.includes('square') || questionText.includes('parallelogram')) {
        return generateQuadrilateralDiagram(question);
    }
    
    // Example: For cone/volume questions
    if (questionText.includes('cone') || questionText.includes('volume')) {
        return generateConeDiagram(question);
    }
    
    return null;
}

function generateBearingDiagram(question) {
    // Generate a bearing diagram
    return `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Circle representing compass -->
      <circle cx="150" cy="150" r="120" stroke="black" stroke-width="2" fill="white"/>
      
      <!-- North, South, East, West labels -->
      <text x="150" y="40" text-anchor="middle" font-size="14" font-weight="bold">N</text>
      <text x="150" y="275" text-anchor="middle" font-size="14" font-weight="bold">S</text>
      <text x="265" y="155" text-anchor="middle" font-size="14" font-weight="bold">E</text>
      <text x="35" y="155" text-anchor="middle" font-size="14" font-weight="bold">W</text>
      
      <!-- Cardinal direction lines -->
      <line x1="150" y1="30" x2="150" y2="270" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="30" y1="150" x2="270" y2="150" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="60" y1="60" x2="240" y2="240" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="240" y1="60" x2="60" y2="240" stroke="gray" stroke-width="1" stroke-dasharray="5,5"/>
      
      <!-- Bearing line (example for 135 degrees) -->
      <line x1="150" y1="150" x2="220.71" y2="220.71" stroke="red" stroke-width="3"/>
      
      <!-- Bearing angle arc -->
      <path d="M160,140 A10 10 0 0 1 164.14,164.14" fill="none" stroke="blue" stroke-width="2"/>
      
      <!-- Bearing label -->
      <text x="186.96" y="134.69" font-size="12" fill="blue">135°</text>
    </svg>`;
}

function generateCircleDiagram(question) {
    // Generate a circle diagram (for chord/radius questions)
    return `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Circle -->
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none"/>
      
      <!-- Chord -->
      <line x1="100" y1="200" x2="200" y2="200" stroke="red" stroke-width="3"/>
      
      <!-- Perpendicular from center to chord -->
      <line x1="150" y1="150" x2="150" y2="200" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius to one end of chord -->
      <line x1="150" y1="150" x2="200" y2="200" stroke="green" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="155" y="180" font-size="12" fill="blue">8 cm</text>
      <text x="175" y="205" font-size="12" fill="red">12 cm</text>
      <text x="180" y="180" font-size="12" fill="green">r = ?</text>
      <text x="155" y="145" font-size="12" fill="black">O</text>
      <text x="195" y="205" font-size="12" fill="black">A</text>
      <text x="95" y="205" font-size="12" fill="black">B</text>
      <text x="155" y="205" font-size="12" fill="black">M</text>
    </svg>`;
}

function generateTriangleDiagram(question) {
    // Generate a right triangle diagram (for trigonometry questions)
    return `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Triangle -->
      <polygon points="100,150 200,150 150,80" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Right angle marker -->
      <line x1="145" y1="150" x2="145" y2="145" stroke="black" stroke-width="2"/>
      <line x1="145" y1="145" x2="150" y2="145" stroke="black" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="90" y="155" font-size="14">3</text>
      <text x="175" y="155" font-size="14">4</text>
      <text x="140" y="100" font-size="14">5</text>
      <text x="145" y="165" font-size="14">Adjacent</text>
      <text x="175" y="125" font-size="14">Hypotenuse</text>
      <text x="115" y="125" font-size="14">Opposite</text>
    </svg>`;
}

function generateQuadrilateralDiagram(question) {
    // Generate a quadrilateral diagram
    return `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Quadrilateral -->
      <polygon points="50,150 120,80 220,80 250,150" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Angles with ratio labels -->
      <text x="60" y="140" font-size="12">2x</text>
      <text x="110" y="90" font-size="12">3x</text>
      <text x="210" y="90" font-size="12">4x</text>
      <text x="240" y="140" font-size="12">6x</text>
    </svg>`;
}

function generateConeDiagram(question) {
    // Generate a cone diagram
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Cone -->
      <path d="M100,50 L30,200 Q100,230 170,200 Z" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Base circle (ellipse) -->
      <ellipse cx="100" cy="200" rx="70" ry="15" fill="none" stroke="black" stroke-width="2"/>
      
      <!-- Height line -->
      <line x1="100" y1="50" x2="100" y2="200" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius line -->
      <line x1="100" y1="200" x2="170" y2="200" stroke="blue" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="105" y="130" font-size="12" fill="red">h=12cm</text>
      <text x="130" y="215" font-size="12" fill="blue">r=7cm</text>
    </svg>`;
}

function createCentralizedDiagramFile(diagramQuestions) {
    // Create a centralized SVG file with all diagrams organized by question ID
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Centralized Mathematics Diagrams File -->
<!-- Generated from mathematics_questions.json -->
<svg width="800" height="${diagramQuestions.length * 350}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .question-title { font: bold 16px sans-serif; fill: #333; }
    .diagram-container { stroke: #ccc; stroke-width: 1; }
  </style>
`;

    diagramQuestions.forEach((q, index) => {
        const yPosition = index * 350 + 20;
        
        // Add question ID and title
        svgContent += `  <!-- Question ${q.id} -->\n`;
        svgContent += `  <text x="20" y="${yPosition}" class="question-title">Question ID: ${q.id}</text>\n`;
        
        // Try to get SVG from existing diagram field or explanation
        let svgDiagram = null;
        
        if (q.diagram && q.diagram.includes('data:image/svg+xml')) {
            // Decode SVG from data URI
            const svgData = q.diagram.split(',')[1];
            if (svgData) {
                try {
                    svgDiagram = decodeURIComponent(svgData);
                } catch (e) {
                    console.log(`Error decoding SVG for question ${q.id}:`, e.message);
                }
            }
        }
        
        if (!svgDiagram && q.hasSVG) {
            svgDiagram = extractSVGFromExplanation(q.explanation);
        }
        
        if (!svgDiagram) {
            svgDiagram = generateSVGForQuestion(q);
        }
        
        if (svgDiagram) {
            // Adjust the SVG to fit in the container
            const adjustedSVG = svgDiagram
                .replace(/<svg[^>]*>/, `<g transform="translate(20, ${yPosition + 20}) scale(0.8)">`)
                .replace(/<\/svg>/, '</g>');
            
            svgContent += adjustedSVG + '\n';
        } else {
            svgContent += `  <text x="20" y="${yPosition + 50}" font-size="14" fill="red">No diagram available for question ${q.id}</text>\n`;
        }
        
        svgContent += '\n';
    });
    
    svgContent += '</svg>';
    
    return svgContent;
}

function createImageMapFile(diagramQuestions) {
    // Create a JSON file that maps question IDs to their diagram content
    const imageMap = {};
    
    diagramQuestions.forEach(q => {
        let svgDiagram = null;
        
        if (q.diagram && q.diagram.includes('data:image/svg+xml')) {
            const svgData = q.diagram.split(',')[1];
            if (svgData) {
                try {
                    svgDiagram = decodeURIComponent(svgData);
                } catch (e) {
                    console.log(`Error decoding SVG for question ${q.id}:`, e.message);
                }
            }
        }
        
        if (!svgDiagram && q.hasSVG) {
            svgDiagram = extractSVGFromExplanation(q.explanation);
        }
        
        if (!svgDiagram) {
            svgDiagram = generateSVGForQuestion(q);
        }
        
        if (svgDiagram) {
            imageMap[q.id] = svgDiagram;
        }
    });
    
    return JSON.stringify(imageMap, null, 2);
}

function processMathematicsQuestions() {
    return new Promise((resolve, reject) => {
        try {
            // Read the mathematics questions file
            const questionsData = fs.readFileSync('/workspace/src/data/subjects/mathematics_questions.json', 'utf8');
            const questions = JSON.parse(questionsData);
            
            // Identify diagram-related questions
            const diagramQuestions = identifyDiagramRelatedQuestions(questions.questions);
            
            console.log(`Found ${diagramQuestions.length} diagram-related questions out of ${questions.questions.length} total questions.`);
            
            // Create centralized diagram file
            const centralizedSVG = createCentralizedDiagramFile(diagramQuestions);
            fs.writeFileSync('/workspace/math_diagrams_centralized.svg', centralizedSVG);
            console.log('Created centralized diagram file: math_diagrams_centralized.svg');
            
            // Create image map file
            const imageMap = createImageMapFile(diagramQuestions);
            fs.writeFileSync('/workspace/math_diagram_map.json', imageMap);
            console.log('Created diagram map file: math_diagram_map.json');
            
            // Update the original questions file to reference the centralized diagrams
            updateQuestionsWithDiagramRefs(questions.questions, diagramQuestions);
            
            resolve({
                diagramQuestions,
                totalQuestions: questions.questions.length,
                diagramCount: diagramQuestions.length
            });
            
        } catch (error) {
            console.error('Error processing mathematics questions:', error);
            reject(error);
        }
    });
}

function updateQuestionsWithDiagramRefs(questions, diagramQuestions) {
    // Update the original questions to reference the centralized diagram system
    const updatedQuestions = questions.map(q => {
        const diagramQuestion = diagramQuestions.find(dq => dq.id === q.id);
        
        if (diagramQuestion) {
            // Add a reference to the centralized diagram system
            return {
                ...q,
                diagram_ref: `math_diagram_map.json#question_${q.id}`
            };
        }
        
        return q;
    });
    
    // Write the updated questions back to the file
    const updatedData = {
        questions: updatedQuestions
    };
    
    fs.writeFileSync('/workspace/src/data/subjects/mathematics_questions_updated.json', JSON.stringify(updatedData, null, 2));
    console.log('Updated questions file with diagram references');
}

// Export the main function
module.exports = {
    processMathematicsQuestions,
    identifyDiagramRelatedQuestions,
    generateSVGForQuestion,
    extractSVGFromExplanation
};

// If this file is run directly, execute the processing
if (require.main === module) {
    processMathematicsQuestions()
        .then(result => {
            console.log('Processing completed successfully!');
            console.log(`Processed ${result.diagramCount} diagram-related questions out of ${result.totalQuestions} total questions.`);
        })
        .catch(error => {
            console.error('Error in processing:', error);
        });
}