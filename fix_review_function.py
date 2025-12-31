#!/usr/bin/env python3

import re

# Read the file
with open('/workspace/src/js/biology-script.js', 'r') as f:
    content = f.read()

# Define the old review code block (the part that handles question processing)
old_review_block = '''        // Clean up the question text to remove BODMAS references and fix underlines
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, '');
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, '');

        // Add figure or diagram to the question if available
        if (question.figureId) {
            const figure = this.figures ? this.figures.find(fig => fig.id === question.figureId) : null;
            if (figure) {
                if (figure.svg) {
                    cleanQuestion += `<div class="diagram-container"><h5>Figure:</h5>${figure.svg}</div>`;
                } else if (figure.image) {
                    cleanQuestion += `<div class="diagram-container"><h5>Figure:</h5><img src="${figure.image}" alt="${figure.description || 'Question Figure'}" style="max-width: 100%; height: auto; display: block; margin: 10px auto;"></div>`;
                }
            }
        }
        // Also check for general diagram property
        else if (question.diagram && this.questionNeedsDiagram(question.question)) {
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
        }'''

# Define the new review code block
new_review_block = '''        // Clean up the question text to remove BODMAS references and fix underlines
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, '');
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, '');

        // Add instruction if available
        if (question.instruction) {
            cleanQuestion = `<div class="question-instruction">${question.instruction}</div>` + cleanQuestion;
        }
        
        // Add figure or diagram to the question if available
        if (question.figureId) {
            const figure = this.figures ? this.figures.find(fig => fig.id === question.figureId) : null;
            if (figure) {
                // Fix the image path to point to the correct location
                const imagePath = figure.file.startsWith('images/') ? `src/data/subjects/${figure.file}` : figure.file;
                if (figure.svg) {
                    cleanQuestion += `<div class="diagram-container"><h5>Figure:</h5>${figure.svg}</div>`;
                } else if (imagePath) {
                    cleanQuestion += `<div class="diagram-container"><h5>Figure:</h5><img src="${imagePath}" alt="${figure.description || 'Question Figure'}" style="max-width: 100%; height: auto; display: block; margin: 10px auto;"></div>`;
                }
            }
        }
        // Also check for general diagram property
        else if (question.diagram && this.questionNeedsDiagram(question.question)) {
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
        }'''

# Replace the old review block with the new review block
new_content = content.replace(old_review_block, new_review_block)

# Write the updated content back to the file
with open('/workspace/src/js/biology-script.js', 'w') as f:
    f.write(new_content)

print("Successfully updated the review function to include instructions and fix image paths.")