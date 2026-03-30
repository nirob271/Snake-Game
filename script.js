const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const resetButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');


const blockHeight = 50
const blockWidth = 50

let highscore = localStorage.getItem("highscore") || 0;
let score = 0
let time = `00-00`
highScoreElement.innerText = `High Score: ${highscore}`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timeIntervalId = null;
let food = {x: Math.floor(Math.random()*rows) , y: Math.floor(Math.random()*cols)};


const blocks = [];
// const snake = [ {x:1, y:3} ,{x:1, y:4}, {x:1 ,y:5}]
let snake = [ {x:1, y:3}]

let direction = 'down'




for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row},${col}`;
        blocks[`${row},${col}`] = block;
    }
}

function render() {
    // exp 
    let head = null;

    blocks[ `${food.x},${food.y}` ].classList.add("food");

    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1}
    }    
    else if(direction == 'right'){
        head = {x:snake[0].x, y:snake[0].y+1}
    }
    else if(direction == 'up'){
        head = {x:snake[0].x-1, y:snake[0].y}
    }
    else if(direction == 'down'){
        head = {x:snake[0].x+1, y:snake[0].y}
    }

    // wall collision logic
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        // alert("Game Over");
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    // food consume logic 
    if(head.x == food.x && head.y == food.y){
        blocks[ `${food.x},${food.y}` ].classList.remove("food");
        food = {
            x: Math.floor(Math.random()*rows) , y: Math.floor(Math.random()*cols)
        }
        blocks[ `${food.x},${food.y}` ].classList.add("food");
        snake.unshift(head);

        score += 10
        scoreElement.innerText = `Score: ${score}`

        if(score > highscore){
            highscore = score;
            localStorage.setItem("highscore", highscore.toString());
        }
    }

    snake.forEach(segment =>{
         blocks[ `${segment.x},${segment.y}` ].classList.remove("fill"); 
    })

    snake.unshift(head);
    snake.pop();
    // exp 
    snake.forEach(segment => {
        // console.log(segment);
        blocks[ `${segment.x},${segment.y}` ].classList.add("fill"); 
    })
}





startButton.addEventListener("click",() => {
    modal.style.display = "none";
    intervalId = setInterval( () => {
        render();
    },300)
    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)
        if(sec == 59){
            min += 1
            sec = 0
        }
        else{
            sec += 1
        }
        time = `${min}-${sec}`
        timeElement.innerText = `Time: ${time}`
    },1000)
})

resetButton.addEventListener("click", resetGame)
 
function resetGame(){
    blocks[ `${food.x},${food.y}` ].classList.remove("food");
    snake.forEach(segment =>{
         blocks[ `${segment.x},${segment.y}` ].classList.remove("fill"); 
    })
    score = 0
    time = `00-00`
    scoreElement.innerText = `Score: ${score}`
    timeElement.innerText = `Time: ${time}`
    highScoreElement.innerText = `High Score: ${highscore}`;

    modal.style.display = "none";
    snake = [ {x: 1, y: 3} ];
    direction = 'down';
    food = {x: Math.floor(Math.random()*rows) , y: Math.floor(Math.random()*cols)};
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval( () => {
        render();
    },300)
}

addEventListener("keydown", (event) => {
    // console.log(event.key);
    if(event.key === "ArrowLeft"){
        direction = 'left';
    }
    else if(event.key === "ArrowRight"){
        direction = 'right';
    }
    else if(event.key === "ArrowUp"){
        direction = 'up';
    }
    else if(event.key === "ArrowDown"){
        direction = 'down';
    }
})