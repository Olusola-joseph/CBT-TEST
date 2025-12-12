/**
 * MathJax Utility Functions
 * External file to handle mathematical expressions rendering
 */

// Initialize MathJax configuration
function initializeMathJax() {
    // Check if MathJax is already loaded
    if (typeof MathJax !== 'undefined') {
        console.log('MathJax already loaded');
        return;
    }

    // Load MathJax configuration
    const configScript = document.createElement('script');
    configScript.id = 'MathJax-script';
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
        window.MathJax = {
            tex: {
                inlineMath: [['\\$', '\\$'], ['\\\\(', '\\\\)']],
                displayMath: [['\\[', '\\]'], ['\\\\[', '\\\\]'], ['$$', '$$']],
                processEscapes: true,
                processEnvironments: true
            },
            loader: {load: ['[tex]/noerrors']},
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process'
            }
        };
    `;
    document.head.appendChild(configScript);

    // Load main MathJax library (includes necessary polyfills)
    const mainScript = document.createElement('script');
    mainScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    mainScript.async = true;
    document.head.appendChild(mainScript);
}

// Function to render math expressions on a specific element
function renderMathInElement(element) {
    // Wait for MathJax to be ready before rendering
    if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.promise) {
        MathJax.startup.promise.then(() => {
            if (element) {
                MathJax.typesetPromise([element]).then(() => {
                    console.log('MathJax rendered successfully');
                }).catch((error) => {
                    console.error('MathJax rendering error:', error);
                });
            } else {
                // If no element specified, render all elements with math content
                MathJax.typeset();
            }
        });
    } else if (typeof MathJax !== 'undefined') {
        // If MathJax is loaded but startup promise doesn't exist, try immediate render
        if (element) {
            MathJax.typesetPromise([element]).then(() => {
                console.log('MathJax rendered successfully');
            }).catch((error) => {
                console.error('MathJax rendering error:', error);
            });
        } else {
            MathJax.typeset();
        }
    } else {
        // MathJax hasn't loaded yet, wait a bit and try again
        setTimeout(() => {
            renderMathInElement(element);
        }, 200);
    }
}

// Function to render math expressions on all elements with specific class
function renderAllMathExpressions() {
    // Wait for MathJax to be ready before rendering
    if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.promise) {
        MathJax.startup.promise.then(() => {
            // Render all elements that might contain math
            const mathElements = document.querySelectorAll('.question-text, .option-text, .solution-text, .math-expression, .math-content');
            mathElements.forEach(element => {
                renderMathInElement(element);
            });
            
            // Also render any elements with data attributes indicating math content
            const mathDataElements = document.querySelectorAll('[data-math="true"]');
            mathDataElements.forEach(element => {
                renderMathInElement(element);
            });
        });
    } else if (typeof MathJax !== 'undefined') {
        // If MathJax is loaded but startup promise doesn't exist, try immediate render
        // Render all elements that might contain math
        const mathElements = document.querySelectorAll('.question-text, .option-text, .solution-text, .math-expression, .math-content');
        mathElements.forEach(element => {
            renderMathInElement(element);
        });
        
        // Also render any elements with data attributes indicating math content
        const mathDataElements = document.querySelectorAll('[data-math="true"]');
        mathDataElements.forEach(element => {
            renderMathInElement(element);
        });
    } else {
        // MathJax hasn't loaded yet, wait a bit and try again
        setTimeout(() => {
            renderAllMathExpressions();
        }, 200);
    }
}

// Function to escape HTML while preserving math delimiters
function escapeHtmlWithMath(text) {
    // Temporarily extract math expressions
    const mathPattern = /\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g;
    const mathMatches = [];
    let processedText = text.replace(mathPattern, (match, offset) => {
        const placeholder = `__MATH_PLACEHOLDER_${mathMatches.length}__`;
        mathMatches.push(match);
        return placeholder;
    });

    // Escape HTML entities in the remaining text
    processedText = processedText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // Restore math expressions
    mathMatches.forEach((mathExpr, index) => {
        processedText = processedText.replace(
            `__MATH_PLACEHOLDER_${index}__`,
            mathExpr
        );
    });

    return processedText;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize MathJax
    initializeMathJax();
    
    // Wait a bit longer to ensure MathJax is fully loaded before rendering
    setTimeout(() => {
        renderAllMathExpressions();
    }, 1000);
});

// Export functions for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeMathJax,
        renderMathInElement,
        renderAllMathExpressions,
        escapeHtmlWithMath
    };
}