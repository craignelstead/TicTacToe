//Game board module
const GameBoard = (function(doc) {
    //Array of divs making up the TTT grid
    const squares = Array.from(doc.querySelectorAll('.tttsquare'));

    //Creates an object for each square using factory function
    //Contains Row, Column, and current selection (null by default)
    const squareFactory = (currentSquare, placeInArr) => {
        const gridRow = currentSquare.getAttribute('data-row');
        const gridCol = currentSquare.getAttribute('data-col');
        const squareNum = placeInArr;
        let gridSelection = currentSquare.textContent;

        //Add event listener to each square
        //Event listener will check the current status of each square
        currentSquare.addEventListener('click', function() {
            //Check if square is X, O, or blank
            if (gamePlay.checkTurn() === 'X') {
                gamePlay.testPlacement(gridSquare[squareNum]);
            }
        });

        //Add event listener to add hover effect to blank square on hover
        currentSquare.addEventListener('mouseover', function() {
            if (currentSquare.textContent === '' && gamePlay.checkTurn() ==='X') {
                gamePlay.showHover(currentSquare);
            }
        });

        //Add event listener to remove hover effect from each square on end hover
        currentSquare.addEventListener('mouseleave', function() {
            if (gridSquare[squareNum].gridSelection === '') {
                currentSquare.textContent = '';
            }

            currentSquare.classList.remove('hoverClass');
        });

        return {
            gridRow,
            gridCol,
            squareNum,
            gridSelection,
        }
    }

    //Create an object for each square using squareFactory and push objects
    //into gridSqaure array
    const gridSquare = [];
    for (let i = 0; i < squares.length; i++) {
        gridSquare.push(squareFactory(squares[i], i));
    }

    //Update board to show the winning combination
    function showWinningCombo(winningSpaces) {
        winningSpaces.forEach(space => {
            squares[space.squareNum].classList.add('winningCombo');
        });
    }

    //Assign hidden class to ttt board on page load
    const playingArea = doc.getElementById('tttboard');
    playingArea.classList.add('hiddenDiv');

    //Clears game board display
    function clearBoard() {
        //Hide play again button
        DisplayGUI.playAgain.classList.add('hiddenDiv');

        //Set victory status to false and set turn to Player X
        gamePlay.isAVictory = false;
        gamePlay.isADraw = false;
        gamePlay.currentTurn = 'X';
        gamePlay.resetTurns();
        DisplayGUI.gameMessage.textContent = '';

        //Set each object's gridSelection to blank and update display
        gridSquare.forEach((obj) => {
            obj.gridSelection = '';
            let id = 'ttt' + obj.squareNum;
            let thisSquare = doc.getElementById(id);

            //Set square text to blank
            thisSquare.textContent = obj.gridSelection;
            //Remove winningCombo from each square
            thisSquare.classList.remove('winningCombo');
        });        
    }

    return {
        gridSquare,
        showWinningCombo,
        playingArea,
        clearBoard,
    };
})(document);

