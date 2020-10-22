// VARIABLES
const GRID_SIZE = 6;
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
var px= 0;
let py= 0;
var counter = 0
var grid;
var turn;

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

// Obtiene la posición en la matriz donde se dibujará la marca
function getCoords(event) {
    let x = event.x - canvas.offsetLeft;
    let i = 0;
    let j = Math.trunc(x / tamC);
    // Buscar el espacio más bajo de la columna
    for(i=GRID_SIZE-1; i>0;i--)
        if(grid[i][j] == "")
            break;
    return { i, j }
}

function onClickCanvas() {
    let coords = getCoords(event);
    px = coords.j;
    py = coords.i;

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
            }else if(counter == GRID_SIZE*GRID_SIZE ){
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
    alertMessage.innerHTML =message;
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
    if(horizontal())    return true;
    else if(vertical()) return true;
    else {
        if(primaryDiagonal())   return true;
        else if(secundaryDiagonal())    return true;
    }
    return false;
}
function horizontal(){
    let min = px-3;
    let max = px+3;
    let markCounter = 0;

    if(min<0)   min=0;
    if(max>=GRID_SIZE)  max= GRID_SIZE-1;

    // console.log("horizontal; "+min," ",max);
    
    for(let j=min; j<=max;j++){
        if(grid[py][j]== turn.mark)
            markCounter++;
        else
            markCounter=0;
        if(markCounter==4)
            return true;
    }
    return false; 
}
function vertical(){
    let max = py+3;
    let markCounter = 0;
    if(max>=GRID_SIZE)  max= GRID_SIZE-1;

    // console.log("Vertical: "+py," ",max);

    for(let i=py; i<GRID_SIZE;i++){
        if(grid[i][px]== turn.mark)
            markCounter++;
        else
            markCounter=0;
        if(markCounter==4)
            return true;
    }
    return false;
}
function primaryDiagonal(){
    let minX = px-3;
    let maxX = px+3;
    let minY = py-3;
    let maxY = py+3;
    let markCounter = 0;

    if(minX<0)   minX=0;
    if(minY<0)   minY=0;

    if(maxX>=GRID_SIZE)  maxX= GRID_SIZE-1;
    if(maxY>=GRID_SIZE)  maxY= GRID_SIZE-1;

    let i=maxX;
    let j =maxY;

    while(i>=minX && j>=minY){
        console.log(grid[2][1])
        console.log(j," ",i, grid[j][i])
        if(grid[j][i]==turn.mark){   markCounter++;}
        else{    markCounter=0;}
        if(markCounter == 4){
            return true;
        }
        i--;
        j--;
    }
    console.log(" fin");
    return false 
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