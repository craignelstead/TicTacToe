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
            //Print the row and column
            //console.log(`Row ${gridRow} Col ${gridCol}`);

            //Check if square is X, O, or blank
            gamePlay.testPlacement(gridSquare[squareNum]);
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

    //Change turn to other player
    function changeTurn() {
        if (currentTurn === 'X') {currentTurn = 'O'}
        else {currentTurn = 'X'}
    }
    
    //Check if valid placement
    function testPlacement(placement) {
        if (placement.gridSelection == '') {
            updateSquare(placement);
            changeTurn();
            //console.log('The spot is clear');
        }
        else {
            //console.log('Spot taken')
        }
    }

    //Update the square
    function updateSquare(square) {
        square.gridSelection = currentTurn;
        let id = 'ttt' + square.squareNum;
        let thisSquare = document.getElementById(id);
        thisSquare.textContent = currentTurn;
    }

    return {
        playerX,
        playerO,
        currentTurn,
        changeTurn,
        testPlacement,
        updateSquare,
    }
})();

