window.onload = () => {
    
    const app = document.getElementById(fullContainer);
    const twoDGame = new Game(4);
    const timer = new Timer(document.getElementById("timer"));
    var timerStarted = false;
    twoDGame.render(app);

    timer.start();
    document.addEventListener('keyup', (e) => {
        if(!twoDGame.logicalPause) {
            if (e.code === "ArrowUp") twoDGame.move(DOWN);
            else if (e.code === "ArrowDown") twoDGame.move(UP);
            else if (e.code === "ArrowRight") twoDGame.move(LEFT);
            else if (e.code === "ArrowLeft") twoDGame.move(RIGHT);
        }
        document.getElementById("moves-counter").innerText = twoDGame.totalMoves;
    })

    document.getElementById("undo").onclick = ()=>{
        if(!twoDGame.logicalPause) {
            twoDGame.undo();
        }  
    }
    document.getElementById("shuffle").onclick = ()=>{
        if(!twoDGame.logicalPause) {
            twoDGame.randomize(10);
        }  
    }
    document.getElementById("autosolve").onclick = ()=>{
        if(!twoDGame.logicalPause) {
            twoDGame.autosolve();
            twoDGame.logicalPause = true;
        }   
    }

    document.getElementById("up").onclick = ()=>{
        twoDGame.move(DOWN); 
        document.getElementById("moves-counter").innerText = twoDGame.totalMoves;
    }
    document.getElementById("down").onclick = ()=>{
        twoDGame.move(UP); 
        document.getElementById("moves-counter").innerText = twoDGame.totalMoves; 
    }
    document.getElementById("left").onclick = ()=>{
        twoDGame.move(RIGHT); 
        document.getElementById("moves-counter").innerText = twoDGame.totalMoves;
    }
    document.getElementById("right").onclick = ()=>{
        twoDGame.move(LEFT); 
        document.getElementById("moves-counter").innerText = twoDGame.totalMoves;
    }

    twoDGame.randomize(100);

}