//Game board module
const GameBoard = (function(doc) {
    //Array of divs making up the TTT grid
    const squares = Array.from(doc.querySelectorAll('.tttsquare'));

    //Creates an object for each square using factory function
    //Contains Row, Column, and current selection (null by default)
    const squareFactory = (currentSquare) => {
        const gridRow = currentSquare.getAttribute('data-row');
        const gridCol = currentSquare.getAttribute('data-col');
        let gridSelection = currentSquare.textContent;

        //Method to see current selection of square
        const checkSquareStatus = () => {
            console.log(gridSelection);
        }

        //Add event listener to each square
        //Event listener will check the current status of each square
        currentSquare.addEventListener('click', function() {
            console.log(`Row ${gridRow} Col ${gridCol}`);
            checkSquareStatus(currentSquare);

            currentSquare.textContent = gamePlay.currentTurn;
            gridSelection = currentSquare.textContent;
            //gridSquare[currentSquare].gridSelection = gamePlay.currentTurn;
        });

        return {
            gridRow,
            gridCol,
            gridSelection,
        }
    }

    //Create an object for each square using squareFactory and push objects
    //into gridSqaure array
    const gridSquare = [];
    for (let i = 0; i < squares.length; i++) {
        gridSquare.push(squareFactory(squares[i]));
    }

    return {
        gridSquare,
    };
})(document);

//Factory function to create each player
const Player = (name) => {
    const getName = () => name;
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
    const changeTurn = () => {
        if (currentTurn === 'X') {currentTurn = 'O'}
        else {currentTurn = 'X'}
    }
    
    //Check if valid placement
    const testPlacement = () => {
        if (this.gridSelection === '') {
            console.log(this.gridSelection);
        }
    }

    return {
        playerX,
        playerO,
        currentTurn,
    }
})();

