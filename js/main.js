// VARIABLES
const menu = document.querySelector('#menu');
const game = document.querySelector('#game');
const buttonPlay = document.querySelector('#button-play');

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
        renderGame(playerOne, playerTwo)
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

function renderGame(playerOne, playerTwo) {
    document.querySelector('#player1').innerHTML = playerOne.name;
    document.querySelector('#player2').innerHTML = playerTwo.name;
    nextTurn();
}

function nextTurn(){
    const currentMark = document.getElementById('mark');
    const active = document.getElementById('active-p'+turn.id);
    currentMark.innerHTML = turn.mark;
    currentMark.style.color = turn.colorMark();
    active.style.backgroundColor = turn.colorMark()
}

