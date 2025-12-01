// Comprehensive Mathematics Diagram Processor
// Identifies questions related to diagrams, lines, circles, length, distance, etc.
// Generates SVG representations and manages them in a centralized file
// Provides functions to retrieve diagrams by question ID

const fs = require('fs');
const path = require('path');

class MathDiagramProcessor {
    constructor(questionsFilePath = '/workspace/src/data/subjects/mathematics_questions_jamb_2010.json') {
        this.questionsFilePath = questionsFilePath;
        this.diagramMapPath = '/workspace/math_diagram_map.json';
        this.centralizedSVGPath = '/workspace/math_diagrams_centralized.svg';
        this.questions = [];
        this.diagramMap = {};
        this.loadQuestions();
    }

    // Load questions from the mathematics file
    loadQuestions() {
        try {
            const questionsData = fs.readFileSync(this.questionsFilePath, 'utf8');
            const parsedData = JSON.parse(questionsData);
            this.questions = parsedData.questions || [];
            console.log(`Loaded ${this.questions.length} questions from ${this.questionsFilePath}`);
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = [];
        }
    }

    // Identify geometric terms that indicate need for diagrams
    identifyDiagramRelatedQuestions() {
        const geometricKeywords = [
            // Basic geometric terms
            'circle', 'line', 'length', 'distance', 'angle', 'triangle', 'rectangle', 
            'square', 'polygon', 'chord', 'radius', 'diameter', 'arc', 'tangent',
            'secant', 'bearing', 'coordinates', 'graph', 'plot', 'perpendicular', 
            'parallel', 'intersect', 'slope', 'gradient', 'area', 'perimeter', 
            'volume', 'pythagoras', 'trigonometry', 'sine', 'cosine', 'tangent', 
            'sin', 'cos', 'tan', 'chord', 'segment', 'sector', 'cone', 'cylinder', 
            'sphere', 'pyramid', 'prism', 'quadrilateral', 'parallelogram', 
            'trapezium', 'rhombus', 'kite', 'ellipse', 'parabola', 'hyperbola',
            
            // More specific geometric terms
            'diagram', 'figure', 'construct', 'draw', 'sketch', 'shape', 
            'right-angled', 'isosceles', 'equilateral', 'scalene', 'circumference',
            'angle of elevation', 'angle of depression', 'line segment', 
            'parallel lines', 'bisector', 'midpoint', 'intersection', 
            'area of', 'perimeter of', 'volume of', 'surface area',
            
            // Coordinate geometry
            'coordinate geometry', 'cartesian', 'x-axis', 'y-axis', 'origin',
            'quadrant', 'ordinate', 'abscissa', 'distance formula', 'midpoint formula',
            
            // Advanced geometric concepts
            'similarity', 'congruence', 'transformation', 'reflection', 'rotation',
            'translation', 'enlargement', 'symmetry', 'congruent', 'similar',
            
            // Mensuration terms
            'circumference', 'arc length', 'sector area', 'segment area',
            'surface area', 'lateral surface', 'total surface area'
        ];

        const diagramRelatedQuestions = [];
        
        this.questions.forEach(question => {
            const questionText = (question.question + ' ' + (question.explanation || '')).toLowerCase();
            
            // Check if any geometric keyword is in the question
            const hasGeometricKeyword = geometricKeywords.some(keyword => 
                questionText.includes(keyword.toLowerCase())
            );
            
            // Also check if the question already has SVG content
            const hasSVG = question.explanation && question.explanation.includes('<svg');
            
            // Also check if the question has a diagram field
            const hasDiagramField = question.diagram !== null && question.diagram !== undefined;
            
            if (hasGeometricKeyword || hasSVG || hasDiagramField) {
                diagramRelatedQuestions.push({
                    id: question.id,
                    question: question.question,
                    explanation: question.explanation,
                    diagram: question.diagram,
                    hasSVG: hasSVG,
                    hasDiagramField: hasDiagramField,
                    keywordsFound: geometricKeywords.filter(keyword => 
                        questionText.includes(keyword.toLowerCase())
                    )
                });
            }
        });
        
        console.log(`Found ${diagramRelatedQuestions.length} diagram-related questions out of ${this.questions.length} total questions.`);
        return diagramRelatedQuestions;
    }

    // Extract SVG from explanation text
    extractSVGFromExplanation(explanation) {
        if (!explanation) return null;
        
        // Extract SVG content from explanation
        const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/g;
        const matches = explanation.match(svgRegex);
        
        return matches ? matches[0] : null;
    }

