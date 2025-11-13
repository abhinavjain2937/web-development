// =========================================================
// JAVASCRIPT LOGIC
// =========================================================

const quizData = [
    {
        question: "1. What is the standard file extension for a website's main stylesheet?",
        options: [".js", ".css", ".html"],
        answer: ".css",
        explanation: "The standard extension **.css** stands for Cascading Style Sheets, defining presentation.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "2. Which CSS property controls the text size?",
        options: ["text-style", "font-size", "text-size"],
        answer: "font-size",
        explanation: "The **font-size** property is used to specify the size of the font of an element.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "3. Where is the correct place to insert a link to an external JavaScript file?",
        options: ["In the <body> section, before </body>", "In the <head> section", "In the <footer> section"],
        answer: "In the <body> section, before </body>",
        explanation: "Placing the `<script>` tag just before the closing `</body>` tag improves **page load speed** because the browser finishes loading the visual elements first.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "4. What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax"],
        answer: "Cascading Style Sheets",
        explanation: "**CSS (Cascading Style Sheets)** is used to define styles for web pages, including the design, layout and variations in display for different devices.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "5. How do you correctly write an array in JavaScript?",
        options: ["var colors = 1 = ('red'), 2 = ('green')", "var colors = ['red', 'green', 'blue']", "var colors = 'red', 'green', 'blue'"],
        answer: "var colors = ['red', 'green', 'blue']",
        explanation: "Arrays in JavaScript are typically defined using **square brackets `[]`** and hold ordered lists of values.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "6. Which HTML attribute is used to define inline styles?",
        options: ["styles", "css", "style"],
        answer: "style",
        explanation: "The **style** attribute is used to add styles to an element, such as color, font, size, and more.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "7. Which CSS property is used to create space around elements, outside of any defined borders?",
        options: ["padding", "margin", "border-spacing"],
        answer: "margin",
        explanation: "The **margin** property is used to create extra space outside an element's border. **Padding** creates space inside the border.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "8. How can you force a variable to be block-scoped in modern JavaScript (ES6+)?",
        options: ["Using the 'var' keyword", "Using the 'let' or 'const' keywords", "You cannot block-scope variables"],
        answer: "Using the 'let' or 'const' keywords",
        explanation: "**let** and **const** are block-scoped, meaning the variable is only accessible within the curly braces `{}` where it is defined. `var` is function-scoped.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "9. What is the purpose of the `<meta name='viewport'...>` tag?",
        options: ["To set the document language", "To enable GPU rendering", "To control the page's dimensions and scaling on mobile devices"],
        answer: "To control the page's dimensions and scaling on mobile devices",
        explanation: "The viewport meta tag is **critical for responsive web design**, ensuring the page renders correctly and scales appropriately across different devices.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "10. What is the default value of the `position` property in CSS?",
        options: ["fixed", "static", "relative"],
        answer: "static",
        explanation: "By default, every element has a position value of **static**. Static elements are not affected by the top, bottom, left, and right properties.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "11. What is the correct syntax for checking if two values AND two types are equal in JavaScript?",
        options: ["==", "===", "=!", "!=="],
        answer: "===",
        explanation: "The **triple equals (===)** is the strict equality operator, which checks if two values are equal AND if they are of the same data type.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "12. Which semantic HTML5 tag is used for independent, self-contained content (like a blog post or a news story)?",
        options: ["<section>", "<article>", "<aside>"],
        answer: "<article>",
        explanation: "The **<article>** tag should be used for content that could be distributed independently, such as a magazine article or a comment.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "13. What does DOM stand for?",
        options: ["Document Object Model", "Data Order Manager", "Digital Object Method"],
        answer: "Document Object Model",
        explanation: "The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that JavaScript can change the structure, style, and content.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "14. Which CSS property is typically used with media queries for creating single-row responsive layouts?",
        options: ["grid-area", "display: flex", "font-weight"],
        answer: "display: flex",
        explanation: "The `display: flex` property (Flexbox) is ideal for laying out content elements in a single direction (row or column) and is crucial for creating adaptive, responsive designs.",
        userAnswer: null,
        isAnswered: false
    },
    {
        question: "15. What is the correct HTML element for the largest heading?",
        options: ["<head>", "<h6>", "<h1>"],
        answer: "<h1>",
        explanation: "The **<h1>** tag defines the most important heading in HTML, typically rendered as the largest. Headings go from h1 to h6.",
        userAnswer: null,
        isAnswered: false
    }
];

