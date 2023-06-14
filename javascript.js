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
        let cellsAvailable = board.filter(row => row[column].getValue() === '').map(row => row[column]);

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

    let getValue = () => value;

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

    let playRound = (row, column) => {
        board.cellAvailability(column,row, getActivePlayer().value)
    }

    board.printBoard();

    return { getActivePlayer, playRound }
}

function UIController() {
    let gBoard = gameboard();
    let board = gBoard.getBoard();
    let boardElement = document.querySelector('.gameboard');
    let game = gameController();
    
    let updateScreen = () => {
        boardElement.textContent = '';
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let cellElement = document.createElement('button');
                cellElement.classList.add('cell');
                boardElement.appendChild(cellElement);
                cellElement.innerHTML = cell.getValue();
                cellElement.dataset.column = colIndex;
                cellElement.dataset.row = rowIndex;
            }
            )
        }
        )
    }

    boardElement.addEventListener('click' , e => {
        let selectedColumn = e.target.dataset.column;
        let selectedRow = e.target.dataset.row;

        if(!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    })

    updateScreen();
}

UIController();