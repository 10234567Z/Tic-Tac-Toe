function gameboard() {
    let rows = 3,
        columns = 3;
    board = [];

    for (i = 0; i < rows; i++) {
        board[i] = []
        for (h = 0; h < columns; h++) {
            board[i].push(cell());
        }
    }
    let getBoard = () => board;

    let cellAvailability = (column, row, value) => {
        let cellsAvailable = board.filter(rows => rows[column].getValue() === '').map(rows => rows[column]);

        if (!cellsAvailable.length) return;
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
                cellElement.classList.add('cell');
                boardElement.appendChild(cellElement);
                cellElement.textContent = cellValue.getValue();
                cellElement.dataset.column = colIndex;
                cellElement.dataset.row = rowIndex;
                console.log(cellValue.getValue());
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