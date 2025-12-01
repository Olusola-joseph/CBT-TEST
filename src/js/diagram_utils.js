// Diagram Utility Functions
// Provides functions to retrieve diagrams by question ID from the centralized diagram file

const fs = require('fs');

// Function to get diagram by question ID
function getDiagramByQuestionId(questionId, diagramMapPath = '/workspace/math_diagram_map.json') {
    try {
        // Load the diagram map
        const diagramMapData = fs.readFileSync(diagramMapPath, 'utf8');
        const diagramMap = JSON.parse(diagramMapData);
        
        // Return the diagram for the specified question ID
        const diagram = diagramMap[questionId];
        
        if (diagram) {
            return diagram;
        } else {
            console.warn(`No diagram found for question ID: ${questionId}`);
            return getDefaultDiagram(questionId);
        }
    } catch (error) {
        console.error('Error loading diagram map:', error);
        return getDefaultDiagram(questionId);
    }
}

// Function to get diagram wrapped in HTML container
function getDiagramHTMLByQuestionId(questionId, diagramMapPath = '/workspace/math_diagram_map.json') {
    const diagram = getDiagramByQuestionId(questionId, diagramMapPath);
    return `<div class="diagram-container">
        <h5>Diagram:</h5>
        ${diagram}
    </div>`;
}

// Function to check if a question has a diagram
function hasDiagram(questionId, diagramMapPath = '/workspace/math_diagram_map.json') {
    try {
        const diagramMapData = fs.readFileSync(diagramMapPath, 'utf8');
        const diagramMap = JSON.parse(diagramMapData);
        
        return diagramMap.hasOwnProperty(questionId);
    } catch (error) {
        console.error('Error checking diagram availability:', error);
        return false;
    }
}

// Function to get all question IDs that have diagrams
function getQuestionIdsWithDiagrams(diagramMapPath = '/workspace/math_diagram_map.json') {
    try {
        const diagramMapData = fs.readFileSync(diagramMapPath, 'utf8');
        const diagramMap = JSON.parse(diagramMapData);
        
        return Object.keys(diagramMap);
    } catch (error) {
        console.error('Error getting diagram question IDs:', error);
        return [];
    }
}

// Generate a default diagram when no specific diagram exists
function getDefaultDiagram(questionId) {
    return `<svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="180" height="80" fill="none" stroke="gray" stroke-width="2"/>
        <text x="100" y="55" text-anchor="middle" font-size="14" fill="gray">Question ${questionId}</text>
        <text x="100" y="75" text-anchor="middle" font-size="12" fill="gray">No diagram available</text>
    </svg>`;
}

// Function to update the diagram map with a new diagram
function updateDiagram(questionId, svgContent, diagramMapPath = '/workspace/math_diagram_map.json') {
    try {
        let diagramMap = {};
        
        // Load existing diagram map if it exists
        if (fs.existsSync(diagramMapPath)) {
            const diagramMapData = fs.readFileSync(diagramMapPath, 'utf8');
            diagramMap = JSON.parse(diagramMapData);
        }
        
        // Update the diagram for the specified question ID
        diagramMap[questionId] = svgContent;
        
        // Save the updated map back to file
        fs.writeFileSync(diagramMapPath, JSON.stringify(diagramMap, null, 2));
        console.log(`Updated diagram for question ID: ${questionId}`);
    } catch (error) {
        console.error('Error updating diagram:', error);
    }
}

// Export the functions
module.exports = {
    getDiagramByQuestionId,
    getDiagramHTMLByQuestionId,
    hasDiagram,
    getQuestionIdsWithDiagrams,
    updateDiagram
};

// Example usage when running directly
if (require.main === module) {
    console.log('Available question IDs with diagrams:', getQuestionIdsWithDiagrams().slice(0, 10));
    
    // Example: Get diagram for question ID 6 (bearing question)
    const diagram = getDiagramByQuestionId(6);
    console.log('Diagram for question 6 (first 100 characters):', diagram.substring(0, 100) + '...');
    
    // Example: Get HTML for question ID 6
    const html = getDiagramHTMLByQuestionId(6);
    console.log('HTML for question 6 (first 100 characters):', html.substring(0, 100) + '...');
    
    // Example: Check if question 6 has a diagram
    console.log('Question 6 has diagram:', hasDiagram(6));
}