    // Generate SVG for different types of geometric questions
    generateSVGForQuestion(question) {
        const questionText = (question.question + ' ' + (question.explanation || '')).toLowerCase();
        
        // Bearing questions
        if (questionText.includes('bearing')) {
            return this.generateBearingDiagram(question);
        }
        
        // Circle/chord questions
        if (questionText.includes('chord') || questionText.includes('radius') || 
            questionText.includes('circle') || questionText.includes('diameter')) {
            return this.generateCircleDiagram(question);
        }
        
        // Triangle/trigonometry questions
        if (questionText.includes('triangle') || questionText.includes('sin') || 
            questionText.includes('cos') || questionText.includes('tan') ||
            questionText.includes('pythagoras') || questionText.includes('right-angled')) {
            return this.generateTriangleDiagram(question);
        }
        
        // Quadrilateral questions
        if (questionText.includes('quadrilateral') || questionText.includes('rectangle') || 
            questionText.includes('square') || questionText.includes('parallelogram') ||
            questionText.includes('trapezium') || questionText.includes('rhombus')) {
            return this.generateQuadrilateralDiagram(question);
        }
        
        // 3D shape questions (cone, cylinder, sphere, etc.)
        if (questionText.includes('cone') || questionText.includes('cylinder') || 
            questionText.includes('sphere') || questionText.includes('pyramid') ||
            questionText.includes('prism') || questionText.includes('volume')) {
            return this.generate3DShapeDiagram(question);
        }
        
        // Coordinate geometry questions
        if (questionText.includes('coordinates') || questionText.includes('cartesian') ||
            questionText.includes('x-axis') || questionText.includes('y-axis')) {
            return this.generateCoordinateDiagram(question);
        }
        
        // Line and angle questions
        if (questionText.includes('line') || questionText.includes('angle') ||
            questionText.includes('parallel') || questionText.includes('perpendicular')) {
            return this.generateLineAngleDiagram(question);
        }
        
        // Default SVG for geometric questions without specific type
        return this.generateDefaultGeometricDiagram(question);
    }

