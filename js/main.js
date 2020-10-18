// VARIABLES
const GRID_SIZE = 3;
const menu = document.querySelector('#menu');
const game = document.querySelector('#game');
const buttonPlay = document.querySelector('#button-play');
const canvas = document.getElementById("canvas");
const inputNameP1 = document.querySelector('#name-player1');
const inputNameP2 = document.querySelector('#name-player2');

let ctx = canvas.getContext("2d");  // get context 2D
let maxX = canvas.width;
let maxY = canvas.height;
let tamC = 0;
let px, py;
let grid;
let turn;
let counter= 0;

function Player(id, name, color) {
    this.id= id;
    this.name= name;
    this.mark = '';
    this.score = 0;
    this.color = color;
}
let playerOne = new Player(1,"PlayerOne",'#ed8c72');
let playerTwo = new Player(2,"Player two",'#2988bc');

buttonPlay.addEventListener('click', onClickButtonPlay);

inputNameP1.addEventListener('blur', validateData);
inputNameP2.addEventListener('blur', validateData);

// keyup event when player one enters her name
inputNameP1.addEventListener('keyup', function () {
    document.querySelector('#tag-player1').innerHTML = this.value;   // update view
    playerOne.name = this.value;
});
// keyup event when player two enters her name.
inputNameP2.addEventListener('keyup', function () {
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
        document.getElementById('restart').addEventListener('click',restart);
        document.getElementById('home').addEventListener('click',goHome);
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
    return (inputNameP1.value != '' && inputNameP2.value != '') ? true : false
}

function nextPlayerMark(currentId) {
    return currentId == 'mark-player1' ? 'mark-player2' : 'mark-player1'
}

function renderGame() {
    document.getElementById('player1').innerHTML = playerOne.name;
    document.getElementById('player2').innerHTML = playerTwo.name;
    document.getElementById('score-p1').innerHTML = '0';
    document.getElementById('score-p2').innerHTML = '0';
    drawBoard();
    setTurn();
    canvas.addEventListener('click',onClickCanvas)
}

function setTurn(){
    const currentPlayer = document.getElementById('current-player');
    currentPlayer.innerHTML = turn.name
    currentPlayer.style.color = turn.color;
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

    if(grid[py][px] == ""){
        drawMark(turn.mark)
        // get next turn
        counter++;
        if(counter>=5)
            if(existsWinner()){
                alert("WINNER: "+turn.name)
                updateScore();
                restart()
            }
        turn = turn.id== 1 ? playerTwo : playerOne 
        setTurn()
    }
}
function drawMark(mark){
    grid[py][px] = mark;
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

function updateScore(){
    turn.score += 10;
    let score = document.getElementById('score-p'+turn.id);
    score.innerHTML = turn.score
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
function existsWinner() { 
    if(horizontal())    return true;
    else if(vertical()) return true;
    else if(Math.abs(px-py) != 1){
        if(primaryDiagonal())   return true;
        else if(secundaryDiagonal())    return true;
    }
}
function horizontal(){
    let markCounter = 0;
    for(let i=0; i<GRID_SIZE;i++)
        if(grid[py][i]== turn.mark)
            markCounter++;
    return markCounter==GRID_SIZE ? true : false; 
}
function vertical(){
    let markCounter = 0;
    for(let i=0; i<GRID_SIZE;i++)
        if(grid[i][px]== turn.mark)
            markCounter++;
    return markCounter==GRID_SIZE ? true : false; 
}
function primaryDiagonal(){
    let markCounter= 0;
    for(let i=0; i<GRID_SIZE;i++)
        if(grid[i][i]==turn.mark)
            markCounter++
    return markCounter==GRID_SIZE ? true : false; 
}
function secundaryDiagonal(){
    let markCounter= 0;
    let index = GRID_SIZE-1;
    for(let i=0; i< GRID_SIZE; i++){
        if(grid[i][index]==turn.mark)
            markCounter++;
        index--;
    }
    return markCounter==GRID_SIZE ? true : false; 
}

function restart(){
    counter = 0;
    ctx.clearRect(0, 0, maxX, maxY); // clear canvas
    drawBoard();
}

function goHome(){
    counter=0;
    ctx.clearRect(0, 0, maxX, maxY); // clear canvas
    playerOne = new Player(1,"PlayerOne",'#ed8c72');
    playerTwo = new Player(2,"Player two",'#2988bc');
    turn=playerOne;
    document.querySelector('#tag-player1').innerHTML = "";
    document.querySelector('#tag-player2').innerHTML = "";
    inputNameP1.value="";
    inputNameP2.value="";
    menu.style.display = 'block';
    game.style.display = 'none';
}