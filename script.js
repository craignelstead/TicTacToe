//Game board module
const GameBoard = (function(doc) {
    const squares = Array.from(doc.querySelectorAll('.tttsquare'));

    //Factory function for each square
    //Contains Row, Column, and current selection (null by default)
    const squareFactory = (currentSquare) => {
        const gridRow = currentSquare.getAttribute('data-row');
        const gridCol = currentSquare.getAttribute('data-col');
        let gridSelection = null;

        const showStatus = (currentSquare) => {
            currentSquare.addEventListener('click', function(event) {
                let row = event.target.getAttribute('data-row');
                let col = event.target.getAttribute('data-col')
                console.log(`Row ${row} Col ${col}`);
            })
        }

        return {
            gridRow,
            gridCol,
            gridSelection,
            showStatus,
        }
    }

    //Create an object for each square
    const gridSquare = [];
    for (let i = 0; i < squares.length; i++) {
        gridSquare.push(squareFactory(squares[i]));
    }

    //Add event listener to each square
    // for (let i = 0; i < squares.length; i++) {
    //     squares[i].addEventListener('click', function(event) {
    //         let row = event.target.getAttribute('data-row');
    //         let col = event.target.getAttribute('data-col')
    //         console.log(`Row ${row} Col ${col}`);
    //     });
    // }

    return {
        gridSquare,
    };
})(document);

//Game play module
const GamePlay = (function() {

    //Method to see if square is already taken
    const checkSquareStatus = () => {

    }
    
    //Display Controller

});

//Factory function to create each player
const Player = (name) => {
    const getName = () => name;

    return {
        getName,
    }
}