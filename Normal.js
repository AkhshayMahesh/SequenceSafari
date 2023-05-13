let bsize = 20
let board = []
let lastPaintTime = 0
let speed = 5
let move = { x: 0, y: 0 }
let snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
let food = [{ x: 0, y: 0, c: "orange" }, { x: 0, y: 0, c: "blue" }, { x: 0, y: 0, c: "cyan" }, { x: 0, y: 0, c: "red" }, { x: 0, y: 0, c: "brown" }, { x: 0, y: 0, c: "violet" }]
let target = { x: 0, y: 0 }
let t = 60
let score = 0
let countDown
let gamepaused = 0
let best = document.getElementById("topinner")
let max

window.onload = function () {
    initGame()
}

function timer() {
    const timeH = document.querySelector("h1")
    displayTime(t)

    countDown = setInterval(() => {
        t--
        displayTime(t)
    }, 1000)

    function displayTime(t) {
        // let ms = t % 100
        let sec = Math.floor(t % 60)
        let min = Math.floor(t / 60)
        timeH.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`
    }
}

function stoptime() {
    clearInterval(countDown)
}

function initGame() {
    document.getElementById("gameover").close()
    stoptime()
    t = 60
    speed = 5
    timer()
    document.getElementById("pause").innerHTML = "Pause"
    gamepaused = 0
    board = []
    for (let i = 0; i < bsize; i++) {
        board.push(["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"])
    }
    move = { x: 0, y: 0 }
    // food = [{ x: 0, y: 0, c: "orange" }, { x: 0, y: 0, c: "blue" }, { x: 0, y: 0, c: "cyan" }, { x: 0, y: 0, c: "red" }, { x: 0, y: 0, c: "brown" }, { x: 0, y: 0, c: "violet" }]
    snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    score = 0
    createSnake()
    createFood()
    drawBoard()
    drawFood()
    target.x = food[0].x
    target.y = food[0].y
    max = localStorage.getItem("best")
    if (max == null) {
        localStorage.setItem("best", 0)
    }
}

function createSnake() {
    let s1 = Math.floor(2 + (bsize - 2) * Math.random())
    let s2 = Math.floor(Math.random() * (bsize - 2) + 2)
    board[s1][s2] = "black"
    snake[0].x = s1
    snake[0].y = s2
    board[s1][s2 - 1] = "#555"
    snake[1].x = s1
    snake[1].y = s2 - 1
    board[s1][s2 - 2] = "#555"
    snake[2].x = s1
    snake[2].y = s2 - 2
    console.log("snake")
}

function createFood() {
    food = [{ x: 0, y: 0, c: "orange" }, { x: 0, y: 0, c: "blue" }, { x: 0, y: 0, c: "cyan" }, { x: 0, y: 0, c: "red" }, { x: 0, y: 0, c: "brown" }, { x: 0, y: 0, c: "violet" }]
    for (let i = 0; i < food.length; i++) {
        let s1 = Math.floor(Math.random() * bsize)
        let s2 = Math.floor(Math.random() * bsize)
        if (board[s1][s2] == "none") {
            board[s1][s2] = food[i].c
            food[i].x = s1
            food[i].y = s2
        }
        else {
            i--
        }
    }
    // console.log("food")
}

function drawBoard() {
    let gameBoard = document.getElementById("board")
    gameBoard.innerHTML = ""
    for (let i = 0; i < bsize; i++) {
        for (let j = 0; j < bsize; j++) {
            let tileDiv = document.createElement("div")
            tileDiv.classList.add("tile")
            if (board[i][j] == "black") {
                tileDiv.classList.add("snakehead")
                if (move.x == 0 && move.y == -1) {
                    tileDiv.classList.add("left")
                }
                else if (move.x == 0 && move.y == 1) {
                    tileDiv.classList.add("right")
                }
                else if (move.x == -1 && move.y == 0) {
                    tileDiv.classList.add("up")
                }
            }
            else if (board[i][j] == "#555") {
                tileDiv.classList.add("sbody")
            }
            else {
                tileDiv.style.backgroundColor = board[i][j]
            }
            gameBoard.append(tileDiv)
        }
    }
    let sc = document.getElementById("score1")
    sc.innerHTML = `${score}`
    best.innerHTML = `Best: ${max}`
}

function drawFood() {
    let gameBoard = document.getElementById("target");
    gameBoard.innerHTML = ""
    for (let i = 0; i < food.length; i++) {
        let tileDiv = document.createElement("div")
        tileDiv.id = `${board[food[i].x][food[i].y]}`
        // console.log(`${board[food[i].x][food[i].y]}`)
        tileDiv.classList.add("food")
        tileDiv.style.backgroundColor = board[food[i].x][food[i].y]
        gameBoard.append(tileDiv)
    }
    // console.log("food drawn")
}

function animate(curr) {
    window.requestAnimationFrame(animate)
    if ((curr - lastPaintTime) / 1000 < (1 / speed)) {
        // console.log("running")
        return;
    }
    lastPaintTime = curr;
    // console.log(curr)
    game()
}

function isCollide() {
    if(t==0){
        return true
    }
    if (snake[0].x < 0 || snake[0].x > 19 || snake[0].y < 0 || snake[0].y > 19) {
        return true
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            return true
        }
    }
    return false
}

function game() {
    if (isCollide()) {
        move.x = 0
        move.y = 0
        stoptime()
        document.getElementById("gameover").showModal()
    }

    if (snake[0].x == target.x && snake[0].y == target.y) {
        tile = document.getElementById(food[0].c)
        tile.classList.add("complete")
        food.shift()
        score++
        if (food.length == 0) {
            createFood()
            drawFood()
            t += 30
        }
        target.x = food[0].x
        target.y = food[0].y
        if (score > max) {
            max = score
            localStorage.setItem("best", max)
        }
    }

    if (move.x != 0 || move.y != 0) {
        for (let i = snake.length - 2; i >= 0; i--) {
            snake[i + 1] = { ...snake[i] }
            // console.log("increamented")
        }
    }

    snake[0].x += move.x
    snake[0].y += move.y

    for (let i = 0; i < bsize; i++) {
        for (let j = 0; j < bsize; j++) {
            board[i][j] = "none"
        }
    }

    // board[food.x][food.y] = "pink"
    for (let i = 0; i < food.length; i++) {
        board[food[i].x][food[i].y] = food[i].c
    }
    board[snake[0].x][snake[0].y] = "black"

    for (let k = 1; k < snake.length; k++) {
        board[snake[k].x][snake[k].y] = "#555"
    }

    drawBoard()
}

window.requestAnimationFrame(animate)

document.addEventListener('keydown', dir)
document.addEventListener("click", dir2)

left=document.getElementById("left")
right=document.getElementById("right")
up=document.getElementById("up")
down=document.getElementById("down")

function dir2(e){
    // console.log(e.target)
    if(e.target==up && move.x!=1){
        console.log("ArrowUp")
        move.x = -1
        move.y = 0  
    }
    if(e.target==down && move.x!=-1){
        console.log("ArrowDown")
        move.x = 1
        move.y = 0    
    }
    if(e.target==left && move.y!=1){
        console.log("ArrowLeft")
        move.x = 0
        move.y = -1 
    }
    if(e.target ==right && move.y!=-1){
        console.log("ArrowRight")
        move.x = 0
        move.y = 1
    }      
}

function dir(e) {
        if(e.key== "ArrowUp" && move.x!==1){
            console.log("ArrowUp")
            move.x = -1
            move.y = 0  
        }
        if(e.key=="ArrowDown" && move.x!==-1){
            console.log("ArrowDown")
            move.x = 1
            move.y = 0    
        }
        if(e.key== "ArrowLeft" && move.y!=1){
            console.log("ArrowLeft")
            move.x = 0
            move.y = -1 
        }
        if(e.key== "ArrowRight" && move.y!=-1){
            console.log("ArrowRight")
            move.x = 0
            move.y = 1
        }      
}

function pause() {
    if (!gamepaused) {
        move.x = 0
        move.y = 0
        stoptime()
        document.getElementById("pause").innerHTML = "Resume"
        gamepaused = 1
        document.removeEventListener('keydown', dir)
        document.removeEventListener('click', dir2)
        
    } else if (gamepaused) {
        document.addEventListener('keydown', dir)
        document.addEventListener('click', dir2)
        document.getElementById("pause").innerHTML = "Pause"
        timer()
        gamepaused = 0
    }
}

function reset() {
    stoptime()
    initGame()
}