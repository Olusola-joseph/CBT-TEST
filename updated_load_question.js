    async loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) {
            console.error('Invalid question index:', index);
            return;
        }

        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // Update question display - using innerHTML to support HTML tags like <u>
        document.getElementById('q-number').textContent = question.id;
        // Clean up the question text to remove BODMAS references and fix underlines
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, '');
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, '');
        
        // Add diagram container if question needs it
        let questionHtml = cleanQuestion;
        if (this.questionNeedsDiagram(question.question)) {
            // Fetch diagram from centralized file based on question ID
            const diagram = await this.fetchDiagramForQuestion(question.id);
            if (diagram && diagram.hasDiagram) {
                questionHtml += `<div class="diagram-container"><h5>Diagram:</h5>${diagram.diagram}</div>`;
            }
        }
        
        // Fix MathJax delimiters from double backslashes to single backslashes for proper rendering
        const fixedQuestionHtml = questionHtml.replace(/\\\\\\\\\\\\\\(/g, '\\\\(').replace(/\\\\\\\\\\\\\\)/g, '\\\\)').replace(/\\\\\\\\\\\\[/g, '\\\\[').replace(/\\\\\\\\\\\\]/g, '\\\\]');
        document.getElementById('question-text').innerHTML = fixedQuestionHtml; // Changed to innerHTML to support HTML tags
        document.getElementById('current-q').textContent = index + 1;
        document.getElementById('total-q').textContent = this.questions.length;

        // Trigger MathJax to re-render the mathematical expressions
        if (window.MathJax) {
            MathJax.typesetPromise([document.getElementById('question-text')]).then(function() {
                if (typeof typesetMath === 'function') {
                    typesetMath();
                }
            }).catch(function (err) {
                console.error('MathJax error:', err);
            });
        }

        // Render options
        this.renderOptions(question);

        // Update question list highlighting
        this.updateQuestionList();

        // Update navigation buttons
        this.updateNavigationButtons();

        // Add animation class for smooth transition
        const questionContainer = document.querySelector('.question-body');
        questionContainer.classList.add('question-transition');
        setTimeout(() => {
            questionContainer.classList.remove('question-transition');
        }, 300);
    }