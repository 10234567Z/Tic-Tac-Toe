function gameboard() {
    let rows = 3,
        columns = 3,
        board = [];

    for (i = 0; i < rows; i++) {
        board[i] = []
        for (h = 0; h < columns; h++) {
            board[i].push(cell());
        }
    }
    let getBoard = () => board;

    let cellAvailability = (column, row, value) => {
        if (board[row][column].getValue() !== '') return;
        board[row][column].addValue(value);
    }

    let printBoard = () => {
        let boardWithValues = board.map((rows) => rows.map((cell) => cell.getValue()))
    }

    return { getBoard, printBoard, cellAvailability }
}


function cell() {
    let value = '';

    let addValue = (player) => {
        value = player;
    }

    let getValue = () => {
        return value;
    }

    return { addValue, getValue };
}

function gameController() {
    let board = gameboard();

    let players = [
        {
            value: 'X'
        },
        {
            value: 'O'
        }
    ]

    let activePlayer = players[0];

    let getActivePlayer = () => activePlayer;

    let switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

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
            let row = []
            for (j = 0; j < 3; j++) {
                row.push(board.getBoard()[i][j].getValue())
                if (i === j) {
                    diagonalRowT2R.push(board.getBoard()[i][j].getValue())
                }
                if (i === 3 - j - 1) {
                    diagonalRowT2L.push(board.getBoard()[i][j].getValue())
                }
                if (i === 0) {
                    horizontalCheck1.push(board.getBoard()[i][j].getValue())
                }
                if (i === 1) {
                    horizontalCheck2.push(board.getBoard()[i][j].getValue())
                }
                if (i === 2) {
                    horizontalCheck3.push(board.getBoard()[i][j].getValue())
                }
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

        let winCheck = false;
        for (let i = 0; i < allChecks.length; i++) {
            if (allChecks[i][0] !== '' && allChecks[i].every(val => val === allChecks[i][0])) {
                winCheck = true;
                break;
            }
        }
        switchTurn();
    }

    board.printBoard();

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard
    }
}

function UIController() {
    let boardElement = document.querySelector('.gameboard');
    let game = gameController();

    let updateScreen = () => {
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
            }
            )
        }
        )
    }

    boardElement.addEventListener('click', e => {
        let selectedColumn = e.target.dataset.column;
        let selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    })

    updateScreen();
}

UIController();


/**  */