let currentQuestionIndex = 0;
let isTransitioning = false; // Prevents double-clicks during the pause

const quizContainer = document.getElementById('quizContainer');
const resultContainer = document.getElementById('resultContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const restartQuizBtn = document.getElementById('restartQuizBtn');
const feedbackMessage = document.getElementById('feedbackMessage'); 
const feedbackDisplay = document.getElementById('feedbackDisplay');
const resultContent = document.getElementById('resultContent');

// Navigation button references
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');


function updateNavigationButtons() {
    // Previous button logic
    prevBtn.disabled = currentQuestionIndex === 0;

    // Next/Submit button logic
    if (currentQuestionIndex === quizData.length - 1) {
        // Last question
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = !quizData[currentQuestionIndex].isAnswered; // Enable only if answered
    } else {
        // Middle questions
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
        nextBtn.disabled = !quizData[currentQuestionIndex].isAnswered; // Enable only if answered
    }
}

function renderQuestion() {
    if (isTransitioning) return; // Prevent rendering during transition

    // Hide results and feedback
    resultContainer.classList.add('hidden');
    feedbackMessage.classList.add('hidden');
    feedbackMessage.classList.remove('bg-green-100', 'bg-red-100', 'border-green-500', 'border-red-500'); // Clean up old styles

    if (currentQuestionIndex >= quizData.length) {
        showResults();
        return;
    }

    const q = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <div class="mb-4">
            <p class="text-xl font-semibold text-gray-800">${currentQuestionIndex + 1} of ${quizData.length}. ${q.question}</p>
        </div>
        <div class="space-y-3">
            ${q.options.map((option, index) => {
                // Class setup: ensures dark text color and base styling
                let classes = "quiz-option block w-full text-left p-3 border border-orange-300 bg-orange-50 hover:bg-orange-100 rounded-md transition duration-200 !text-gray-900"; 
                
                // Apply saved state styles if answered
                if (q.isAnswered) {
                    if (option === q.answer) {
                        classes += ' correct border-2'; // Highlight correct answer
                    } else if (option === q.userAnswer) {
                        classes += ' incorrect selected border-2'; // Highlight incorrect selection
                    }
                    classes += ' opacity-80';
                }
                
                // Apply selected style if it was the user's choice
                if (option === q.userAnswer) {
                    classes += ' selected';
                }
                
                return `
                    <button class="${classes}" 
                            data-answer="${option}"
                            ${q.isAnswered ? 'disabled' : ''}>
                        ${option}
                    </button>
                `;
            }).join('')}
        </div>
    `;
    
    // If the question is already answered, show the saved feedback
    if (q.isAnswered) {
        displayFeedback(q.userAnswer, q.answer, q.explanation);
        document.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);
    }

    // Attach event listeners to the new buttons ONLY if not answered
    if (!q.isAnswered) {
        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', checkAnswer);
        });
    }

    updateNavigationButtons();
}

function displayFeedback(selectedAnswer, correctAnswer, explanationText) {
     feedbackMessage.classList.remove('hidden');
     feedbackMessage.classList.add('border');

    if (selectedAnswer === correctAnswer) {
        feedbackMessage.innerHTML = `<span class="text-green-600 font-extrabold">Correct!</span> ${explanationText}`;
        feedbackMessage.classList.remove('bg-red-100', 'border-red-500');
        feedbackMessage.classList.add('bg-green-100', 'border-green-500');
    } else {
        feedbackMessage.innerHTML = `<span class="text-red-600 font-extrabold">Incorrect.</span> The correct answer was: <span class="font-bold">${correctAnswer}</span>. ${explanationText}`;
        feedbackMessage.classList.remove('bg-green-100', 'border-green-500');
        feedbackMessage.classList.add('bg-red-100', 'border-red-500');
    }
}

function checkAnswer(event) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const selectedAnswer = event.target.getAttribute('data-answer');
    const currentQuestion = quizData[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
    const options = document.querySelectorAll('.quiz-option');

    // 1. Update State
    currentQuestion.userAnswer = selectedAnswer;
    currentQuestion.isAnswered = true;
    
    // 2. Disable all options and highlight immediately
    options.forEach(btn => {
        btn.disabled = true;
        if (btn.getAttribute('data-answer') === correctAnswer) {
            btn.classList.add('correct', 'border-2'); // Highlight correct answer
        }
    });
    event.target.classList.add(selectedAnswer === correctAnswer ? 'correct' : 'incorrect', 'selected');
    
    // 3. Display feedback
    displayFeedback(selectedAnswer, correctAnswer, currentQuestion.explanation);
    
    // 4. Update Navigation state (Next/Submit should now be enabled)
    updateNavigationButtons();

    // 5. Move to the next question after a pause
    setTimeout(() => {
        isTransitioning = false;
        goToNextQuestion();
    }, 4000); 
}

function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function calculateScore() {
    let finalScore = 0;
    quizData.forEach(q => {
        if (q.userAnswer === q.answer) {
            finalScore++;
        }
    });
    return finalScore;
}

// --- Function to generate performance feedback ---
function getFeedbackMessage(score, total) {
    const percentage = (score / total) * 100;

    if (percentage >= 80) {
        return { 
            message: "Excellent work! You show a strong command of core web development concepts. Keep up the great learning!",
            color: "text-green-700",
            bg: "bg-green-100 border-green-500",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        };
    } else if (percentage >= 50) {
        return {
            message: "Good job! You have a solid foundation. Focus on reviewing CSS layout (Flexbox/Grid) and JavaScript logic to reach the next level.",
            color: "text-yellow-700",
            bg: "bg-yellow-100 border-yellow-500",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
        };
    } else {
        return {
            message: "Needs more practice. Don't worry, keep reviewing the explanations for each question and focus on the basics of HTML, CSS, and JS!",
            color: "text-red-700",
            bg: "bg-red-100 border-red-500",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        };
    }
}


function showResults() {
    // Recalculate score
    const finalScore = calculateScore();
    const totalQuestions = quizData.length;
    const feedback = getFeedbackMessage(finalScore, totalQuestions);

    // Hide quiz elements
    quizContainer.classList.add('hidden');
    feedbackMessage.classList.add('hidden');
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
    submitBtn.classList.add('hidden');
    
    // Clear old icon (if any)
    const oldIcon = resultContent.querySelector('svg');
    if (oldIcon) {
        oldIcon.remove();
    }

    // Show results
    resultContainer.classList.remove('hidden');
    resultContainer.className = `mt-6 p-6 rounded-md border-l-4 ${feedback.bg}`;

    scoreDisplay.textContent = `Quiz Complete! You scored ${finalScore} out of ${totalQuestions}.`;
    scoreDisplay.classList.remove('text-green-700', 'text-yellow-700', 'text-red-700');
    scoreDisplay.classList.add(feedback.color);

    feedbackDisplay.textContent = feedback.message;
    feedbackDisplay.classList.remove('text-green-700', 'text-yellow-700', 'text-red-700');
    feedbackDisplay.classList.add(feedback.color);

    // Insert icon
    resultContent.insertAdjacentHTML('afterbegin', feedback.icon);
}

function restartQuiz() {
    currentQuestionIndex = 0;
    // Reset quiz data state
    quizData.forEach(q => {
        q.userAnswer = null;
        q.isAnswered = false;
    });
    
    // Reset visibility
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    prevBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    renderQuestion();
}

// Attach event listeners for navigation
prevBtn.addEventListener('click', goToPreviousQuestion);
nextBtn.addEventListener('click', goToNextQuestion);
submitBtn.addEventListener('click', showResults);
restartQuizBtn.addEventListener('click', restartQuiz);

// Initialize quiz on load
renderQuestion();