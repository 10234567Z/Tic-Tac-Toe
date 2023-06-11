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

    let printBoard = () => {
        let boardWithValues = board.map((rows) => rows.map((cell) => cell.getValue()))
    }

    return { getBoard, printBoard }
}


function cell() {
    let value = '';

    let addValue = (player) => {
        value = player;
    }

    let getValue = () => value;

    return { addValue, getValue };
}


function UIController() {
    let gBoard = gameboard();
    let board = gBoard.getBoard();
    let boardElement = document.querySelector('.gameboard');

    let updateScreen = () => {
        board.forEach(row => row.forEach((cell, index) => {
            let cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            boardElement.appendChild(cellElement);
        }))
    }


    updateScreen();
}

UIController();