//Display module
const DisplayGUI = (function(doc) {
    //Variables for display divs, inputs, and scores
    const setupGame = doc.getElementById('setupGame');
    const startGame = doc.getElementById('startGame');
    const playAgain = doc.getElementById('playAgain');
    const scoreBoard = doc.getElementById('scoreboard');
    const player1Input = doc.getElementById('player1');
    const player2Input = doc.getElementById('player2');
    const player1Display = doc.getElementById('player1score');
    const player2Display = doc.getElementById('player2score');
    const gameMessage = doc.getElementById('gameMessage');

    //Hide play again button by default
    playAgain.classList.add('hiddenDiv');

    //Sets div1 to hidden, sets div2 to visible
    function toggleDivs(div1, div2) {
        div1.classList.add('hiddenDiv');
        div2.classList.remove('hiddenDiv');
    }

    //Display whose turn it is
    function showTurn() {
        //Don't show current turn if game is over
        if (gamePlay.isAVictory === true || gamePlay.isADraw === true) return;
        console.log(`In DisplayGUI.showTurn: ${gamePlay.currentTurn}`);
        switch(gamePlay.checkTurn()) {
            case 'X':
                gameMessage.textContent = `${gamePlay.playerX.name}'s turn`;
                break;
            case 'O':
                gameMessage.textContent = `${gamePlay.playerO.name}'s turn`;
                break;
        }
    }

    //Add event listener to start game button and play again button
    startGame.addEventListener('click', checkInputs);
    playAgain.addEventListener('click', GameBoard.clearBoard);

    //Makes sure players names are valid
    function checkInputs() {
        if (player1Input.value.length <= 0 || player1Input.value.length > 20) {
            player1Input.classList.add('invalidInput');
        }
        else {
            player1Input.classList.remove('invalidInput');
            gamePlay.playerX.name = player1Input.value;
        }
        if (player2Input.value.length <= 0 || player2Input.value.length > 20) {
            player2Input.classList.add('invalidInput');
        }
        else {
            player2Input.classList.remove('invalidInput');
            gamePlay.playerO.name = player2Input.value;
        }

        if ((player1Input.value.length > 0 && player1Input.value.length <= 20) &&
            (player2Input.value.length > 0 && player2Input.value.length <= 20)) {
            GameBoard.playingArea.classList.remove('hiddenDiv');
            toggleDivs(setupGame, scoreBoard);
            showTurn();
            displayScores();
        }
        else {
            alert('Player names must be between 1 and 20 characters');
        }
    }

    //Updates the scoreboard
    function displayScores() {
        player1Display.textContent = 
            `${gamePlay.playerX.name} (X): ${gamePlay.playerX.score}`;
        player2Display.textContent = 
            `${gamePlay.playerO.name} (O): ${gamePlay.playerO.score}`;
    }

    toggleDivs(scoreBoard, setupGame);

    return {
        player1Input,
        player2Input,
        displayScores,
        gameMessage,
        playAgain,
        showTurn,
    }
})(document);

//Factory function to create each player
const Player = (input, humanOrComp) => {
    let name = input;
    let score = 0;
    let type = humanOrComp;

    return {
        name,
        score,
        type,
    }
}

