// VARIABLES
const GRID_SIZE = 6;
const color1 = '#ed8c72';// X
const color2= '#2988bc';//O
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const buttonPlay = document.getElementById('button-play');
const canvas = document.getElementById("canvas");
const inputNameP1 = document.getElementById('name-player1');
const inputNameP2 = document.getElementById('name-player2');
const alert = document.getElementById('alert');
const circles = document.querySelectorAll('input[type="radio"]');

var ctx = canvas.getContext("2d");  // get context 2D
var maxX = canvas.width;
var maxY = canvas.height;
var tamC = 0;
var px= 0;
let py= 0;
var counter = 0
var grid;
var turn;

// Objeto de tipo jugador
function Player(id, name,color) {
    this.id= id;
    this.name= name;
    this.score = 0;
    this.color = color;
}
// Crear los objetos de tipo jugador.
// Se asignan valores predeterminados. En la interfaz gráfica el usuario puede modificar los datos.
var playerOne = new Player(1,"PlayerOne",color1);
var playerTwo = new Player(2,"Player two",color2);

buttonPlay.addEventListener('click', onClickButtonPlay);

inputNameP1.addEventListener('blur', validateData);
inputNameP2.addEventListener('blur', validateData);

// Agregar evento a cada radio button para seleccionar la marca.
circles.forEach( mark => mark.addEventListener('click',onSelectColor));

//  FUNCTIONS 
function onClickButtonPlay() {
    if (dataIsValid()) {
        playerOne.name = inputNameP1.value;
        playerTwo.name = inputNameP2.value;
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
function onSelectColor() {
    switch(this.className){
        case 'color-player1':
            playerOne.color = this.value;
            if(this.value == color1){
                circles[3].checked = true;
                playerTwo.color = color2;
            }else{
                circles[2].checked = true;
                playerTwo.color= color1;
            }
        break;
        case 'color-player2':
            playerTwo.color = this.value;
            if(this.value == color1){
                circles[1].checked = true;
                playerOne.color = color2; 
            }else{
                circles[0].checked = true;
                playerOne.color= color1;
            }
        break;
    }
}

function dataIsValid() {
    return (inputNameP1.value != '' && inputNameP2.value != '') ? true : false
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
        drawMark(turn.color)

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
function drawMark(color){
    grid[py][px] = color;
    circulo();
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

    ctx.moveTo((px * tamC) + (tamC * .1), ((py + 1) * tamC) - (tamC * .1));         /*    /    */
    ctx.lineTo(((px + 1) * tamC) - (tamC * .1), ((py) * tamC) + (tamC * .1));       /*   /     */

    ctx.moveTo((px * tamC) + (tamC * .1), ((py) * tamC) + (tamC * .1));             /*   \    */
    ctx.lineTo(((px + 1) * tamC) - (tamC * .1), ((py + 1) * tamC) - (tamC * .1));   /*    \    */

    ctx.stroke();
}

function circulo() {
    ctx.beginPath();
    ctx.fillStyle = turn.color;
    ctx.lineWidth = 5;

    ctx.arc((px * tamC) + (tamC * .5), (py * tamC) + (tamC * .5), tamC * .32, 0, 2 * Math.PI);
    ctx.fill();
}
function existsWinner() { 
    let winner = false;
    if(horizontal())    winner= true;
    else if(vertical()) winner= true;
    else {
        if(primaryDiagonal())   winner= true;
        else if(secundaryDiagonal())    winner= true;
    }
    if(winner){
        tache();
        return true;
    }
    return false;
}
function horizontal(){
    let min = px-3;
    let max = px+3;
    let circleCounter = 0;

    if(min<0)   min=0;
    if(max>=GRID_SIZE)  max= GRID_SIZE-1;
    
    for(let j=min; j<=max;j++){
        if(grid[py][j]== turn.color)
            circleCounter++;
        else
            circleCounter=0;
        if(circleCounter==4)
            return true;
    }
    return false; 
}
function vertical(){
    let max = py+3;
    let circleCounter = 0;
    if(max>=GRID_SIZE)  max= GRID_SIZE-1;

    for(let i=py; i<GRID_SIZE;i++){
        if(grid[i][px]== turn.color)
            circleCounter++;
        else
            circleCounter=0;
        if(circleCounter==4)
            return true;
    }
    return false;
}
function primaryDiagonal(){
    let minX = px-3;
    let maxX = px+3;
    let minY = py-3;
    let maxY = py+3;
    let circleCounter = 0;

    if(minX<0)   minX=0;
    if(minY<0)   minY=0;

    if(maxX>=GRID_SIZE)  maxX= GRID_SIZE-1;
    if(maxY>=GRID_SIZE)  maxY= GRID_SIZE-1;

    let i=maxX;
    let j =maxY;

    while(i>=minX && j>=minY){
        if(grid[j][i]==turn.color)   circleCounter++;
        else    circleCounter=0;
        if(circleCounter == 4)
            return true;
        i--;
        j--;
    }
    return false 
}
function secundaryDiagonal(){
    let minX = px-3;
    let maxX = px+3;
    let minY = py-3;
    let maxY = py+3;
    let circleCounter = 0;

    if(minX<0)   minX=0;
    if(minY<0)   minY=0;

    if(maxX>=GRID_SIZE)  maxX= GRID_SIZE-1;
    if(maxY>=GRID_SIZE)  maxY= GRID_SIZE-1;

    let i=minX;// columnas
    let j =maxY; // filas

    while(i<=maxX && j>=minY){
        if(grid[j][i]==turn.color)   circleCounter++;
        else    circleCounter=0;
        if(circleCounter == 4)
            return true;
        i++;
        j--;
    }
    return false
}

function restart(){
    counter = 0;
    ctx.clearRect(0, 0, maxX, maxY); // clear canvas
    drawBoard();
}

function goHome(){
    counter=0;
    ctx.clearRect(0, 0, maxX, maxY); // clear canvas
    playerOne = new Player(1,"PlayerOne",playerOne.color);
    playerTwo = new Player(2,"Player two",playerTwo.color);
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