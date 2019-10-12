var score = 0;
var percent = 0;
var boardX = 44;
var boardY = 11;

var tBody = document.querySelector("tbody");
var scoreCounter = document.querySelector("h2");
var progressBar = document.querySelector("div.progress-bar");

var board = [];

var deBounce = true;

var player = {
    y: 0,
    x: 0
};

//Vectors
var direction = [
    { y: -1, x: 0, valid: false }, //North
    { y: -1, x: 1, valid: false }, //NorthEast
    { y: 0, x: 1, valid: false }, //East
    { y: 1, x: 1, valid: false }, //SouthEast
    { y: 1, x: 0, valid: false }, //South
    { y: 1, x: -1, valid: false }, //SouthWest
    { y: 0, x: -1, valid: false }, //West
    { y: -1, x: -1, valid: false } //NorthWest
];

init();

function init() {
    createSize(boardY, boardX);
    var yVal = Math.floor(Math.random() * board.length);
    var xVal = Math.floor(Math.random() * board[0].length);
    setPlayer(yVal, xVal);
    printBoard(); // for testing can delete later
    setValidMoves();
}

function createSize(rows, cols) {
    for (var r = 0; r < rows; r++) {
        //Creates row
        var row = [];
        for (var c = 0; c < cols; c++) {
            row.push(Math.floor(Math.random() * 9) + 1);
        }
        //Adds row to board array
        board.push(row);
    }
    fillBoard();
}

function fillBoard() {
    for (var i = 0; i < board.length; i++) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.appendChild(document.createTextNode(i + 1));
        tr.appendChild(th);

        for (var j = 0; j < board[0].length; j++) {
            // Create the td:
            var td = document.createElement("td");
            var nodeValue = board[i][j];
            // Set its contents:
            td.appendChild(document.createTextNode(nodeValue));
            //Change color based on number:
            td.style.color = findColor(nodeValue);
            // Add it to the row:
            tr.appendChild(td);
        }
        tBody.appendChild(tr);
    }
}

function setPlayer(yValue, xValue) {
    board[yValue][xValue] = 0;
    player.y = yValue;
    player.x = xValue;
    var node = document.querySelectorAll("td");
    var n = arrayConverter(yValue, xValue);
    node[n].innerHTML = "!";
    node[n].style.color = "Black";
    node[n].style.backgroundColor = "Cornsilk";
    // console.log(player.y);
    // console.log(player.x);
}

function setValidMoves() {
    var gameStatus = true;
    for (let i = 0; i < 8; i++) {
        direction[i].valid = false;
        var xNew = player.x + direction[i].x;
        var yNew = player.y + direction[i].y;
        if (
            yNew >= 0 &&
            xNew >= 0 &&
            xNew < board[0].length &&
            yNew < board.length
        ) {
            var distance = board[yNew][xNew];
            var coordinates = [];
            for (var j = 1; j <= distance; j++) {
                var yyNew = player.y + direction[i].y * j;
                var xxNew = player.x + direction[i].x * j;
                if (
                    yyNew >= 0 &&
                    xxNew >= 0 &&
                    xxNew < board[0].length &&
                    yyNew < board.length
                ) {
                    coordinates.push(yyNew);
                    coordinates.push(xxNew);
                    var check = board[yyNew][xxNew];
                    if (check != -1 && check != undefined && check != 0) {
                        if (j === distance) {
                            direction[i].valid = true;
                            highlight(coordinates);
                            gameStatus = false;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        // console.log(direction[i].valid);
    }
    console.log(gameStatus);
    if (gameStatus) {
        setTimeout(gameOver, 100);
    }
}

function move(dir) {
    var xNew = player.x + direction[dir].x;
    var yNew = player.y + direction[dir].y;
    var distance = board[yNew][xNew];
    score += distance;
    percent = Math.floor(100 * (score / (board[0].length * board.length)));
    var coordinates = [];
    for (var i = 0; i <= distance; i++) {
        var yyNew = player.y + direction[dir].y * i;
        var xxNew = player.x + direction[dir].x * i;
        var check = board[yyNew][xxNew];
        if (check != -1 && check != undefined) {
            board[yyNew][xxNew] = -1;
            coordinates.push(yyNew);
            coordinates.push(xxNew);
            if (i === distance) {
                coordinates.pop();
                coordinates.pop();
                setPlayer(yyNew, xxNew);
                removeNodes(coordinates);
                unHighlight();
                setValidMoves();
                scoreCounter.innerHTML = score * 7;
                // console.log(percent);
                progressBar.innerHTML = percent.toString(10) + "%";
                progressBar.style.width = percent.toString(10) + "%";
            }
        } else {
            throw "Something went wrong error code: 379";
        }
    }
}

function gameOver() {
    alert("Gameover");
}

function highlight(arr) {
    var nodes = document.querySelectorAll("td");
    for (var i = 0; i < arr.length; i += 2) {
        var n = arrayConverter(arr[i], arr[i + 1]);
        nodes[n].classList.remove("inRange");
        nodes[n].classList.add("inRange");
    }
}

function removeNodes(arr) {
    var nodes = document.querySelectorAll("td");
    for (var i = 0; i < arr.length; i += 2) {
        var n = arrayConverter(arr[i], arr[i + 1]);
        nodes[n].classList.add("invisible");
    }
}

function unHighlight() {
    var nodes = document.querySelectorAll(".inRange");
    nodes.forEach(function(node) {
        node.classList.remove("inRange");
    });
}

function arrayConverter(yValue, xValue) {
    var num = yValue * board[0].length + xValue;
    return num;
}

function printBoard() {
    for (var i = 0; i < board.length; i++) {
        var string = "";
        board[i].forEach(function(element) {
            string += element + " ";
        });
        // console.log(string);
    }
}

//Changes colors of the numbers on the grid
function findColor(val) {
    if (val === 1) {
        return "#FF0022";
    } else if (val === 2) {
        return "OrangeRed";
    } else if (val === 3) {
        return "Orange";
    } else if (val === 4) {
        return "Gold";
    } else if (val === 5) {
        return "Green";
    } else if (val === 6) {
        return "MediumSpringGreen";
    } else if (val === 7) {
        return "Aqua";
    } else if (val === 8) {
        return "Violet";
    } else if (val === 9) {
        return "Tan";
    } else {
        return "white";
    }
}

document.addEventListener("keyup", e => {
    if (deBounce) {
        deBounce = false;
        if (e.code === "KeyW" || e.code === "ArrowUp") {
            if (direction[0].valid) {
                move(0);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyE") {
            if (direction[1].valid) {
                move(1);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyD" || e.code === "ArrowRight") {
            if (direction[2].valid) {
                move(2);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyC") {
            if (direction[3].valid) {
                move(3);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyX" || e.code === "ArrowDown") {
            if (direction[4].valid) {
                move(4);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyZ") {
            if (direction[5].valid) {
                move(5);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
            if (direction[6].valid) {
                move(6);
            } else {
                alert("Invalid Move!");
            }
        } else if (e.code === "KeyQ") {
            if (direction[7].valid) {
                move(7);
            } else {
                alert("Invalid Move!");
            }
        } else {
            alert("Wrong Key");
        }
        deBounce = true;
    }
});
