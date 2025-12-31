#!/usr/bin/env python3

import re

# Read the file
with open('/workspace/src/js/biology-script.js', 'r') as f:
    content = f.read()

# Define the old code block
old_block = '''        // Clean up the question text to remove BODMAS references and fix underlines for regular questions
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, "");
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, "");

        // Add diagram container if available and question needs it
        let questionHtml = cleanQuestion;
        
        // Check if this question has a figure reference
        if (question.figureId) {
            const figure = this.figures.find(fig => fig.id === question.figureId);
            if (figure) {
                if (figure.svg) {
                    // Add the figure SVG to the question
                    questionHtml += `<div class="diagram-container"><h5>Figure:</h5>${figure.svg}</div>`;
                } else if (figure.image) {
                    // Add the figure image to the question
                    questionHtml += `<div class="diagram-container"><h5>Figure:</h5><img src="${figure.image}" alt="${figure.description || 'Question Figure'}" style="max-width: 100%; height: auto; display: block; margin: 10px auto;"></div>`;
                }
            }
        }
        // Also check for general diagram property
        else if (question.diagram && this.questionNeedsDiagram(question.question)) {
            // Check if the question text already contains an SVG diagram
            if (!questionHtml.includes("<svg")) {
                // Decode the diagram data and add it directly to the question
                try {
                    const decodedDiagram = decodeURIComponent(question.diagram);
                    if (decodedDiagram.startsWith("<svg")) {
                        questionHtml += `<div class="diagram-container"><h5>Diagram:</h5>${decodedDiagram}</div>`;
                    } else {
                        questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                    }
                } catch (e) {
                    questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                }
            }
        }'''

# Define the new code block
new_block = '''        // Clean up the question text to remove BODMAS references and fix underlines for regular questions
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, "");
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, "");

        // Add instruction if available
        let questionHtml = cleanQuestion;
        if (question.instruction) {
            questionHtml = `<div class="question-instruction">${question.instruction}</div>` + questionHtml;
        }
        
        // Check if this question has a figure reference
        if (question.figureId) {
            const figure = this.figures ? this.figures.find(fig => fig.id === question.figureId) : null;
            if (figure) {
                // Fix the image path to point to the correct location
                const imagePath = figure.file.startsWith('images/') ? `src/data/subjects/${figure.file}` : figure.file;
                if (figure.svg) {
                    // Add the figure SVG to the question
                    questionHtml += `<div class="diagram-container"><h5>Figure:</h5>${figure.svg}</div>`;
                } else if (imagePath) {
                    // Add the figure image to the question
                    questionHtml += `<div class="diagram-container"><h5>Figure:</h5><img src="${imagePath}" alt="${figure.description || 'Question Figure'}" style="max-width: 100%; height: auto; display: block; margin: 10px auto;"></div>`;
                }
            }
        }
        // Also check for general diagram property
        else if (question.diagram && this.questionNeedsDiagram(question.question)) {
            // Check if the question text already contains an SVG diagram
            if (!questionHtml.includes("<svg")) {
                // Decode the diagram data and add it directly to the question
                try {
                    const decodedDiagram = decodeURIComponent(question.diagram);
                    if (decodedDiagram.startsWith("<svg")) {
                        questionHtml += `<div class="diagram-container"><h5>Diagram:</h5>${decodedDiagram}</div>`;
                    } else {
                        questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                    }
                } catch (e) {
                    questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                }
            }
        }'''

# Replace the old block with the new block
new_content = content.replace(old_block, new_block)

# Write the updated content back to the file
with open('/workspace/src/js/biology-script.js', 'w') as f:
    f.write(new_content)

print("Successfully updated the biology script to include instructions and fix image paths.")