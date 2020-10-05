window.addEventListener('load',function(){
    // VARIABLES
    const menu = document.querySelector('#menu');
    const game = document.querySelector('#game');
    const buttonPlay = document.querySelector('#button-play');

    let namePlayerOne, namePlayerTwo;



    buttonPlay.addEventListener('click',onClickButtonPlay);

    // document.querySelector('#name-player1').addEventListener('blur',validateData);
    // document.querySelector('#name-player2').addEventListener('blur',validateData);

    // keyup event when player one enters her name
    document.querySelector('#name-player1').addEventListener('keyup',function(){
        document.querySelector('#player-one').innerHTML = this.value;   // update view
        namePlayerOne = this.value;
    });
    // keyup event when player two enters her name.
    document.querySelector('#name-player2').addEventListener('keyup',function(){
        document.querySelector('#player-two').innerHTML = this.value;
        namePlayerTwo = this.value;
    });
    // document.querySelector('#name-player2').addEventListener('blur',validateData);

    //  FUNCTIONS 
    function onClickButtonPlay(){
        menu.style.display = 'none';
        game.style.display = 'block';
    }
    function validateData(){
        const error = document.querySelector('#error');
        if(this.value == ''){
            error.style.display = 'block';
            error.innerHTML = "Empty field!";
            this.style.borderColor = 'red'
        }else{
            this.style.borderColor = '#555555';
            error.style.display = 'none';
        }
    }
});


