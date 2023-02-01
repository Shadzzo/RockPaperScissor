//Score Overlay
async function overlayScore(result){
    var overlay = document.getElementById("popup");
    overlay.classList.add("overlay-show");
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    overlay.classList.remove("overlay-show");
    compMovementRemove();
    playerMovementRemove();
}

//Restart the game
function restart(gameOver){
    var playerScore = document.getElementById("player-score");
    var compScore = document.getElementById("comp-score");
    playerScore.innerText = "0";
    compScore.innerText = "0";
    gameOver.classList.remove("go-overlay-show");
    game();
}

//Move the corresponding image to the computer's choice
function compMovementAdd(computerSelection){
    var compRock = document.getElementById("comp-rock");
    var compPaper = document.getElementById("comp-paper");
    var compScissor = document.getElementById("comp-scissor");
    if(computerSelection == 0){
        compRock.classList.add("comp-image-move");
    } else if(computerSelection == 1){
        compPaper.classList.add("comp-image-move");
    } else if(computerSelection == 2){
        compScissor.classList.add("comp-image-move");
    }
}

//Remove computer image's movement
function compMovementRemove(){
    var compRock = document.getElementById("comp-rock");
    var compPaper = document.getElementById("comp-paper");
    var compScissor = document.getElementById("comp-scissor");
    compRock.classList.remove("comp-image-move");
    compPaper.classList.remove("comp-image-move");
    compScissor.classList.remove("comp-image-move");    
}

//Remove player image's movement
function playerMovementRemove(){
    var playerRock = document.getElementById("player-rock");
    var playerPaper = document.getElementById("player-paper");
    var playerScissor = document.getElementById("player-scissor");
    playerRock.classList.remove("player-image-move");
    playerPaper.classList.remove("player-image-move");
    playerScissor.classList.remove("player-image-move");
}

//Computer's decision
function computerPlay(){
    //Get a random number between 0 - 2 
    var computerSelection = Math.floor(Math.random() * 3);
    compMovementAdd(computerSelection);
    return options[computerSelection];    
}

//Player's decision
async function playerPlay(){
    var playerSelection;
    const playerImages = document.querySelectorAll(".player-image");
    await (new Promise(resolve => {
        playerImages.forEach(function(playerImage){
            playerImage.addEventListener("click", function(event){
                if(event.target.id == "player-rock"){
                    playerImage.classList.add("player-image-move");
                    playerSelection = "ROCK";
                    resolve();
                } else if(event.target.id == "player-paper"){
                    playerImage.classList.add("player-image-move");
                    playerSelection = "PAPER";
                    resolve();
                } else if(event.target.id == "player-scissor"){
                    playerImage.classList.add("player-image-move");
                    playerSelection = "SCISSOR";
                    resolve();
                }
            })
        })
    }));
    return playerSelection;
}

// Round Calculations
function playRound(computerSelection, playerSelection){
    //Score Spans
    var playerScore = document.getElementById("player-score");
    var compScore = document.getElementById("comp-score");
    var resultText = document.getElementById("result-text");
    //Tie condition
    if(computerSelection == playerSelection){
        resultText.innerText = "You tied!"
        return 0;
    }
    //Win conditions
    if(computerSelection == "ROCK"){
        if(playerSelection == "PAPER"){
            //Score update
            playerScore.innerText = parseInt(playerScore.innerText) + 1;
            resultText.innerText = "You won this round!"
            return 1;            
        } else if(playerSelection == "SCISSOR"){
            compScore.innerText = parseInt(compScore.innerText) + 1;
            resultText.innerText = "You lost this round!"
            return 2;
        }
    } else if(computerSelection == "PAPER"){
        if(playerSelection == "ROCK"){
            compScore.innerText = parseInt(compScore.innerText) + 1;
            resultText.innerText = "You lost this round!"
            return 2;            
        } else if(playerSelection == "SCISSOR"){
            playerScore.innerText = parseInt(playerScore.innerText) + 1;
            resultText.innerText = "You won this round!"
            return 1;
        }
    } else if(computerSelection == "SCISSOR"){
        if(playerSelection == "ROCK"){
            playerScore.innerText = parseInt(playerScore.innerText) + 1;
            resultText.innerText = "You won this round!"
            return 1;            
        } else if(playerSelection == "PAPER"){
            compScore.innerText = parseInt(compScore.innerText) + 1;
            resultText.innerText = "You lost this round!"
            return 2;
        }
    }
}

// Winner selection and Final screen
async function winCondition(result){
    var gameOver = document.getElementById("game-over");
    var goTitle = document.getElementById("go-title");
    var restartButton = document.getElementById("go-restart-button");
    var comp = 0;
    var player = 0;
    for (let i = 0; i < result.length; i++) {
        if(result[i] == 1){
            player++;
        } else if(result[i] == 2){
            comp++;
        }       
    }
    gameOver.classList.add("go-overlay-show");
    if(comp > player){
        goTitle.innerText = "Failure!";
    } else if(comp < player){
        goTitle.innerText = "Victory!";
    } else if(comp == player){
        goTitle.innerText = "Tie!";
    }
    await (new Promise(resolve => {
        restartButton.addEventListener("click", function(event){
            restart(gameOver);
        });
    }));
}

//Main function
async function game(){
    var roundSpan = document.getElementById("round-number");
    var roundCount = 0;
    var result = [];
    while(roundCount < 5){
        //Get player choice
        var playerSelection =  await playerPlay();
        //Get computer choice
        var computerSelection = computerPlay();
        //Round Counter
        roundSpan.innerText = roundCount + 1;
        result[roundCount] = playRound(computerSelection, playerSelection);
        //Send the result to overlay
        await overlayScore(result[roundCount]);
        roundCount++;
    };
    await winCondition(result);
}

// Start the game
const options = ["ROCK", "PAPER", "SCISSOR"];
game();