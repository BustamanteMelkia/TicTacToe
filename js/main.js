// VARIABLES
const GRID_SIZE = 3;
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const buttonPlay = document.getElementById('button-play');
const canvas = document.getElementById("canvas");
const inputNameP1 = document.getElementById('name-player1');
const inputNameP2 = document.getElementById('name-player2');
const alert = document.getElementById('alert');

var ctx = canvas.getContext("2d");  // get context 2D
var maxX = canvas.width;
var maxY = canvas.height;
var tamC = 0;
var px, py;
var grid;
var turn;
var counter= 0;

function Player(id, name, color) {
    this.id= id;
    this.name= name;
    this.mark = '';
    this.score = 0;
    this.color = color;
}
var playerOne = new Player(1,"PlayerOne",'#ed8c72');
var playerTwo = new Player(2,"Player two",'#2988bc');

buttonPlay.addEventListener('click', onClickButtonPlay);

inputNameP1.addEventListener('blur', validateData);
inputNameP2.addEventListener('blur', validateData);

// keyup event when player one enters her name
inputNameP1.addEventListener('keyup', function () {
    document.getElementById('tag-player1').innerHTML = this.value;   // update view
    playerOne.name = this.value;
});
// keyup event when player two enters her name.
inputNameP2.addEventListener('keyup', function () {
    document.getElementById('tag-player2').innerHTML = this.value;
    playerTwo.name = this.value;
});

document.getElementById('mark-player1').addEventListener('change', onChangeMark);
document.getElementById('mark-player2').addEventListener('change', onChangeMark);

//  FUNCTIONS 
function onClickButtonPlay() {
    if (dataIsValid()) {
        playerOne.mark = document.getElementById("mark-player1").value;
        playerTwo.mark = document.getElementById("mark-player2").value;
        turn = playerOne;
        menu.style.display = 'none';
        game.style.display = 'block';
        renderGame()
        document.getElementById('home').addEventListener('click',goHome);
        document.getElementById('reset').addEventListener('click',reset);
        document.getElementById('restart').addEventListener('click',restart);
    } else
        document.getElementById('error').innerHTML = 'Empty fields';
}

function validateData() {
    const error = document.getElementById('error');
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

        counter++;
        if(counter>=5){
            if(existsWinner()){
                showMessage("WINNER: "+turn.name);
                alert.addEventListener('click',function(){
                    this.style.display = 'none';
                    restart();
                });
                updateScore();
            }else if(counter == 9 ){
                showMessage('EMPATE');
                alert.addEventListener('click',function(){
                    this.style.display = 'none';
                    restart()
                });
            }
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
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
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
function showMessage(message){
    let alertMessage = document.getElementById('alert-message');
    alert.style.display = 'flex';
    alertMessage.innerHTML = message;
}

function updateScore(){
    turn.score += 10;
    let score = document.getElementById('score-p'+turn.id);
    score.innerHTML = turn.score
}

function tache() {
    ctx.beginPath();
    ctx.strokeStyle = turn.color;
    ctx.lineWidth = 5;

    ctx.moveTo((px * tamC) + (tamC * .2), ((py + 1) * tamC) - (tamC * .2));         /*    /    */
    ctx.lineTo(((px + 1) * tamC) - (tamC * .2), ((py) * tamC) + (tamC * .2));       /*   /     */

    ctx.moveTo((px * tamC) + (tamC * .2), ((py) * tamC) + (tamC * .2));             /*   \    */
    ctx.lineTo(((px + 1) * tamC) - (tamC * .2), ((py + 1) * tamC) - (tamC * .2));   /*    \    */

    ctx.stroke();
}

function circulo() {
    ctx.beginPath();
    ctx.strokeStyle = turn.color;
    ctx.lineWidth = 5;

    ctx.arc((px * tamC) + (tamC * .5), (py * tamC) + (tamC * .5), tamC * .32, 0, 2 * Math.PI);
    ctx.stroke();
}
function existsWinner() { 
    if(horizontal()){
        horizontalLine()
        return true;
    }else if(vertical()){
        verticalLine();
        return true;
    }else if(Math.abs(px-py) != 1){
        if(primaryDiagonal()){
            diagonalLine('primary');
            return true;
        }else if(secundaryDiagonal()){
            diagonalLine('secundary');
            return true;
        }
    }
    return false;
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

function horizontalLine(){
    ctx.beginPath();
    ctx.moveTo(0, (py*tamC) + (tamC/2));
    ctx.lineTo(canvas.width, (py*tamC) + (tamC/2));
    ctx.stroke();
}
function verticalLine(){
    ctx.beginPath();
    ctx.moveTo((px*tamC) + (tamC/2),0);
    ctx.lineTo((px*tamC) + (tamC/2), canvas.width);
    ctx.stroke();
}
function diagonalLine(type){
    ctx.beginPath();
    switch(type){
        case 'primary':
            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width,canvas.width);
        break;
        case 'secundary':
            ctx.moveTo(0,canvas.width);
            ctx.lineTo(canvas.width, 0);
        break;
    }
    ctx.stroke();
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
    document.getElementById('tag-player1').innerHTML = "";
    document.getElementById('tag-player2').innerHTML = "";
    inputNameP1.value="";
    inputNameP2.value="";
    menu.style.display = 'block';
    game.style.display = 'none';
}
function reset(){
    document.getElementById('score-p1').innerHTML= '0';
    document.getElementById('score-p2').innerHTML= '0';
    playerOne.score = 0;
    playerTwo.score = 0;
}