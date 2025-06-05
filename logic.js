let board;
let score = 0;
let lostGame = false;
const columns = 4;
const rows = 4;

window.onload = function() {
    generateBoard();
}

function generateBoard() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let i = 0; i < 2; i++) { //add a 2 tile in 2 random cells to start the game
        let placed = false;
        while (!placed) {
            let randomRow = Math.floor(Math.random() * rows);
            let randomCol = Math.floor(Math.random() * columns);
            if (board[randomRow][randomCol] === 0) {
                board[randomRow][randomCol] = 2;
                placed = true;
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div"); //making tile div
            tile.id = r.toString() + "-" + c.toString(); //assigning div to id of "row-column"
            let value = board[r][c];
            updateTile(tile, value);
            document.getElementById("game-board").append(tile);
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function valueProbability() {
    let value;
    random = Math.random();

    if (random > 0.96) { //90% chance of returning a "2" tile
        value = 8;
    } else if (random >= 0.9 && random <= 0.95) {
        value = 4;
    } else {
        value = 2;
    }
    return value;
}

function populateTiles() {
    if (!hasEmptyTile) {
        return; //break out of function if board is full
    }

    let open = false; //boolean to indicate if theres an open tile thats empty

    while (!open) {
        //get random row and column value
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let value = valueProbability();

        //is cell empty?
        if (board[r][c] == 0) {
            board[r][c] = value; //set board at that r,c to a number from the method
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //update HTML
            tile.innerText = value.toString(); //add text of 2
            tile.classList.add("x2"); //add 2 class
            open = true; //exit while loop
        }
    }
}

//interprets values from the board into album names for use when assigning classes
// function valueClassifier(value) {
//     let classifier;

//     switch(value) {
//         case 2:
//             classifier = "girl-in-new-york";
//             break;

//         case 4:
//             classifier = "minimal";
//             break;

//         case 8:
//             classifier = "oh-how-perfect";
//             break;

//         case 16:
//             classifier = "notice-me-acoustic";
//             break;

//         case 32:
//             classifier = "our-little-angel";
//             break;

//         case 64:
//             classifier = "death-wish";
//             break;

//         case 128:
//             classifier = "rx";
//             break;

//         case 256:
//             classifier = "cross-your-mind";
//             break;

//         case 512:
//             classifier = "a-little-more-time";
//             break;

//         case 1024:
//             classifier = "kansas-anymore";
//             break;

//         case 2048:
//             classifier = "kansas-anymore-deluxe";
//             break;
//     }

//     return classifier;
// }

function updateTile(tile, value) {
    tile.innerText = ""; //reset tile div content
    tile.classList.value = ""; //reset classes
    tile.classList.add("tile");
    if (value > 0) {
        tile.innerText = value;
        if (value <= 1024) {
            tile.classList.add("x" + value.toString())
        } else {
            tile.classList.add("x2048")
        }
    }
}

function filterZeroes(row) {
    return row.filter(num => num != 0);
}

function shift(row) {
    //get rid of zeroes
    row = filterZeroes(row);

    //merge
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i]
        }
    }

    //get rid of zeroes
    row = filterZeroes(row);

    //add zeroes to end
    while (row.length < columns) {
        row.push(0);
    } 

    return row;
}

function shiftLeft() {
    for (let r = 0; r < rows; r++) { // shift each row
        let row = board[r];
        row = shift(row);
        board[r] = row //update JS board

        //update HTML board
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let value = board[r][c];
            updateTile(tile, value);
        }
    }
}

function shiftRight() {
    for (let r = 0; r < rows; r++) { // shift each row
        let row = board[r];
        row.reverse(); //reverse row
        row = shift(row);
        row.reverse(); //reverse row
        board[r] = row //update JS board

        for (let c = 0; c < columns; c++) { //update HTML board
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let value = board[r][c];
            updateTile(tile, value);
        }
    }
}

function shiftUp() {
    for (let c = 0; c < columns; c++) { //shift each column
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] //make row out of column
        row = shift(row); //shift "row"
        
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r] //update JS board 

            //update HTML board
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let value = board[r][c];
            updateTile(tile, value);
        }

    }
}

function shiftDown() {
    for (let c = 0; c < columns; c++) { //shift each column
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] //make row out of column
        row.reverse(row); //reverse "row"
        row = shift(row); //shift "row"
        row.reverse(row); //reverse "row"
        
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r] //update JS board 

            //update HTML board
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let value = board[r][c];
            updateTile(tile, value);
        }

    }
}

document.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        e.preventDefault(); // stop page from scrolling with arrow keys

        if (e.code === "ArrowLeft") {
            shiftLeft();
            populateTiles();
        } else if (e.code === "ArrowRight") {
            shiftRight();
            populateTiles();
        } else if (e.code === "ArrowUp") {
            shiftUp();
            populateTiles();
        } else if (e.code === "ArrowDown") {
            shiftDown();
            populateTiles();
        }

        document.getElementById("score").innerText = score; // update score
    }
});
