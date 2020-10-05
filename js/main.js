window.addEventListener('load',function(){
    const menu = document.querySelector('#menu');
    const game = document.querySelector('#game');
    const buttonPlay = document.querySelector('#play');
    buttonPlay.addEventListener('click',onClickButtonPlay);

    function onClickButtonPlay(){
        menu.style.display = 'none';
        game.style.display = 'block';
    }
});


