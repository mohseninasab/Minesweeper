// Global Variable ############################################################################
var tableData = []; // this array contains all the tables object that we need during the Game.
var bombData = []; // this arrray Contain all bombs location in "tableData[]".
var gameEnd = false; // this variable shows that when the game has finished.
var winRecord = 0;  // hold the number of victories
var loseRecord = 0; // hold the number of lost games.
var flag = 0;   // it holds all the flags you have at the moment
var bombNumber = 10; 
var level = 1;
var clock = 80;
//#############################################################################################

window.onload = function () {
    createTableData();
    declareNeighbor();
    randomBomb();
    generateTable();
    getLocation();
    markdown();
    updateDemo();
    //console.log("tableData-->", tableData, bombData);
}
//#############################################################################################
// this function will clear all the givin array Data. "in order to start a new set"
//#############################################################################################
function clear(input) {
    var i, length = input.length;
    for (i = 0; i < length; i++) {
        input.pop();
    }
}
//#############################################################################################
// this functon clear and reset all the data and style to start a new game.
//#############################################################################################

function newGame() {
    clear(tableData);
    clear(bombData);
    createTableData();
    declareNeighbor();
    randomBomb();
    generateTable();
    getLocation();
    updateDemo();
    markdown();
    gameEnd = false;
    document.getElementById("tBoard").className = "tableBoard";

    if(bombNumber === 40){
        alert("you reach to the max number of bomb.\n if you win your the man !");
    }

    //console.log("tableData-->", tableData, bombData);
    //console.log("win: (", winRecord, ") - lose: (", loseRecord, ")");

}
//#############################################################################################
// this function create an array of object containing defult data .
//#############################################################################################
function createTableData() {
    var i;
    for (i = 0; i < 100; i++) {
        tableData.push({
            north: -1,
            northEast: -1,
            northWest: -1,
            south: -1,
            southEast: -1,
            southWest: -1,
            east: -1,
            west: -1,
            nearBomb: 0,
            bomb: false,
            checked: false,
            clickable: true,
            position: {
                row: 0,
                cell: 0
            }
        });
    }
}
//#############################################################################################
// this function will calculates all the neighbors around each Cell and stores it in the cells
// property
//#############################################################################################
function declareNeighbor() {
    var i, nw, n, ne, e, se, s, sw, w;
    var lenght = tableData.length;
    for (i = 0; i < lenght; i++) {

        nw = i - 11;     //North West  
        n = i - 10;      //North
        ne = i - 9;      //Nort East
        e = i + 1;       //East
        se = i + 11;     //South East
        s = i + 10;      //South
        sw = i + 9;      //South West 
        w = i - 1;       //west

        // when the cell is in top left corner of table.
        if (i === 0) {
            tableData[i].east = e;
            tableData[i].southEast = se;
            tableData[i].south = s;
        }
        //when the table is in top of table .
        else if (i > 0 && i < 9) {
            tableData[i].east = e;
            tableData[i].southEast = se;
            tableData[i].south = s;
            tableData[i].southWest = sw;
            tableData[i].west = w;
        }
        // when the cell is in top Right corner of table.
        else if (i === 9) {
            tableData[i].south = s;
            tableData[i].southWest = sw;
            tableData[i].west = w;
        }
        //when the cell is on the right side of table. 
        else if ((i % 10) === 9 && i != 9 && i != 99) {
            tableData[i].south = s;
            tableData[i].southWest = sw;
            tableData[i].west = w;
            tableData[i].northWest = nw;
            tableData[i].north = n;
        }
        // when the cell is in bottom Right corner of table.
        else if (i === 99) {
            tableData[i].west = w;
            tableData[i].northWest = nw;
            tableData[i].north = n;
        }
        // when table is at the bottom of table.
        else if ((i % 90) > 0 && (i % 90) < 9) {
            tableData[i].west = w;
            tableData[i].northWest = nw;
            tableData[i].north = n;
            tableData[i].northEast = ne;
            tableData[i].east = e;
        }
        // when the cell is in bottom left corner of table.
        else if (i === 90) {
            tableData[i].north = n;
            tableData[i].northEast = ne;
            tableData[i].east = e;
        }
        //when the cell is on the right side of table.
        else if ((i % 10) === 0 && i != 0 && i != 90) {
            tableData[i].north = n;
            tableData[i].northEast = ne;
            tableData[i].east = e;
            tableData[i].southEast = se;
            tableData[i].south = s;
        }
        // all the cell in the middle
        else {
            tableData[i].northWest = nw;
            tableData[i].north = n;
            tableData[i].northEast = ne;
            tableData[i].east = e;
            tableData[i].southEast = se;
            tableData[i].south = s;
            tableData[i].southWest = sw;
            tableData[i].west = w;
        }
    }
}
//#############################################################################################
//This Function generate random bomb number .and stor it in the "bombData[]" and "tableData[]" 
//#############################################################################################
function randomBomb() {
    flag = 0;
    var i;
    var answer;
    var bombNo;
    while (bombData.length < bombNumber) {
        bombNo = parseInt((Math.random() * 100) - 1);
        answer = checkBomb(bombNo);
        if (answer === false) {
            tableData[bombNo].bomb = true; // make the bomb property true 
            bombData.push(bombNo); //push bomb number in the array
            WarningSign(bombNo); // call the mention function to add number around the bomb cell
            flag++;
        }
    }
    return;
}
//#############################################################################################
//this function check if the random number has been use before or not .
//#############################################################################################

