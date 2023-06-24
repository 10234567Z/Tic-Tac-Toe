function gameboard() {
    let rows = 3,
        columns = 3,
        board = [],
        cellsAvailable = true;
    /** Make a 2d Console Board */
    for (i = 0; i < rows; i++) {
        board[i] = []
        for (h = 0; h < columns; h++) {
            board[i].push(cell());
        }
    }
    let getBoard = () => board;

    /** in the 2d Board , check if the cells are available. If not , return */
    let cellAvailability = (column, row, value) => {
        if (board[row][column].getValue() !== '') return;
        board[row][column].addValue(value);
    }

    return {
        getBoard,
        cellAvailability
    }
}


function cell() {
    let value = '';

    /** Assign value of current player */
    let addValue = (player) => {
        value = player;
    }

    let getValue = () => {
        return value;
    }

    return { addValue, getValue };
}

function gameController(playerOneName , playerTwoName) {
    /** If the names are valid continue , if not then reload */
    if (playerOneName.trim() !== '' && playerTwoName.trim() !== '' && playerOneName !== playerTwoName) {
        let board = gameboard();

        let players = [
            {
                name: playerOneName,
                value: 'X'
            },
            {
                name: playerTwoName,
                value: 'O'
            }
        ]

        /** Start from 1st player */
        let activePlayer = players[0];

        let getActivePlayer = () => activePlayer;

        /** Switch player in between */
        let switchTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        }


        /** Reset whole game i.e board cell values , active player and other bools */
        let resetGame = () => {
            board.getBoard().forEach(row => {
                row.forEach(cell => {
                    cell.addValue('')
                });
            });
            activePlayer = players[0];
            winCheck = false;
        }


        let winCheck = false;

        /** Handles all the operation during round play */
        let playRound = (row, column) => {
            board.cellAvailability(column, row, getActivePlayer().value)

            let horizontalCheck1 = []
            let horizontalCheck2 = []
            let horizontalCheck3 = []

            let verticalCheck1 = []
            let verticalCheck2 = []
            let verticalCheck3 = []

            let diagonalRowT2L = []
            let diagonalRowT2R = []

            for (i = 0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                    /** If rows and columns are same its diagonal is top left to right , like 1,1 ; 2,2 would all be next to each other diagonally */
                    if (i === j) {
                        diagonalRowT2R.push(board.getBoard()[i][j].getValue())
                    }
                    /** (-1 is only for it to not go more than 2 i.e highest index) 
                     *  0  1  2
                     * |     ij| 0
                     * |   ij  | 1
                     * |ij_____| 2
                     * in this above diagram i can be said as 3 - j - 1
                     */
                    if (i === 3 - j - 1) {
                        diagonalRowT2L.push(board.getBoard()[i][j].getValue())
                    }

                    /** Next 3 if satements check on the different row indexes and horizontals indexes by checking all 3 rows individually */
                    if (i === 0) {
                        horizontalCheck1.push(board.getBoard()[i][j].getValue())
                    }
                    if (i === 1) {
                        horizontalCheck2.push(board.getBoard()[i][j].getValue())
                    }
                    if (i === 2) {
                        horizontalCheck3.push(board.getBoard()[i][j].getValue())
                    }

                    /** Next 3 if satements check on the different col indexes and vertical indexes by checking all 3 cols individually */
                    if (j === 0) {
                        verticalCheck1.push(board.getBoard()[i][j].getValue())
                    }
                    if (j === 1) {
                        verticalCheck2.push(board.getBoard()[i][j].getValue())
                    }
                    if (j === 2) {
                        verticalCheck3.push(board.getBoard()[i][j].getValue())
                    }
                }
            }

            /** Push all the checksinside a single array */
            let allChecks = [];
            allChecks.push(horizontalCheck1,
                horizontalCheck2,
                horizontalCheck3,
                verticalCheck1,
                verticalCheck2,
                verticalCheck3,
                diagonalRowT2L,
                diagonalRowT2R
            );

            /** Checks allCheck array */
            for (let i = 0; i < allChecks.length; i++) {

                /** Sees if any of the 3 consequentive row check is same other than being empty same, if there is then return wincheck as true */
                if (allChecks[i][0] !== '' && allChecks[i].every(val => val === allChecks[i][0])) {
                    winCheck = true;
                    break;
                }
            }

            /** Perform a woohoo! celebration div upon winning */
            if (winCheck === true) {
                let existingWinnerMessage = document.querySelector('.winnerMessage');
                if (existingWinnerMessage) {
                    existingWinnerMessage.remove();
                }
                let winningMessage = document.createElement('div')
                winningMessage.classList.add('winnerMessage');
                document.querySelector('body').appendChild(winningMessage);
                winningMessage.textContent = `${getActivePlayer().name} won`
            }
            switchTurn();
        }
        let getWinCheck = () => winCheck;
        return {
            getWinCheck,
            resetGame,
            getActivePlayer,
            playRound,
            getBoard: board.getBoard
        }
    }
    else{
        alert('Same or empty names for both players is not acceptable.')
        location.reload();
    }
}
function UIController() {
    let boardElement = document.querySelector('.gameboard')
    let playerOneName = prompt('Type the 1st Player name Here', '')
    let playerTwoName = prompt('Type the 2nd Player name Here', '');
    let game = gameController(playerOneName,playerTwoName);

    let updateScreen = () => {

        /** Just printing a board and taking values from 2d board */
        let cellsAvailable = 0;
        let board = game.getBoard();
        boardElement.textContent = '';
        board.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                let cellElement = document.createElement('button');
                cellElement.classList.add(`cell`);
                boardElement.appendChild(cellElement);
                cellElement.textContent = cellValue.getValue();
                cellElement.dataset.column = colIndex;
                cellElement.dataset.row = rowIndex;
                if (cellValue.getValue() === '') {
                    cellsAvailable++;
                }
            }
            )
        }
        )

        /** This is to handle the game if it draws */
        if (game.getWinCheck() === false && cellsAvailable === 0) {
            let existingWinnerMessage = document.querySelector('.winnerMessage');
            if (existingWinnerMessage) {
                existingWinnerMessage.remove();
            }
            let winningMessage = document.createElement('div')
            winningMessage.classList.add('winnerMessage');
            document.querySelector('body').appendChild(winningMessage);
            winningMessage.textContent = `Its a draw!`
        }
    }

    /** Cell button handles , adds values in UI of cell */
    boardElement.addEventListener('click', e => {
        let selectedColumn = e.target.dataset.column;
        let selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
        if(playerTwoName === 'Computer'){
            selectedColumn = Math.floor(Math.random() * 3);
            selectedRow = Math.floor(Math.random() * 3)
            if(game.getBoard()[selectedRow][selectedColumn].getValue() === ''){
                game.playRound(selectedRow, selectedColumn);
                updateScreen();
            }
            else{
                while(game.getBoard()[selectedRow][selectedColumn].getValue() !== ''){
                    selectedColumn = Math.floor(Math.random() * 3);
                    selectedRow = Math.floor(Math.random() * 3)
                }
                game.playRound(selectedRow, selectedColumn);
                updateScreen();
            }
            console.log(game.getBoard()[selectedRow][selectedColumn].getValue(),selectedRow,selectedColumn)
        }
    })

    /** When clicked anywhere on winner message div or other specified buttons , it resets game */
    document.addEventListener('click', function clickHandler(e) {
        if (e.target.classList.contains('winnerMessage')) {
            e.target.remove();
            game.resetGame();
            updateScreen();
        }
        /** Additionally gives option to change name with resets */
        if(e.target.classList.contains('restart') || e.target.classList.contains('human')){
            game.resetGame();
            playerOneName = '';
            playerTwoName = '';
            playerOneName = prompt('Type the 1st Player name Here', '')
            playerTwoName = prompt('Type the 2nd Player name Here', '')
            if(playerOneName.trim() === '' || playerTwoName.trim() === ''){
                alert('Invalid Input')
                location.reload()
            }
            game = gameController(playerOneName,playerTwoName)
            updateScreen();
        }
    })

    /** Handles names reset upon click of computer button */
    document.querySelector('.computer').addEventListener('click' , () => {
        game.resetGame();
        playerOneName = '';
        playerTwoName = 'Computer';
        playerOneName = prompt('Type the 1st Player name Here', '')
        if(playerOneName.trim() === ''){
            alert('Invalid Input')
            location.reload()
        }
        game = gameController(playerOneName,playerTwoName)
        updateScreen();
    })
    

    updateScreen();
}




UIController();