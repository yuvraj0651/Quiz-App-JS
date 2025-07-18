const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        correct: "Paris"
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: "4"
    },
    {
        question: "Which is a programming language?",
        options: ["HTML", "CSS", "Python", "Photoshop"],
        correct: "Python"
    },
    {
        question: "Which year did JavaScript launch?",
        options: ["1996", "1995", "1994", "1993"],
        correct: "1995"
    },
];

let currentQuestion = 0;
let score = localStorage.getItem("quizScore") ? parseInt(localStorage.getItem("quizScore")) : 0;
let selectedAnswer = null;
let timer;
let timeLeft = 15;

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 15;
    document.getElementById("timer").textContent = timeLeft;
    timer = setInterval(updateTimer, 1000);

    const q = quizData[currentQuestion];
    document.getElementById("question").textContent = `${currentQuestion + 1}. ${q.question}`;

    const optionHTML = q.options.map(option =>
        `<button class="option-btn" onclick="selectOption(this)">${option}</button>`
    ).join("");

    document.getElementById("options").innerHTML = optionHTML;
    selectedAnswer = null;

    updateProgressBar();
}

function selectOption(btn) {
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(button => button.classList.remove("selected"));
    btn.classList.add("selected");
    selectedAnswer = btn.textContent;
}

function nextQuestion() {
    if (!selectedAnswer) {
        alert("Please select an option");
        return;
    }

    clearInterval(timer);

    const correctAnswer = quizData[currentQuestion].correct;
    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach(btn => {
        if (btn.textContent === correctAnswer) {
            btn.classList.add("btn-success");
        } else if (btn.classList.contains("selected")) {
            btn.classList.add("btn-danger");
        }
        btn.disabled = true;
    });

    if (selectedAnswer === correctAnswer) {
        score++;
        localStorage.setItem("quizScore", score);
    }

    document.getElementById("score").textContent = score;

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showFinalScore();
        }
    }, 1000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft === 0) {
        nextQuestion();
    }
}

function updateProgressBar() {
    const progress = ((currentQuestion) / quizData.length) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;
}

function showFinalScore() {
    document.getElementById("quiz-box").innerHTML = `
        <h2>Quiz Completed ✅</h2>
        <p>Your final score is <strong>${score}/${quizData.length}</strong></p>
        <button class="btn btn-primary" onclick="restartQuiz()">Restart Quiz</button>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    localStorage.setItem("quizScore", score);
    document.getElementById("quiz-box").innerHTML = `
        <h2 id="question">Question text</h2>
        <div class="progress mb-3">
            <div id="progressBar" class="progress-bar" role="progressbar" style="width: 0%;"></div>
        </div>
        <div class="timer mb-3">Time left: <span id="timer">15</span>s</div>
        <div id="options" class="mb-3"></div>
        <button class="btn btn-primary" onclick="nextQuestion()">Next</button>
        <div class="mt-4">
            <h5>Score: <span id="score">0</span></h5>
        </div>
    `;
    document.getElementById("score").textContent = score;
    loadQuestion();
}

document.getElementById("score").textContent = score;
loadQuestion();
