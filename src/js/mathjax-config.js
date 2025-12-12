window.MathJax = {
  loader: {
    load: [
      '[tex]/ams'
    ]
  },
  tex: {
    packages: {'[+]': ['ams']},
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true,
    tags: 'ams',
    macros: {
      bold: ['\\mathbf{#1}', 1],
      red: ['\\color{red}{#1}', 1],
      blue: ['\\color{blue}{#1}', 1],
      green: ['\\color{green}{#1}', 1],
      purple: ['\\color{purple}{#1}', 1]
    }
  },
  options: {
    ignoreHtmlClass: 'tex2jax_ignore',
    processHtmlClass: 'tex2jax_process'
  },
  startup: {
    ready: function() {
      MathJax.startup.defaultReady();
    }
  }
};

// Initialize MathJax when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (window.MathJax) {
    // Wait for MathJax to be fully loaded before typesetting
    if (MathJax.startup && typeof MathJax.startup.promise !== 'undefined') {
      MathJax.startup.promise.then(() => {
        if (typeof MathJax.typeset === 'function') {
          MathJax.typeset();
        } else if (typeof MathJax.typesetPromise === 'function') {
          MathJax.typesetPromise();
        }
      });
    } else {
      // Fallback for older versions
     // MathJax.typeset();
    }
  }
});

// Function to typeset specific elements after dynamic content is added
function typesetMath() {
  if (window.MathJax) {
    // Wait for MathJax to be fully loaded before typesetting
    if (MathJax.startup && typeof MathJax.startup.promise !== 'undefined') {
      MathJax.startup.promise.then(() => {
        if (typeof MathJax.typeset === 'function') {
          MathJax.typeset();
        } else if (typeof MathJax.typesetPromise === 'function') {
          MathJax.typesetPromise();
        }
      });
    } else {
      // Fallback for older versions
      if (typeof MathJax.typeset === 'function') {
        MathJax.typeset();
      } else if (typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise();
      }
    }
  }
}
