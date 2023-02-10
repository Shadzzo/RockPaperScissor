//Score Spans
var playerScore = document.getElementById("player-score");
var compScore = document.getElementById("comp-score");
var resultText = document.getElementById("result-text");
var roundSpan = document.getElementById("round-number");

//Computer Images
var compRock = document.getElementById("comp-rock");
var compPaper = document.getElementById("comp-paper");
var compScissor = document.getElementById("comp-scissor");

//Player Images
const playerImages = document.querySelectorAll(".player-image");
var playerRock = document.getElementById("player-rock");
var playerPaper = document.getElementById("player-paper");
var playerScissor = document.getElementById("player-scissor");

//Round Overlay
var overlay = document.getElementById("popup");

//Game Over Screen
var gameOver = document.getElementById("game-over");
var goTitle = document.getElementById("go-title");
var restartButton = document.getElementById("go-restart-button");

// Game Over Event
restartButton.addEventListener("click", function(event){
    restart(gameOver);
});

//Score Overlay
async function overlayScore(result){
    overlay.classList.add("overlay-show");
    //Delay function
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    overlay.classList.remove("overlay-show");
    compMovementRemove();
    playerMovementRemove();
}

//Restart the game
function restart(gameOver){
    playerScore.innerText = "0";
    compScore.innerText = "0";
    gameOver.classList.remove("go-overlay-show");
    game();
}

//Move the corresponding image to the computer's choice
function compMovementAdd(computerSelection){
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
    compRock.classList.remove("comp-image-move");
    compPaper.classList.remove("comp-image-move");
    compScissor.classList.remove("comp-image-move");    
}

//Remove player image's movement
function playerMovementRemove(){
    playerRock.classList.remove("player-image-move");
    playerPaper.classList.remove("player-image-move");
    playerScissor.classList.remove("player-image-move");
}

//Computer's decision
function computerPlay(){
    //Get a random number between 0 - 2 
    var computerSelection = Math.floor(Math.random() * 3);
    compMovementAdd(computerSelection);
    return computerSelection;    
}

//Player's decision
async function playerPlay(){
    var playerSelection;
    await (new Promise(resolve => {
        playerImages.forEach(function(playerImage){
            playerImage.addEventListener("click", function(event){
                if(event.target.id == "player-rock"){
                    playerImage.classList.add("player-image-move");
                    playerSelection = 0;
                    resolve();
                } else if(event.target.id == "player-paper"){
                    playerImage.classList.add("player-image-move");
                    playerSelection = 1;
                    resolve();
                } else if(event.target.id == "player-scissor"){
                    playerImage.classList.add("player-image-move");
                    playerSelection = 2;
                    resolve();
                }
            })
        });
    }));
    return playerSelection;
}

// Round Calculations [Hard codded values ROCK = 0, Paper = 1, Scissor = 2]
function playRound(computerSelection, playerSelection){
    if (computerSelection == (playerSelection + 1) % 3){
        // Lose condition
        compScore.innerText = parseInt(compScore.innerText) + 1;
        resultText.innerText = "You lost this round!"
        return 2;
    } else if (computerSelection == (playerSelection + 2) % 3){
        // Win condition
        playerScore.innerText = parseInt(playerScore.innerText) + 1;
        resultText.innerText = "You won this round!"
        return 1;
    } else {
        // Tie condition
        resultText.innerText = "You tied!"
        return 0;
    }
}

// Winner selection and Final screen
function winCondition(result, player, comp){
    gameOver.classList.add("go-overlay-show");
    if(comp > player){
        goTitle.innerText = "Failure!";
    } else if(comp < player){
        goTitle.innerText = "Victory!";
    } else if(comp == player){
        goTitle.innerText = "Tie!";
    }
}

//Main function
async function game(){
    var roundCount = 0;
    var comp = 0;
    var player = 0;
    var result = [];
    while(player < 5 && comp < 5){
        //Get player choice
        var playerSelection =  await playerPlay();
        //Get computer choice
        var computerSelection = computerPlay();
        //Round Counter
        roundSpan.innerText = roundCount + 1;
        result[roundCount] = playRound(computerSelection, playerSelection);
        //Send the result to overlay
        await overlayScore(result[roundCount]);
        //Win counter
        if(result[roundCount] == 1){
            player++;
        } else if(result[roundCount] == 2){
            comp++;
        }
        roundCount++;
    };
    winCondition(result, player, comp);
}

// Start the game
game();