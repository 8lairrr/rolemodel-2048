let board;
let score = 0;
let lostGame = false;
const columns = 4;
const rows = 4;
const albums = [
    {level: "1", path: "images/girl-in-new-york.svg"},
    {level: "2", path: "images/minimal.svg"},
    {level: "3", path: "images/oh-how-perfect.svg"},
    {level: "4", path: "images/notice-me-acoustic.svg"},
    {level: "5", path: "images/our-little-angel.svg"},
    {level: "6", path: "images/death-wish.svg"},
    {level: "7", path: "images/rx.svg"},
    {level: "8", path: "images/cross-your-mind.svg"},
    {level: "9", path: "images/a-little-more-time.svg"},
    {level: "10", path: "images/kansas-anymore.svg"},
    {level: "11", path: "images/kansas-anymore-deluxe.svg"}
]

window.onload = function() {
    generateBoard();
    updateLevel(); //for tile guide
    document.getElementById("new-game").addEventListener("click", newGame); //new game button
}

function newGame() {
    score = 0;
    lostGame = false;

    const gameBoard = document.getElementById("game-board"); //clear board in DOM
    gameBoard.innerHTML = ""; //remove existing tiles
    generateBoard(); //recreate the board
    document.getElementById("score").innerText = score; //reset score in HTML
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
    if (!hasEmptyTile()) {
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
            const album = valueClassifier(value); 
            tile.style.backgroundImage = `url("images/${album}.svg")`;
            open = true; //exit while loop
        }
    }
}

//interprets values from the board into album names for use when assigning classes
function valueClassifier(value) {
    switch(value) {
        case 2:
            return "girl-in-new-york";

        case 4:
            return "minimal";

        case 8:
            return "oh-how-perfect";

        case 16:
            return "notice-me-acoustic";

        case 32:
            return "our-little-angel";

        case 64:
            return "death-wish";

        case 128:
            return "rx";

        case 256:
            return "cross-your-mind";

        case 512:
            return "a-little-more-time";

        case 1024:
            return "kansas-anymore";

        case 2048:
            return "kansas-anymore-deluxe";
        
        default:
            return null;
    }
}

function updateTile(tile, value) {
    tile.classList.value = ""; //reset classes
    tile.classList.add("tile");

    tile.style.backgroundImage = ""; //clear old background
    tile.style.backgroundSize = "cover" //fit background

    if (value > 0) {
        const album = valueClassifier(value);
        if (album) {
            if (value >= 2048) {
                tile.style.backgroundImage = `url("images/kansas-anymore-deluxe.svg")`;
            } else {
                tile.style.backgroundImage = `url("images/${album}.svg")`;
            }
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

let currentIndex = 0;

document.getElementById('skip-back').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateLevel();
    }
});

document.getElementById('skip-next').addEventListener('click', () => {
    if (currentIndex < albums.length - 1) {
        currentIndex++;
        updateLevel();
    }
});

function updateLevel() {
    const currentLevel = albums[currentIndex].level;
    const currentImagePath = albums[currentIndex].path;
    document.getElementById("level-num").innerText = currentLevel;
    document.getElementById("button-level").innerText = currentLevel;
    document.getElementById("level-image").style.backgroundImage = `url(${currentImagePath})`;
    const percent = (currentIndex / (albums.length - 1)) * 100;
    document.getElementById("progress-fill").style.width = `${percent}%`;
}
