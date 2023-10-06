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
            gamePlay.testPlacement(gridSquare[squareNum]);
        });

        //Add event listener to add hover effect to blank square on hover
        currentSquare.addEventListener('mouseover', function() {
            if (currentSquare.textContent === '') {
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

    return {
        gridSquare,
        showWinningCombo,
    };
})(document);

//Display module
const DisplayGUI = (function(doc) {
    //Variables for display divs, inputs, and scores
    const newGame = doc.getElementById('newgame');
    const scoreBoard = doc.getElementById('scoreboard');
    const player1Input = doc.getElementById('player1');
    const player2Input = doc.getElementById('player2');
    const player1Display = doc.getElementById('player1score');
    const player2Display = doc.getElementById('player2score');

    function toggleDivs(div1, div2) {
        div1.classList.add('hiddenDiv');
        div2.classList.remove('hiddenDiv');
    }

    //newGame.addEventListener('click', () => gamePlay.startGame());

    toggleDivs(scoreBoard, newGame);

    return {
        player1Input,
        player2Input,
    }
})(document);

//Factory function to create each player
const Player = (name) => {
    let score = 0;

    return {
        name,
        score,
    }
}

//Game play module
const gamePlay = (function() {

    //Start Game
    // function startGame() {
    //     createPlayers();
    // }

    //createPlayers();

    //Create players
    //function createPlayers() {
        const playerX = Player(DisplayGUI.player1Input.value);
        const playerO = Player(DisplayGUI.player2Input.value);
    //}

    //Set victory status to false by default
    let isAVictory = false;

    //Default so player X goes first
    let currentTurn = 'X';

    //Check whose turn it is
    function checkTurn() {
        return currentTurn;
    }

    //Change turn to other player
    function changeTurn() {
        if (currentTurn === 'X') {currentTurn = 'O'}
        else {currentTurn = 'X'}
    }
    
    //Check if valid placement
    //If placement is valid, update the square, check for victory, and change turn
    function testPlacement(placement) {
        if (placement.gridSelection == '' &&
            isAVictory === false) {
            updateSquare(placement);
            checkForWin();
            changeTurn();
        }
    }

    //Update the object's gridSelection, also update the grid textContent
    function updateSquare(square) {
        if (isAVictory === true) {return}
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
        if (isAVictory === false) {
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

    }

    //Called if victory is detected
    function victory(winningSpaces) {
        //Update square appearance to show winning combo
        GameBoard.showWinningCombo(winningSpaces);

        //Add to player scores
        if (currentTurn === 'X' && isAVictory === false) {playerX.score ++}
        if (currentTurn === 'O' && isAVictory === false) {playerO.score ++}
        console.log(`${playerX.name}: ${playerX.score}`);
        console.log(`O: ${playerO.score}`);

        //Set victory status to true
        isAVictory = true;

        //Show results
        //alert(`Player ${currentTurn} wins!`);
    }

    return {
        playerX,
        playerO,
        currentTurn,
        isAVictory,
        //createPlayers,
        changeTurn,
        testPlacement,
        updateSquare,
        showHover,
        checkTurn,
    }
})();