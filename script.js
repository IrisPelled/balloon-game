const levels = [
    { sum: 10, balloonCount: 6, instruction: 'מצא זוגות בלונים שסכומם 10' },
    { sum: 20, balloonCount: 10, instruction: 'מצא זוגות בלונים שסכומם 20' },
    { sum: 30, balloonCount: 12, instruction: 'מצא זוגות בלונים שסכומם 30' },
    { sum: 100, balloonCount: 14, instruction: 'מצא זוגות בלונים שסכומם 100' }
];

let currentLevel = 0;
let score = 0;
let selectedBalloons = [];
let timer;
let startTime;
let playerName = '';

const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const balloonsContainer = document.getElementById('balloons-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const nextLevelButton = document.getElementById('next-level');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalTimeElement = document.getElementById('final-time');
const instructionsElement = document.getElementById('instructions');
const congratsMessageElement = document.getElementById('congrats-message');
const backgroundMusic = document.getElementById('background-music');

function startGame() {
    playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert('אנא הכנס את שמך');
        return;
    }

    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    gameOverElement.style.display = 'none';
    
    initializeGame();
}

function initializeGame() {
    currentLevel = 0;
    score = 0;
    updateScore();
    startTime = new Date();
    updateTimer();
    nextLevel();

    // הפעלת מוזיקת הרקע
    backgroundMusic.play().catch(error => console.log("אוטופליי נחסם:", error));
}

function nextLevel() {
    if (currentLevel >= levels.length) {
        endGame();
        return;
    }
    
    const level = levels[currentLevel];
    instructionsElement.textContent = level.instruction;
    const numbers = generateNumbers(level.sum, level.balloonCount);
    shuffleArray(numbers);
    renderBalloons(numbers);
    nextLevelButton.style.display = 'none';
    selectedBalloons = [];
    currentLevel++;
}

function generateNumbers(sum, count) {
    const numbers = [];
    while (numbers.length < count) {
        const number = Math.floor(Math.random() * (sum - 1)) + 1;
        if (numbers.indexOf(number) === -1 && numbers.indexOf(sum - number) === -1 && number !== sum - number) {
            numbers.push(number);
            numbers.push(sum - number);
        }
    }
    return numbers.slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderBalloons(numbers) {
    balloonsContainer.innerHTML = '';
    const colors = ['#FFD700', '#00CED1', '#32CD32', '#FF69B4']; // צבעים בוהקים
    numbers.forEach((number, index) => {
        const balloonContainer = document.createElement('div');
        balloonContainer.className = 'balloon-container';
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = number;
        balloon.style.backgroundColor = colors[index % colors.length];
        balloon.onclick = () => selectBalloon(balloon, number);
        balloonContainer.appendChild(balloon);
        balloonsContainer.appendChild(balloonContainer);
    });
}

function selectBalloon(balloon, number) {
    if (selectedBalloons.length < 2) {
        balloon.classList.add('selected');
        selectedBalloons.push({ balloon, number });
        if (selectedBalloons.length === 2) {
            checkSelection();
        }
    }
}

function checkSelection() {
    const [first, second] = selectedBalloons;
    if (first.number + second.number === levels[currentLevel - 1].sum) {
        score++;
        updateScore();
        first.balloon.parentNode.remove();
        second.balloon.parentNode.remove();
    } else {
        first.balloon.classList.remove('selected');
        second.balloon.classList.remove('selected');
    }
    selectedBalloons = [];
    if (!balloonsContainer.firstChild) {
        nextLevelButton.style.display = 'block';
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateTimer() {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    timerElement.textContent = elapsedSeconds;
    if (currentLevel < levels.length) {
        timer = requestAnimationFrame(updateTimer);
    }
}

function endGame() {
    balloonsContainer.style.display = 'none';
    nextLevelButton.style.display = 'none';
    instructionsElement.textContent = '';
    gameOverElement.style.display = 'block';
    congratsMessageElement.textContent = `${playerName}, כל הכבוד!`;
    finalScoreElement.textContent = score;
    finalTimeElement.textContent = timerElement.textContent;
    cancelAnimationFrame(timer);

    // עצירת מוזיקת הרקע
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function restartGame() {
    gameOverElement.style.display = 'none';
    balloonsContainer.style.display = 'flex'; // Ensure balloons are displayed in rows
    balloonsContainer.style.flexWrap = 'wrap';
    balloonsContainer.style.justifyContent = 'center';
    initializeGame();
}

// Set styles to ensure balloons are displayed in rows initially and on restart
balloonsContainer.style.display = 'flex';
balloonsContainer.style.flexWrap = 'wrap';
balloonsContainer.style.justifyContent = 'center';