//Game play module
const gamePlay = (function() {

    //Initialize players
    const playerX = Player(DisplayGUI.player1Input.value, 'human');
    const playerO = Player(DisplayGUI.player2Input.value, 'computer');

    //Set victory & draw status to false by default
    let isAVictory = false;
    let isADraw = false;

    //Default so player X goes first
    let currentTurn;
    resetTurns();

    //Show first turn
    //DisplayGUI.showTurn();

    //Check whose turn it is
    function checkTurn() {
        return currentTurn;
    }

    //Change turn to other player
    function changeTurn() {
        console.log(`Before: ${currentTurn}`);
        if (currentTurn === 'X' && 
            gamePlay.isAVictory === false && gamePlay.isADraw === false) {
                currentTurn = 'O';

            //Call computer to take a turn;
            if (gamePlay.playerO.type === 'computer') {
                gamePlay.computerTurn();
            }
        }
        else if (currentTurn === 'O' && 
            gamePlay.isAVictory === false && gamePlay.isADraw === false) {
                currentTurn = 'X';
        }
        console.log(`After: ${currentTurn}`);

        //Show whose turn it is
        DisplayGUI.showTurn();
    }
    
    //Check if valid placement
    //If placement is valid, update the square, check for victory, and change turn
    function testPlacement(placement) {
        if (placement.gridSelection === '' &&
            gamePlay.isAVictory === false) {
            updateSquare(placement);
            checkForWin();
            changeTurn();
        }
    }

    //Sets player turn back to X on new game
    function resetTurns() {
        currentTurn = 'X';
    }

    //Update the object's gridSelection, also update the grid textContent
    function updateSquare(square) {
        if (gamePlay.isAVictory === true) {return}
        square.gridSelection = currentTurn;
        let id = 'ttt' + square.squareNum;
        let thisSquare = document.getElementById(id);

        //Update text content
        thisSquare.textContent = currentTurn;

        //Remove hover effect when selection is made
        thisSquare.classList.remove('hoverClass');
    }

    //Show preview of placement if there is no victor already
    function showHover(square) {
        if (gamePlay.isAVictory === false) {
            //Add class
            square.classList.add('hoverClass');
            //Show preview
            square.textContent = checkTurn();
        }
    }

    //Check if the last placement was a winning move
    function checkForWin() {
        //Loop through each row and column and see if all three squares match
        for (let i = 1; i <= 3; i++) {
            checkRowsAndCols('gridRow', i);
            checkRowsAndCols('gridCol', i);
        }

        //Go through each row or column and compare gridSelection
        function checkRowsAndCols(direction, num) {
            //Filter array to check each row or column
            let checkStack = GameBoard.gridSquare.filter(function (sq) {
                return sq[direction] == `${num}`;
            });
            //If all the squares in the current row or column match and are not blank
            if (checkStack[0].gridSelection == checkStack[1].gridSelection &&
                checkStack[1].gridSelection == checkStack[2].gridSelection &&
                checkStack[0].gridSelection != '' ) {
                   victory(checkStack);
            }
        }

        //Check for diagonal victory top left to bottom right
        if ((GameBoard.gridSquare[0].gridSelection === 
                GameBoard.gridSquare[4].gridSelection) &&
            (GameBoard.gridSquare[4].gridSelection === 
                GameBoard.gridSquare[8].gridSelection) &&
            GameBoard.gridSquare[0].gridSelection != ''){
                let diagonalCombo = [
                    GameBoard.gridSquare[0],
                    GameBoard.gridSquare[4],
                    GameBoard.gridSquare[8]
                ]
                victory(diagonalCombo);
        }

        //Check for diagonal victory bottom left to top right
        if ((GameBoard.gridSquare[6].gridSelection === 
                GameBoard.gridSquare[4].gridSelection) &&
            (GameBoard.gridSquare[4].gridSelection === 
                GameBoard.gridSquare[2].gridSelection) &&
            GameBoard.gridSquare[6].gridSelection != ''){
                let diagonalCombo = [
                    GameBoard.gridSquare[6],
                    GameBoard.gridSquare[4],
                    GameBoard.gridSquare[2]
                ]
                victory(diagonalCombo);
        }

        //Check for draw
        checkForDraw();
    }

    //Check to see if there is no victory and all squares are filled
    function checkForDraw() {
        //No draw if victory is detected
        if (gamePlay.isAVictory === true) {return}

        //See if there are no blank squares after determining there is no victor
        for (let i = 0; i < GameBoard.gridSquare.length; i++) {
            if (GameBoard.gridSquare[i].gridSelection === '') {return}
        }
        //Below code only runs if draw is detected:

        //Show draw
        //*Update display*

        //Set draw status to true
        isADraw = true;

        //Show tie message
        DisplayGUI.gameMessage.textContent = `Draw!`;

        //Show play again button
        DisplayGUI.playAgain.classList.remove('hiddenDiv');
    }

    //Called if victory is detected
    function victory(winningSpaces) {
        //Update square appearance to show winning combo
        GameBoard.showWinningCombo(winningSpaces);

        //Add to player scores
        if (currentTurn === 'X' && gamePlay.isAVictory === false) {
            playerX.score ++;
            DisplayGUI.gameMessage.textContent = `${playerX.name} wins!`;
        }
        if (currentTurn === 'O' && gamePlay.isAVictory === false) {
            playerO.score ++;
            DisplayGUI.gameMessage.textContent = `${playerO.name} wins!`;
        }
        // console.log(`${playerX.name}: ${playerX.score}`);
        // console.log(`${playerO.name}: ${playerO.score}`);

        //Set victory status to true
        gamePlay.isAVictory = true;

        //Update score display
        DisplayGUI.displayScores();

        //Show play again button
        DisplayGUI.playAgain.classList.remove('hiddenDiv');
    }

    //Computer player logic
    function computerTurn() {    
        let compSelection;
        let valid = false;
        console.log(gamePlay.isADraw);
        console.log(gamePlay.isAVictory);
        if (gamePlay.isAVictory === true || gamePlay.isADraw === true) {return}

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        do {
            //Get a random number
            compSelection = getRandomInt(0, 8);
            console.log(compSelection);
            //Check to see if the space is blank
            if (GameBoard.gridSquare[compSelection].gridSelection === '') {
                valid = true;
            }            
        }
        while (valid === false);

        setTimeout(function(){
            testPlacement(GameBoard.gridSquare[compSelection]);
        }, 1000);
    }

    return {
        playerX,
        playerO,
        currentTurn,
        isAVictory,
        isADraw,
        changeTurn,
        testPlacement,
        updateSquare,
        showHover,
        checkTurn,
        resetTurns,
        computerTurn,
    }
})();