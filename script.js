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
                //Add class
                currentSquare.classList.add('hoverClass');

                //Show preview
                currentSquare.textContent = gamePlay.checkTurn();
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

    return {
        gridSquare,
    };
})(document);

//Factory function to create each player
const Player = (name) => {
    function getName() {console.log(`Hello ${name}`);}
    let score = 0;

    return {
        getName,
    }
}

//Game play module
const gamePlay = (function() {

    //Create players
    const playerX = Player('X');
    const playerO = Player('O');

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
        if (placement.gridSelection == '') {
            updateSquare(placement);
            checkForWin();
            changeTurn();
            //console.log('The spot is clear');
        }
    }

    //Update the object's gridSelection, also update the grid textContent
    function updateSquare(square) {
        square.gridSelection = currentTurn;
        let id = 'ttt' + square.squareNum;
        let thisSquare = document.getElementById(id);

        //Update text content
        thisSquare.textContent = currentTurn;

        //Remove hover effect when selection is made
        thisSquare.classList.remove('hoverClass');
    }

    //Check if the last placement was a winning move
    function checkForWin() {
        //Loop through each row and column and see if all three squares match
        for (let i = 1; i <= 3; i++) {
            checkRowsAndCols('gridRow', i);
            checkRowsAndCols('gridCol', i);
        }

        function checkRowsAndCols(direction, num) {
            //Filter array to check each row or column
            let checkStack = GameBoard.gridSquare.filter(function (sq) {
                return sq[direction] == `${num}`;
            });
            //If all the squares in the current row or column match and are not blank
            if (checkStack[0].gridSelection == checkStack[1].gridSelection &&
                checkStack[1].gridSelection == checkStack[2].gridSelection &&
                checkStack[0].gridSelection != '') {
                   victory();
            }
        }
    }

    function victory() {
        alert('Victory!');
    }

    return {
        playerX,
        playerO,
        currentTurn,
        changeTurn,
        testPlacement,
        updateSquare,
        checkTurn,
    }
})();

