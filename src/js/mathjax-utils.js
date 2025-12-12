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

    // Create script element for MathJax
    const mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
    mathJaxScript.async = true;
    document.head.appendChild(mathJaxScript);

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
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process'
            }
        };
    `;
    document.head.appendChild(configScript);

    // Load main MathJax library
    const mainScript = document.createElement('script');
    mainScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    mainScript.async = true;
    document.head.appendChild(mainScript);
}

// Function to render math expressions on a specific element
function renderMathInElement(element) {
    if (typeof MathJax !== 'undefined' && element) {
        MathJax.typesetPromise([element]).then(() => {
            console.log('MathJax rendered successfully');
        }).catch((error) => {
            console.error('MathJax rendering error:', error);
        });
    } else if (!element) {
        // If no element specified, render all elements with math content
        MathJax.typeset();
    }
}

// Function to render math expressions on all elements with specific class
function renderAllMathExpressions() {
    if (typeof MathJax !== 'undefined') {
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
    
    // Small delay to ensure MathJax is loaded before rendering
    setTimeout(() => {
        renderAllMathExpressions();
    }, 500);
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