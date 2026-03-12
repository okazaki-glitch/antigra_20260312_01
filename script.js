const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset-btn');
const pxIndicator = document.querySelector('.px-turn');
const poIndicator = document.querySelector('.po-turn');

const PLAYER_X = '✖';
const PLAYER_O = '〇';
const EMPTY = '';

let board = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
let isGameActive = true;
let currentPlayer = PLAYER_X; 

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6] 
];

function initGame() {
    board = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
    isGameActive = true;
    currentPlayer = PLAYER_X;
    
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'win');
    });

    updateStatusMessage("Your turn!");
    pxIndicator.classList.add('active');
    poIndicator.classList.remove('active');
}

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== EMPTY || !isGameActive || currentPlayer !== PLAYER_X) {
        return;
    }

    makeMove(index, PLAYER_X);
    
    if (checkWin(board, PLAYER_X)) {
        endGame(false, PLAYER_X);
    } else if (checkDraw(board)) {
        endGame(true);
    } else {
        currentPlayer = PLAYER_O;
        updateIndicators();
        updateStatusMessage("AI is thinking...");
        
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player === PLAYER_X ? 'x' : 'o');
}

function checkWin(currentBoard, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player) {
            return [a, b, c];
        }
    }
    return null;
}

function checkDraw(currentBoard) {
    return currentBoard.every(cell => cell !== EMPTY);
}

function endGame(isDraw, winner = null) {
    isGameActive = false;
    
    if (isDraw) {
        updateStatusMessage("It's a Draw!");
    } else {
        const winLine = checkWin(board, winner);
        if (winLine) {
            winLine.forEach(index => cells[index].classList.add('win'));
        }
        
        if (winner === PLAYER_X) {
            updateStatusMessage("You Win! 🎉");
        } else {
            updateStatusMessage("AI Wins! 🤖");
        }
    }
}

function updateIndicators() {
    if (currentPlayer === PLAYER_X) {
        pxIndicator.classList.add('active');
        poIndicator.classList.remove('active');
    } else {
        pxIndicator.classList.remove('active');
        poIndicator.classList.add('active');
    }
}

function updateStatusMessage(message) {
    messageElement.innerText = message;
}

// AI (Minimax Algorithm)
function makeAIMove() {
    if (!isGameActive) return;

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === EMPTY) {
            board[i] = PLAYER_O;
            let score = minimax(board, 0, false);
            board[i] = EMPTY;
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        makeMove(bestMove, PLAYER_O);
        
        if (checkWin(board, PLAYER_O)) {
            endGame(false, PLAYER_O);
        } else if (checkDraw(board)) {
            endGame(true);
        } else {
            currentPlayer = PLAYER_X;
            updateIndicators();
            updateStatusMessage("Your turn!");
        }
    }
}

function minimax(currentBoard, depth, isMaximizing) {
    if (checkWin(currentBoard, PLAYER_O)) return 10 - depth;
    if (checkWin(currentBoard, PLAYER_X)) return depth - 10;
    if (checkDraw(currentBoard)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === EMPTY) {
                currentBoard[i] = PLAYER_O;
                let score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = EMPTY;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === EMPTY) {
                currentBoard[i] = PLAYER_X;
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = EMPTY;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', initGame);

initGame();
