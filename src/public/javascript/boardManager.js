
const board_size = 8;
const board_player_rows = 3;

// the matrix of html squares (each of which is a div)
var squares = [];

// Creates the piece initially found at the given position on the board
function newDefaultPiece(r, c) {
    if ((c + r) % 2 == 1) {
        // we're on an odd board square
        return null;
        
    } else if (r < board_player_rows) {
        // player 0 side
        return {"player": 0, "king": false};
        
    } else if (r >= board_size - board_player_rows) {
        // player 1 side
        return {"player": 1, "king": false};
        
    } else {
        // in the middle
        return null;
    }
}

// Creates a bard object with the default initial configuration
function newBoard() {
    var board = [];
    for (var r = 0; r < board_size; r++) {
        
        // build up a row of the board
        var row = [];
        for (var c = 0; c < board_size; c++) {
            row.push(newDefaultPiece(r, c));
        }
        
        board.push(row);
    }
    
    return board;
}

// Returns the parity of the given position as a string
function getParityString(r, c) {
    if ((r + c) % 2 === 0) {
        return "even";
    } else {
        return "odd";
    }
}

// Returns the address of the image representing the given piece
function getPieceImage(piece) {
    return "images/"
        + (piece.king ? "king" : "piece")
        + (piece.player === 0 ? "0" : "1")
        + ".png";
}

// Builds the HTML for the board object
function buildBoard() {
    var board_elem = document.getElementById("board");
    
    // create a row
    for (var r = 0; r < board_size; r++) {
        var row_elem = document.createElement("div");
        var row = [];
        
        // create a square
        for (var c = 0; c < board_size; c++) {
            var square_elem = document.createElement("div");
            row.push(square_elem);
            
            square_elem.setAttribute("onclick", "clickSquare(" + r + "," + c + ")");
            square_elem.classList.add("square");
            square_elem.classList.add(getParityString(r, c));
            row_elem.appendChild(square_elem);
        }
        
        // add row element to board element
        row_elem.classList.add("row");
        board_elem.appendChild(row_elem);
        
        // add squares to list
        squares.push(row);
    }
}

function swapPieces(r0, c0, r1, c1) {
    var s0 = squares[r0][c0];
    var s1 = squares[r1][c1];
    
    var temp = s0.innerHTML;
    s0.innerHTML = s1.innerHTML;
    s1.innerHTML = temp;
}

function drawPieces(board) {
    for (var r = 0; r < board_size; r++) {
        for (var c = 0; c < board_size; c++) {
            var square_elem = squares[r][c];
            
            // clear all children
            square_elem.innerHTML = "";
            
            // set the piece
            var piece = board[r][c];
            if (piece !== null) {
                var piece_elem = document.createElement("img");
                piece_elem.setAttribute("src", getPieceImage(piece))
                piece_elem.setAttribute("width", "100%");
                piece_elem.setAttribute("height", "auto");
                square_elem.appendChild(piece_elem);
            }
        }
    }
}

var selected = null;
var last_r = 0;
var last_c = 0;

function clickSquare(r, c) {
    if ((r + c) % 2 == 0) {
        
        if (selected === null) {
            // we haven't selected a square yet
            // select the one we clicked
            last_r = r;
            last_c = c;
            selected = squares[r][c];
            selected.classList.add("selected");
        } else {
            // we have selected a square
            // swap the selected one with this one
            swapPieces(last_r, last_c, r, c);
            selected.classList.remove("selected");
            selected = null;
        }
    }
}

// build the board HTML
buildBoard();

// create a new board and draw the pieces
drawPieces(newBoard());
