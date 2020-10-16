// VARIABLES
const menu = document.querySelector('#menu');
const game = document.querySelector('#game');
const buttonPlay = document.querySelector('#button-play');
const GRID_SIZE = 3;
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");  // get context 2D
let maxX = canvas.width;
let maxY = canvas.height;
let tamC = 0;
let px, py;
let grid;

let turn;
let marksColor = new Map();
marksColor.set('X', '#ed8c72');
marksColor.set('O', '#2988bc')

function Player(id, name) {
    this.id= id;
    this.name= name;
    this.mark = '';
    this.score = 0;
    this.colorMark = function (){
        return marksColor.get(this.mark);
    }
}
let playerOne = new Player(1,"PlayerOne");
let playerTwo = new Player(2,"Player two");

buttonPlay.addEventListener('click', onClickButtonPlay);

document.querySelector('#name-player1').addEventListener('blur', validateData);
document.querySelector('#name-player2').addEventListener('blur', validateData);

// keyup event when player one enters her name
document.querySelector('#name-player1').addEventListener('keyup', function () {
    document.querySelector('#tag-player1').innerHTML = this.value;   // update view
    playerOne.name = this.value;
});
// keyup event when player two enters her name.
document.querySelector('#name-player2').addEventListener('keyup', function () {
    document.querySelector('#tag-player2').innerHTML = this.value;
    playerTwo.name = this.value;
});

document.querySelector('#mark-player1').addEventListener('change', onChangeMark);
document.querySelector('#mark-player2').addEventListener('change', onChangeMark);

//  FUNCTIONS 
function onClickButtonPlay() {
    if (dataIsValid()) {
        playerOne.mark = document.getElementById("mark-player1").value;
        playerTwo.mark = document.getElementById("mark-player2").value;
        turn = playerOne
        menu.style.display = 'none';
        game.style.display = 'block';
        renderGame()
    } else
        document.querySelector('#error').innerHTML = 'Empty fields';
}

function validateData() {
    const error = document.querySelector('#error');
    if (this.value == '') {
        error.innerHTML = 'Empty field!';
        this.style.borderColor = 'red'
    } else {
        this.style.borderColor = '#555555';
        if (dataIsValid())
            error.innerHTML = '';
    }
}
function onChangeMark() {
    let nextMark = nextPlayerMark(this.id);
    if (this.value === 'X')
        document.getElementById(nextMark).value = 'O';
    else
        document.getElementById(nextMark).value = 'X';
}

function dataIsValid() {
    return (playerOne.name != '' && playerTwo.name != '') ? true : false
}

function nextPlayerMark(currentId) {
    return currentId == 'mark-player1' ? 'mark-player2' : 'mark-player1'
}

function renderGame() {
    document.querySelector('#player1').innerHTML = playerOne.name;
    document.querySelector('#player2').innerHTML = playerTwo.name;
    drawBoard();
    setTurn();
    canvas.addEventListener('click',onClickCanvas)
}

function setTurn(){
    const currentMark = document.getElementById('mark');
    const active = document.getElementById('active-p'+turn.id);
    currentMark.innerHTML = turn.mark;
    currentMark.style.color = turn.colorMark();
    active.style.backgroundColor = turn.colorMark()
}

function getCoords(event) {
    let x = new Number();
    let y = new Number();

    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    return { x, y }
}


function onClickCanvas() {
    let coords = getCoords(event);
    px = Math.trunc(coords.x / tamC);
    py = Math.trunc(coords.y / tamC);

    if(grid[px][py] == ""){
        grid[px][py] = turn.mark;
        drawMark(turn.mark)
        if(turn.id == 1)
            turn = playerTwo
        else
            turn = playerOne
        setTurn()
    }
}
function drawMark(mark){
    switch(mark){
        case 'X': tache()
        break
        case 'O': circulo()
        break;
    }
}

function drawBoard() {
    tamC = Math.round(maxX / GRID_SIZE);
    for (let i = 1; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tamC, 0);
        ctx.lineTo(i * tamC, maxY);
        ctx.moveTo(0, i * tamC);
        ctx.lineTo(maxX, i * tamC);
        ctx.stroke();
    }
    grid = new Array(GRID_SIZE);
    for (var i = 0; i < GRID_SIZE; i++) {
        grid[i] = new Array(GRID_SIZE);
        for (var j = 0; j < GRID_SIZE; j++)
            grid[i][j] = "";
    }
}
function tache() {
    ctx.beginPath();

    ctx.moveTo((px * tamC) + (tamC * .1), ((py + 1) * tamC) - (tamC * .1));         /*    /    */
    ctx.lineTo(((px + 1) * tamC) - (tamC * .1), ((py) * tamC) + (tamC * .1));       /*   /     */

    ctx.moveTo((px * tamC) + (tamC * .1), ((py) * tamC) + (tamC * .1));             /*   \    */
    ctx.lineTo(((px + 1) * tamC) - (tamC * .1), ((py + 1) * tamC) - (tamC * .1));   /*    \    */

    ctx.stroke();
}

function circulo() {
    ctx.beginPath();
    ctx.arc((px * tamC) + (tamC * .5), (py * tamC) + (tamC * .5), tamC * .4, 0, 2 * Math.PI);
    ctx.stroke();
}
function verifica() { }
function reiniciar() { }
function ganar() { }
function perder() { }