function checkBomb(input) {
    var i;
    for (i = 0; i < bombData.length; i++) {
        if (input === bombData[i]) {
            return true;
        }
    }
    return false;
}
//#############################################################################################
// increase the number of "nearbomb" property of all neighbor.
//#############################################################################################
function WarningSign(input) {
    var nw, n, ne, e, se, s, sw, w;
    nw = tableData[input].northWest;
    n = tableData[input].north;
    ne = tableData[input].northEast;
    e = tableData[input].east;
    se = tableData[input].southEast;
    s = tableData[input].south;
    sw = tableData[input].southWest
    w = tableData[input].west;

    if (nw != -1) {
        tableData[nw].nearBomb += 1;
    }
    if (n != -1) {
        tableData[n].nearBomb += 1;
    }
    if (ne != -1) {
        tableData[ne].nearBomb += 1;
    }
    if (e != -1) {
        tableData[e].nearBomb += 1;
    }
    if (se != -1) {
        tableData[se].nearBomb += 1;
    }
    if (s != -1) {
        tableData[s].nearBomb += 1;
    }
    if (sw != -1) {
        tableData[sw].nearBomb += 1;
    }
    if (w != -1) {
        tableData[w].nearBomb += 1;
    }
}
//#############################################################################################
//this function generate the all table and restore the position of each tables cells in its 
//object
//#############################################################################################