    // Generate bearing diagram
    generateBearingDiagram(question) {
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
      
      <!-- Bearing line -->
      <line x1="150" y1="150" x2="220.71" y2="220.71" stroke="red" stroke-width="3"/>
      
      <!-- Bearing angle arc -->
      <path d="M160,140 A10 10 0 0 1 164.14,164.14" fill="none" stroke="blue" stroke-width="2"/>
      
      <!-- Bearing label -->
      <text x="186.96" y="134.69" font-size="12" fill="blue">135°</text>
    </svg>`;
    }

    // Generate circle diagram for chord/radius questions
    generateCircleDiagram(question) {
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

    // Generate triangle diagram for trigonometry questions
    generateTriangleDiagram(question) {
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

    // Generate quadrilateral diagram
    generateQuadrilateralDiagram(question) {
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

    // Generate 3D shape diagram (cone, cylinder, etc.)
    generate3DShapeDiagram(question) {
        const questionText = (question.question + ' ' + (question.explanation || '')).toLowerCase();
        
        if (questionText.includes('cone')) {
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
        } else if (questionText.includes('cylinder')) {
            return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Cylinder -->
      <ellipse cx="100" cy="70" rx="60" ry="15" fill="none" stroke="black" stroke-width="2"/>
      <ellipse cx="100" cy="180" rx="60" ry="15" fill="none" stroke="black" stroke-width="2"/>
      <line x1="40" y1="70" x2="40" y2="180" stroke="black" stroke-width="2"/>
      <line x1="160" y1="70" x2="160" y2="180" stroke="black" stroke-width="2"/>
      
      <!-- Height line -->
      <line x1="170" y1="70" x2="170" y2="180" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Radius line -->
      <line x1="100" y1="70" x2="160" y2="70" stroke="blue" stroke-width="2"/>
      
      <!-- Labels -->
      <text x="175" y="125" font-size="12" fill="red">h</text>
      <text x="130" y="65" font-size="12" fill="blue">r</text>
    </svg>`;
        } else {
            // Default 3D shape (sphere)
            return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Sphere -->
      <circle cx="100" cy="100" r="80" fill="none" stroke="black" stroke-width="2"/>
      <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="black" stroke-width="1" stroke-dasharray="5,5"/>
      <line x1="100" y1="20" x2="100" y2="180" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
      <line x1="20" y1="100" x2="180" y2="100" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
      
      <!-- Labels -->
      <text x="105" y="100" font-size="12" fill="red">Diameter</text>
      <text x="105" y="40" font-size="12" fill="blue">Radius</text>
    </svg>`;
        }
    }

    // Generate coordinate geometry diagram
    generateCoordinateDiagram(question) {
        return `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Axes -->
      <line x1="50" y1="150" x2="250" y2="150" stroke="black" stroke-width="2"/>
      <line x1="150" y1="50" x2="150" y2="250" stroke="black" stroke-width="2"/>
      
      <!-- Arrowheads -->
      <polygon points="245,145 250,150 245,155" fill="black"/>
      <polygon points="145,55 150,50 155,55" fill="black"/>
      
      <!-- Axis labels -->
      <text x="255" y="155" font-size="12">x</text>
      <text x="155" y="45" font-size="12">y</text>
      
      <!-- Grid lines -->
      <g stroke="lightgray" stroke-width="1" stroke-dasharray="2,2">
        <!-- Vertical grid lines -->
        <line x1="70" y1="50" x2="70" y2="250"/>
        <line x1="90" y1="50" x2="90" y2="250"/>
        <line x1="110" y1="50" x2="110" y2="250"/>
        <line x1="130" y1="50" x2="130" y2="250"/>
        <line x1="170" y1="50" x2="170" y2="250"/>
        <line x1="190" y1="50" x2="190" y2="250"/>
        <line x1="210" y1="50" x2="210" y2="250"/>
        <line x1="230" y1="50" x2="230" y2="250"/>
        
        <!-- Horizontal grid lines -->
        <line x1="50" y1="70" x2="250" y2="70"/>
        <line x1="50" y1="90" x2="250" y2="90"/>
        <line x1="50" y1="110" x2="250" y2="110"/>
        <line x1="50" y1="130" x2="250" y2="130"/>
        <line x1="50" y1="170" x2="250" y2="170"/>
        <line x1="50" y1="190" x2="250" y2="190"/>
        <line x1="50" y1="210" x2="250" y2="210"/>
        <line x1="50" y1="230" x2="250" y2="230"/>
      </g>
      
      <!-- Origin -->
      <text x="155" y="145" font-size="12">O</text>
      
      <!-- Example points -->
      <circle cx="170" cy="130" r="3" fill="red"/>
      <text x="175" y="125" font-size="12" fill="red">(2,2)</text>
      
      <circle cx="190" cy="110" r="3" fill="blue"/>
      <text x="195" y="105" font-size="12" fill="blue">(4,4)</text>
    </svg>`;
    }

    // Generate line and angle diagram
    generateLineAngleDiagram(question) {
        return `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Two intersecting lines -->
      <line x1="50" y1="100" x2="250" y2="100" stroke="black" stroke-width="2"/>
      <line x1="150" y1="50" x2="150" y2="150" stroke="black" stroke-width="2"/>
      
      <!-- Angle arc -->
      <path d="M150,100 A20 20 0 0 1 170,80" fill="none" stroke="red" stroke-width="2"/>
      
      <!-- Angle label -->
      <text x="165" y="85" font-size="12" fill="red">90°</text>
      
      <!-- Parallel lines example -->
      <line x1="50" y1="170" x2="250" y2="170" stroke="blue" stroke-width="2"/>
      <line x1="50" y1="190" x2="250" y2="190" stroke="blue" stroke-width="2"/>
      <text x="255" y="175" font-size="12" fill="blue">Parallel</text>
    </svg>`;
    }

    // Generate default geometric diagram
    generateDefaultGeometricDiagram(question) {
        return `<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="80" fill="none" stroke="gray" stroke-width="2"/>
            <text x="100" y="55" text-anchor="middle" font-size="14" fill="gray">Question ${question.id}</text>
            <text x="100" y="75" text-anchor="middle" font-size="12" fill="gray">Geometric Diagram</text>
        </svg>`;
    }

    // Create centralized SVG file with all diagrams
    createCentralizedDiagramFile(diagramQuestions) {
        let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Centralized Mathematics Diagrams File -->
<!-- Generated from mathematics_questions_jamb_2010.json -->
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
                svgDiagram = this.extractSVGFromExplanation(q.explanation);
            }
            
            if (!svgDiagram) {
                svgDiagram = this.generateSVGForQuestion(q);
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

    // Create image map file that maps question IDs to their diagram content
    createImageMapFile(diagramQuestions) {
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
                svgDiagram = this.extractSVGFromExplanation(q.explanation);
            }
            
            if (!svgDiagram) {
                svgDiagram = this.generateSVGForQuestion(q);
            }
            
            if (svgDiagram) {
                imageMap[q.id] = svgDiagram;
            }
        });
        
        return JSON.stringify(imageMap, null, 2);
    }

    // Process all mathematics questions to identify diagram-related ones and generate diagrams
    processAllQuestions() {
        console.log('Starting to process mathematics questions for diagrams...');
        
        // Identify diagram-related questions
        const diagramQuestions = this.identifyDiagramRelatedQuestions();
        
        // Create centralized diagram file
        const centralizedSVG = this.createCentralizedDiagramFile(diagramQuestions);
        fs.writeFileSync(this.centralizedSVGPath, centralizedSVG);
        console.log(`Created centralized diagram file: ${this.centralizedSVGPath}`);
        
        // Create image map file
        const imageMap = this.createImageMapFile(diagramQuestions);
        fs.writeFileSync(this.diagramMapPath, imageMap);
        console.log(`Created diagram map file: ${this.diagramMapPath}`);
        
        // Load the diagram map for use
        this.diagramMap = JSON.parse(imageMap);
        
        console.log(`Processing completed successfully!`);
        console.log(`Processed ${diagramQuestions.length} diagram-related questions.`);
        
        return {
            diagramQuestions,
            totalQuestions: this.questions.length,
            diagramCount: diagramQuestions.length
        };
    }

    // Get diagram by question ID
    getDiagramByQuestionId(questionId) {
        if (!this.diagramMap) {
            // Load diagram map if not already loaded
            try {
                const diagramMapData = fs.readFileSync(this.diagramMapPath, 'utf8');
                this.diagramMap = JSON.parse(diagramMapData);
            } catch (error) {
                console.error('Error loading diagram map:', error);
                return this.getDefaultDiagram(questionId);
            }
        }

        const diagram = this.diagramMap[questionId];
        if (diagram) {
            return diagram;
        } else {
            console.warn(`No diagram found for question ID: ${questionId}`);
            return this.getDefaultDiagram(questionId);
        }
    }

    // Get diagram wrapped in HTML container
    getDiagramHTMLByQuestionId(questionId) {
        const diagram = this.getDiagramByQuestionId(questionId);
        return `<div class="diagram-container">
            <h5>Diagram:</h5>
            ${diagram}
        </div>`;
    }

    // Generate a default diagram when no specific diagram exists
    getDefaultDiagram(questionId) {
        return `<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="80" fill="none" stroke="gray" stroke-width="2"/>
            <text x="100" y="55" text-anchor="middle" font-size="14" fill="gray">Question ${questionId}</text>
            <text x="100" y="75" text-anchor="middle" font-size="12" fill="gray">No diagram available</text>
        </svg>`;
    }

    // Update the diagram map with a new diagram
    updateDiagram(questionId, svgContent) {
        if (!this.diagramMap) {
            try {
                const diagramMapData = fs.readFileSync(this.diagramMapPath, 'utf8');
                this.diagramMap = JSON.parse(diagramMapData);
            } catch (error) {
                console.error('Error loading diagram map:', error);
                this.diagramMap = {};
            }
        }

        this.diagramMap[questionId] = svgContent;
        
        // Save the updated map back to file
        fs.writeFileSync(this.diagramMapPath, JSON.stringify(this.diagramMap, null, 2));
        console.log(`Updated diagram for question ID: ${questionId}`);
    }

    // Get all question IDs that have diagrams
    getQuestionIdsWithDiagrams() {
        if (!this.diagramMap) {
            try {
                const diagramMapData = fs.readFileSync(this.diagramMapPath, 'utf8');
                this.diagramMap = JSON.parse(diagramMapData);
            } catch (error) {
                console.error('Error loading diagram map:', error);
                return [];
            }
        }
        
        return Object.keys(this.diagramMap);
    }

    // Check if a question has a diagram
    hasDiagram(questionId) {
        if (!this.diagramMap) {
            try {
                const diagramMapData = fs.readFileSync(this.diagramMapPath, 'utf8');
                this.diagramMap = JSON.parse(diagramMapData);
            } catch (error) {
                console.error('Error loading diagram map:', error);
                return false;
            }
        }
        
        return this.diagramMap.hasOwnProperty(questionId);
    }
}

// Export the MathDiagramProcessor class
module.exports = MathDiagramProcessor;

// Example usage
if (require.main === module) {
    const processor = new MathDiagramProcessor();
    
    // Process all questions to identify diagram-related ones and generate diagrams
    const result = processor.processAllQuestions();
    
    console.log('Processing completed!');
    console.log(`Found ${result.diagramCount} diagram-related questions out of ${result.totalQuestions} total questions.`);
    
    // Example: Get diagram for a specific question
    const sampleDiagram = processor.getDiagramByQuestionId(6);
    console.log('Sample diagram for question 6 (first 100 characters):', sampleDiagram.substring(0, 100) + '...');
    
    // Example: Get HTML for a specific question
    const html = processor.getDiagramHTMLByQuestionId(6);
    console.log('HTML for question 6 (first 100 characters):', html.substring(0, 100) + '...');
    
    // Show available question IDs with diagrams
    const ids = processor.getQuestionIdsWithDiagrams();
    console.log('Question IDs with diagrams:', ids.slice(0, 10)); // Show first 10
}