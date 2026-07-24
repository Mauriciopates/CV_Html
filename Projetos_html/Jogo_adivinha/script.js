let cpuNumber = Math.floor(Math.random() * 50) + 1;
let attempts = 0;


const inputGuess = document.getElementById('userGuess');
const btnCheck = document.getElementById('btnCheck');
const btnReset = document.getElementById('btnReset');
const feedback = document.getElementById('feedback');
const attemptsCount = document.getElementById('attemptsCount');


const themeToggle = document.getElementById('themeToggle');


themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
   
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = "☀️ Modo Claro";
    } else {
        themeToggle.textContent = "🌙 Modo Escuro";
    }
});

function checkGuess() {
    const userGuess = parseInt(inputGuess.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 50) {
        feedback.textContent = "Por favor, introduz um número válido entre 1 e 50.";
        feedback.className = "message error";
        return;
    }

    attempts++;
    attemptsCount.textContent = attempts;

    if (userGuess === cpuNumber) {
        feedback.textContent = `Parabéns! Acertaste no número ${cpuNumber} em ${attempts} tentativas!`;
        feedback.className = "message correct"; 
        endGame();
    } else if (userGuess < cpuNumber) {
        feedback.textContent = "Dica: O número do CPU é mais acima ↑";
        feedback.className = "message tip";
    } else {
        feedback.textContent = "Dica: O número do CPU é mais abaixo ↓";
        feedback.className = "message tip";
    }

    inputGuess.value = '';
    inputGuess.focus();
}

function endGame() {
    inputGuess.disabled = true;
    btnCheck.classList.add('hidden');
    btnReset.classList.remove('hidden');
}

function resetGame() {
    cpuNumber = Math.floor(Math.random() * 50) + 1;
    attempts = 0;
    
    attemptsCount.textContent = attempts;
    feedback.textContent = '';
    feedback.className = 'message';
    
    inputGuess.disabled = false;
    inputGuess.value = '';
    
    btnCheck.classList.remove('hidden');
    btnReset.classList.add('hidden');
}

btnCheck.addEventListener('click', checkGuess);

inputGuess.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

btnReset.addEventListener('click', resetGame);