function generateTable() {
    var table = document.getElementById("tableFrame");
    var colorCode = ["code_0", "code_1"]
    var i, j, k = 0, temp;
    var row, cell;

    table.innerHTML = "";

    for (i = 0; i < 10; i++) {
        row = table.insertRow(i);

        for (j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            tableData[k].position.row = i;
            tableData[k].position.cell = j;
            table.rows[i].cells[j].className = "tCell";

            // this pice of code will  show you all the bomb in table if you want to cheat

            // if (tableData[i * 10 + j].bomb === true) {         
            //     table.rows[i].cells[j].className = "bomb";       
            // }                                                     
            k++;
        }
    }
}
//######[ click on every tables cell ]#########################################################
// this function executes when the user click on each cell an then send the cell number to 
// "checkRoom()" function .
//#############################################################################################
function getLocation(event) {
    $('td').click(function () {
        var result;
        var table = document.getElementById("tableFrame");
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());
        var position = (row * 10) + col;
        if (gameEnd === true) {
            return;
        }

        if (tableData[position].clickable === false) {
            table.rows[row].cells[col].className = "";
            tableData[position].clickable = true;
            flag++;
            updateDemo();
            return;
        }

        if (gameEnd === false) {
            checkRoom(position, false);
            result = checkForWin();

            if (result === true) {
                alert(" You Win The Game ");
                winRecord++;
                if(bombNumber <= 39){
                    bombNumber++;
                }
                updateDemo();
                gameEnd = true;
            }
        }
    });
}
//#############################################################################################
// this function is the main function of the game that checks if the clicked room is bomb or not
// and if it is a empty Room it for all its neighbor call itself and do the same.
//#############################################################################################
function checkRoom(position, echo) {
    var table = document.getElementById("tableFrame");
    var row = tableData[position].position.row;
    var col = tableData[position].position.cell;

    if (position === -1) {
        return;
    }

    if (tableData[position].checked === true || tableData[position].clickable === false) {
        return;
    }

    tableData[position].checked = true;
    //console.log("Position ---> (", position, ")  echo -->", echo);

    if (tableData[position].bomb === true) {
        table.rows[row].cells[col].className = "bomb";
        document.getElementById("tBoard").className += " shakeDemo";
        showAllTable();
        showBombs(-1);
        loseRecord++;
        updateDemo();
        gameEnd = true;
        return;
    }

    if (tableData[position].nearBomb > 0 || echo === true) {
        if ( tableData[position].clickable === true) {
            temp = tableData[position].nearBomb;
            table.rows[row].cells[col].className = "checked";
            if (temp === 1) {
                table.rows[row].cells[col].innerHTML = "<h3 class='roomNumber code_0'>" + temp + "</h3>"
            }
            if (temp > 1 && temp <= 3) {
                table.rows[row].cells[col].innerHTML = "<h3 class='roomNumber code_1'>" + temp + "</h3>"
            }
            if (temp > 3) {
                table.rows[row].cells[col].innerHTML = "<h3 class='roomNumber code_2'>" + temp + "</h3>"
            }
        }
    }

    if (tableData[position].nearBomb === 0 ) {
        //console.log("you Clicked on empty room !!!!");
        table.rows[row].cells[col].className += " checked";
        //checks if the north West room is checked or not
        if (tableData[position].northWest != -1) {
            if (tableData[tableData[position].northWest].checked === false) {
                checkRoom(tableData[position].northWest, true);
            }
        }
        //checks if the north room is checked or not
        if (tableData[position].north != -1) {
            if (tableData[tableData[position].north].checked === false) {
                checkRoom(tableData[position].north, true);
            }
        }
        //checks if the north east room is checked or not
        if (tableData[position].northEast != -1) {
            if (tableData[tableData[position].northEast].checked === false) {
                checkRoom(tableData[position].northEast, true);
            }
        }
        //checks if the east room is checked or not
        if (tableData[position].east != -1) {
            if (tableData[tableData[position].east].checked === false) {
                checkRoom(tableData[position].east, true);
            }
        }
        //checks if the south West room is checked or not
        if (tableData[position].southEast != -1) {
            if (tableData[tableData[position].southEast].checked === false) {
                checkRoom(tableData[position].southEast, true);
            }
        }
        //checks if the  south room is checked or not
        if (tableData[position].south != -1) {
            if (tableData[tableData[position].south].checked === false) {
                checkRoom(tableData[position].south, true);
            }
        }
        //checks if the south West room is checked or not
        if (tableData[position].southWest != -1) {
            if (tableData[tableData[position].southWest].checked === false) {
                checkRoom(tableData[position].southWest, true);
            }
        }
        //checks if the  West room is checked or not
        if (tableData[position].west != -1) {
            if (tableData[tableData[position].west].checked === false) {
                checkRoom(tableData[position].west, true);
            }
        }
    }
}
//#############################################################################################
// if you click on the bomb you will lose the game and this function will show all the Bombs 
//#############################################################################################
function showBombs(locationNo) {
    if (locationNo === -1) {
        locationNo = 0;
    }
    if (locationNo === bombData.length) {
        return;
    }
    var temp = bombData[locationNo];
    var table = document.getElementById("tableFrame");
    var row = tableData[temp].position.row;
    var col = tableData[temp].position.cell;
    table.rows[row].cells[col].className = "bomb";
    locationNo++;
    if(clock > 10){
     clock = clock - 10; 
    }
    setTimeout(showBombs, clock, locationNo);
    return;
}
//#############################################################################################
// at the  end this function display all the rooms.
//#############################################################################################
function showAllTable() {
    var i, row, col;
    var lenght = tableData.length;
    var table = document.getElementById("tableFrame");
    var audio = document.getElementById("myAudio");
    audio.play();

    for (i = 0; i < lenght; i++) {

        row = tableData[i].position.row;
        col = tableData[i].position.cell;

        if (tableData[i].nearBomb === 0) {
            table.rows[row].cells[col].className = "checked";
        }
        if (tableData[i].nearBomb > 0 && tableData[i].bomb === false) {
            var temp = tableData[i].nearBomb;
            table.rows[row].cells[col].className = "checked";

            if (temp === 1) {
                table.rows[row].cells[col].innerHTML = "<h3 class='roomNumber code_0'>" + temp + "</h3>"
            }
            if (temp > 1 && temp <= 3) {
                table.rows[row].cells[col].innerHTML = "<h3 class='roomNumber code_1'>" + temp + "</h3>"
            }
            if (temp > 3) {
                table.rows[row].cells[col].innerHTML = "<h3 class='roomNumber code_2'>" + temp + "</h3>"
            }
        }
    }
}
//#############################################################################################
// every time you click on a room and if its not a bomb it will check if you are done or not
//#############################################################################################
function checkForWin() {
    var i;
    var lenght = tableData.length;
    for (i = 0; i < lenght; i++) {
        if (tableData[i].checked === false && tableData[i].bomb === false) {
            return false;
        }
    }
    return true;
}
//#############################################################################################
//this function will mark a flag on every room if right click on it 
//#############################################################################################
function markdown() {
    $('td').contextmenu(function () {
        if (gameEnd === true) {
            return;
        }
        var table = document.getElementById("tableFrame");
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());
        var position = (row * 10) + col;
        if (flag > 0 && tableData[position].checked === false && tableData[position].clickable === true) {
            tableData[position].clickable = false;
            table.rows[row].cells[col].className = "flag";
            flag--;
            updateDemo();
        }
        return false;
    });
}
//#############################################################################################
// this function will update all the demos to the new values of variable.
//#############################################################################################
function updateDemo() {
    document.getElementById("bombDemo").innerHTML = flag;
    document.getElementById("winDemo").innerHTML = winRecord;
    document.getElementById("loseDemo").innerHTML = loseRecord;
}
