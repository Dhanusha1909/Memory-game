document.addEventListener('DOMContentLoaded', () => {
            // Game elements
            const gameBoard = document.getElementById('game-board');
            const movesDisplay = document.getElementById('moves');
            const pairsDisplay = document.getElementById('pairs');
            const timerDisplay = document.getElementById('timer');
            const animalThemeBtn = document.getElementById('animal-theme');
            const foodThemeBtn = document.getElementById('food-theme');
            const restartBtn = document.getElementById('restart-btn');
            const resetBtn = document.getElementById('reset-btn');
            const winMessage = document.getElementById('win-message');
            const finalStats = document.getElementById('final-stats');
            const playAgainBtn = document.getElementById('play-again');
            
            // Game variables
            let cards = [];
            let flippedCards = [];
            let matchedPairs = 0;
            let moves = 0;
            let timer = null;
            let seconds = 0;
            let currentTheme = null;
            let lockBoard = false;
            
            // Theme symbols
            const themes = {
                animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
                foods: ['🍏', '🍕', '🍦', '🍩', '🍗', '🍔', '🍟', '🍉']
            };
            
            // Initialize the game
            function initGame() {
                resetGame();
                createCards();
                startTimer();
            }
            
            // Create cards based on current theme
            function createCards() {
                gameBoard.innerHTML = '';
                cards = [];
                flippedCards = [];
                matchedPairs = 0;
                moves = 0;
                movesDisplay.textContent = moves;
                pairsDisplay.textContent = `${matchedPairs}/8`;
                
                // Get symbols for current theme
                const symbols = [...themes[currentTheme], ...themes[currentTheme]];
                
                // Shuffle symbols
                shuffleArray(symbols);
                
                // Create card elements
                symbols.forEach(symbol => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    
                    const cardFront = document.createElement('div');
                    cardFront.classList.add('card-face', 'card-front');
                    
                    const cardBack = document.createElement('div');
                    cardBack.classList.add('card-face', 'card-back');
                    cardBack.textContent = symbol;
                    
                    card.appendChild(cardFront);
                    card.appendChild(cardBack);
                    
                    card.addEventListener('click', flipCard);
                    gameBoard.appendChild(card);
                    cards.push(card);
                });
            }
            
            // Flip a card
            function flipCard() {
                if (lockBoard) return;
                if (this === flippedCards[0]) return;
                if (this.classList.contains('flipped')) return;
                
                this.classList.add('flipped');
                flippedCards.push(this);
                
                if (flippedCards.length === 2) {
                    lockBoard = true;
                    moves++;
                    movesDisplay.textContent = moves;
                    
                    checkForMatch();
                }
            }
            
            // Check if flipped cards match
            function checkForMatch() {
                const card1Symbol = flippedCards[0].querySelector('.card-back').textContent;
                const card2Symbol = flippedCards[1].querySelector('.card-back').textContent;
                
                if (card1Symbol === card2Symbol) {
                    // Match found
                    flippedCards[0].removeEventListener('click', flipCard);
                    flippedCards[1].removeEventListener('click', flipCard);
                    flippedCards = [];
                    matchedPairs++;
                    pairsDisplay.textContent = `${matchedPairs}/8`;
                    lockBoard = false;
                    
                    // Check for win
                    if (matchedPairs === 8) {
                        endGame();
                    }
                } else {
                    // No match
                    setTimeout(() => {
                        flippedCards[0].classList.remove('flipped');
                        flippedCards[1].classList.remove('flipped');
                        flippedCards = [];
                        lockBoard = false;
                    }, 1000);
                }
            }
            
            // Shuffle array (Fisher-Yates algorithm)
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            
            // Start the timer
            function startTimer() {
                clearInterval(timer);
                seconds = 0;
                updateTimer();
                timer = setInterval(updateTimer, 1000);
            }
            
            // Update timer display
            function updateTimer() {
                seconds++;
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
            
            // Reset game state
            function resetGame() {
                clearInterval(timer);
                seconds = 0;
                updateTimer();
                winMessage.classList.remove('show');
            }
            
            // End game - show win message
            function endGame() {
                clearInterval(timer);
                finalStats.textContent = `Moves: ${moves} | Time: ${timerDisplay.textContent}`;
                setTimeout(() => {
                    winMessage.classList.add('show');
                }, 1000);
            }
            
            // Event listeners
            animalThemeBtn.addEventListener('click', () => {
                currentTheme = 'animals';
                initGame();
            });
            
            foodThemeBtn.addEventListener('click', () => {
                currentTheme = 'foods';
                initGame();
            });
            
            restartBtn.addEventListener('click', () => {
                if (currentTheme) {
                    initGame();
                }
            });
            
            resetBtn.addEventListener('click', () => {
                resetGame();
                gameBoard.innerHTML = '';
                moves = 0;
                matchedPairs = 0;
                movesDisplay.textContent = moves;
                pairsDisplay.textContent = `${matchedPairs}/8`;
                currentTheme = null;
            });
            
            playAgainBtn.addEventListener('click', () => {
                winMessage.classList.remove('show');
                if (currentTheme) {
                    initGame();
                }
            });
            
            // Initialize timer display
            updateTimer();
    });