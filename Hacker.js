let bsize = 20
let board = []
let lastPaintTime = 0
let speed = 5
let move = { x: 0, y: 0 }
let snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
let word
let food = [{ x: 0, y: 0, c: "orange" }, { x: 0, y: 0, c: "blue" }, { x: 0, y: 0, c: "cyan" }, { x: 0, y: 0, c: "red" }, { x: 0, y: 0, c: "brown" }]
let target = []
let t = 60
let score = 0
let countDown
let gamepaused = 0
let best = document.getElementById("topinner")
let max
let life = [1, 1, 1, 1]
let x, y, k, a
let buff
let flag2 = true
let pagemuted = false
let buffss = new Audio("buffs.wav")
let eats = new Audio("eat.wav")
let gameovers = new Audio("Gameover.wav")
let dies = new Audio("heartdie.wav")
let pauses = new Audio("paused.wav")
let inits = new Audio("init.wav")
let myReq

window.onload = function () {
    inits.play()
    document.getElementById("land").showModal()
}

function timer() {
    const timeH = document.querySelector("h1")
    displayTime(t)

    countDown = setInterval(() => {
        t--
        displayTime(t)
    }, 1000)

    function displayTime(t) {
        let sec = Math.floor(t % 60)
        let min = Math.floor(t / 60)
        timeH.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`
    }
}

function stoptime() {
    clearInterval(countDown)
}

function initGame() {
    bsize = parseInt(document.getElementById("bs").value)
    isNaN(bsize)?(bsize=20):(bsize=bsize)
    document.getElementById("size").innerHTML = `Board Size: ${bsize}`
    let ba = []
    for (let i = 0; i < bsize; i++) {
        ba.push("none")
    }
    for (let i = 0; i < bsize; i++) {
        board.push([...ba])
    }
    document.getElementById("land").close()
    document.getElementById("vol").classList.remove("bi")
    document.getElementById("vol").classList.remove("bi-volume-mute-fill")
    document.getElementById("vol").classList.add("bi")
    document.getElementById("vol").classList.add("bi-volume-up-fill")
    stoptime()
    t = 60
    speed = 5
    timer()
    life = [1, 1, 1, 1]
    gamepaused = 0
    move = { x: 0, y: 0 }
    buff = { x: 0, y: 0 }
    snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    target = []
    score = 0
    word = ["LIGHT", "MIGHT", "SNAKE", "WHITE", "FLAKE", "POISE", "NOISE", "VOICE", "VOCAL", "ABODE", "CHASE", "CABIN", "RIGHT", "FOCAL", "TRAIN", "WASTE", "EIGHT", "YACHT", "ADOPT", "CRATE", "SEDAN", "PASTE", "PAINT", "FAINT", "WHALE", "QUAIL", "IMAGE", "ZEBRA", "BRAVE", "CRAVE", "DREAM", "STEAM", "STARE", "FLARE", "GREAT", "SHALE", "WHIRL", "WHOLE", "WAFER", "WORTH", "WEIRD", "WRONG", "WORST", "WATER", "WASTE", "WORLD", "WORDS", "WOMEN", "BOOKS", "SCENE", "COOKS", "FLEET", "CREEP"]
    createSnake()
    createFood()
    createBuff()
    drawBoard()
    drawFood()
    drawlife()
    target.push({
        x: (food[0].x),
        y: (food[0].y),
        c: (food[0].c),
        d: 0
    })
    for (let j = 1; j < food.length; j++) {
        if (food[0].c == food[j].c) {
            target.push({
                x: (food[j].x),
                y: (food[j].y),
                c: (food[j].c),
                d: j
            })
        }
    }
    max = localStorage.getItem("best")
    if (max == undefined || max == null) {
        localStorage.setItem("best", 0)
    }
    k = 0
    pagemuted = false
    flag2 = true
    document.getElementById("pause").classList.remove("bi")
    document.getElementById("pause").classList.remove("bi-play-fill")
    document.getElementById("pause").classList.add("bi")
    document.getElementById("pause").classList.add("bi-pause-fill")
    myReq = window.requestAnimationFrame(animate)
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
}

function createFood() {
    let s0 = Math.floor(Math.random() * word.length)
    food = [{ x: 0, y: 0, c: "orange" }, { x: 0, y: 0, c: "blue" }, { x: 0, y: 0, c: "cyan" }, { x: 0, y: 0, c: "red" }, { x: 0, y: 0, c: "brown" }]
    for (let i = 0; i < food.length; i++) {
        let s1 = Math.floor(Math.random() * bsize)
        let s2 = Math.floor(Math.random() * bsize)
        if (board[s1][s2] == "none") {
            food[i].x = s1
            food[i].y = s2
            food[i].c = word[s0][i]
            board[s1][s2] = food[i].c
        }
        else {
            i--
        }
    }
}

function createBuff() {
    let s1 = Math.floor(Math.random() * bsize)
    let s2 = Math.floor(Math.random() * bsize)
    if (board[s1][s2] == "none") {
        buff.x = s1
        buff.y = s2
        board[s1][s2] = "white"
    }
    else {
        createBuff()
    }
}

function drawBoard() {
    let gameBoard = document.getElementById("board")
    gameBoard.innerHTML = ""
    for (let i = 0; i < bsize; i++) {
        for (let j = 0; j < bsize; j++) {
            let tileDiv = document.createElement("div")
            tileDiv.classList.add("tile")
            tileDiv.style.width = `${80 / bsize}vmin`
            tileDiv.style.height = `${80 / bsize}vmin`
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
            else if (board[i][j] == "white") {
                tileDiv.classList.add("buffs")
            }
            else if (board[i][j] != "none") {
                tileDiv.classList.add("word")
                tileDiv.innerHTML = board[i][j]
            }
            gameBoard.append(tileDiv)
        }
    }
    let sc = document.getElementById("score1")
    sc.innerHTML = `${score}`
    best.innerHTML = `Best: ${max}`
}

function drawFood() {
    a = 0
    let gameBoard = document.getElementById("target");
    gameBoard.innerHTML = ""
    for (let i = 0; i < food.length; i++) {
        let tileDiv = document.createElement("div")
        tileDiv.id = `${a+i}food`
        tileDiv.classList.add("food")
        tileDiv.innerHTML = `${food[i].c}`
        gameBoard.append(tileDiv)
    }
}

function drawlife() {
    let lives = document.getElementById("life")
    lives.innerHTML = ""
    for (let i = 0; i < life.length; i++) {
        let tile = document.createElement("i")
        tile.classList.add("heart")
        tile.classList.add("bi")
        tile.classList.add("bi-heart-fill")
        tile.id = `${i}`
        lives.append(tile)
    }
}

function animate(curr) {
    myReq = window.requestAnimationFrame(animate)
    if ((curr - lastPaintTime) / 1000 < (1 / speed)) {
        return;
    }
    lastPaintTime = curr;
    game()
}

const swapElements = (array, index1, index2) => {
    let temp = array[index1]
    array[index1] = array[index2]
    array[index2] = temp
}

function isCollide() {
    if (t == 0) {
        if (life.length) {
            t += 30
            document.getElementById(`${life.length - 1}`).classList.add("heartover")
            life.pop()
            if (!pagemuted) dies.play()
            return false
        }
        return true
    }
    if (snake[0].x < 0) {
        if (life.length) {
            snake[0].x = bsize - 1
            document.getElementById(`${life.length - 1}`).classList.add("heartover")
            life.pop()
            if (!pagemuted) dies.play()
            return false
        }
        return true
    }
    if (snake[0].y < 0) {
        if (life.length) {
            snake[0].y = bsize - 1
            document.getElementById(`${life.length - 1}`).classList.add("heartover")
            life.pop()
            if (!pagemuted) dies.play()
            return false
        }
        return true
    }
    if (snake[0].x > bsize - 1) {
        if (life.length) {
            snake[0].x = 0
            document.getElementById(`${life.length - 1}`).classList.add("heartover")
            life.pop()
            if (!pagemuted) dies.play()
            return false
        }
        return true
    }
    if (snake[0].y > bsize - 1) {
        if (life.length) {
            snake[0].y = 0
            document.getElementById(`${life.length - 1}`).classList.add("heartover")
            life.pop()
            if (!pagemuted) dies.play()
            return false
        }
        return true
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            if (life.length) {
                document.getElementById(`${life.length - 1}`).classList.add("heartover")
                life.pop()
                if (!pagemuted) dies.play()
                return false
            }
            return true
        }
    }
    return false
}

function game() {
    if (isCollide()) {
        if (!pagemuted) gameovers.play()
        move.x = 0
        move.y = 0
        stoptime()
        document.querySelector("dialog").close()
        document.getElementById("gameover").showModal()
        window.cancelAnimationFrame(myReq)
    }

    for (let i = 0; i < target.length; i++) {
        if (snake[0].x == target[i].x && snake[0].y == target[i].y) {
            if (!pagemuted) eats.play()
            swapElements(food, 0, target[i].d)
            tile = document.getElementById(`${a}food`)
            tile.classList.add("complete")
            food.shift()
            target = []
            a++
            score++
            k++
            if (food.length == 0) {
                createFood()
                drawFood()
                t += 30
                snake.unshift({
                    x: (snake[0].x + move.x),
                    y: (snake[0].y + move.y)
                })
                speed += 1
            }
            target.push({
                x: (food[0].x),
                y: (food[0].y),
                c: (food[0].c),
                d: 0
            })
            for (let j = 1; j < food.length; j++) {
                if (food[0].c == food[j].c) {
                    target.push({
                        x: (food[j].x),
                        y: (food[j].y),
                        c: (food[j].c),
                        d: j
                    })
                }
            }
            if (score > max) {
                max = score
                localStorage.setItem("best", max)
            }
        }
    }

    if (snake[0].x == buff.x && snake[0].y == buff.y) {
        if (!pagemuted) buffss.play()
        if (snake.length > 2) snake.pop()
        if (speed > 1) speed -= 0.5
        buff.x = buff.y = null
        flag2 = true
    }

    if (k % 15 == 0 && flag2 === true) {
        k++
        flag2 = false
        createBuff()
    }

    if (move.x != 0 || move.y != 0) {
        for (let i = snake.length - 2; i >= 0; i--) {
            snake[i + 1] = { ...snake[i] }
        }
    }

    snake[0].x += move.x
    snake[0].y += move.y

    for (let i = 0; i < bsize; i++) {
        for (let j = 0; j < bsize; j++) {
            board[i][j] = "none"
        }
    }

    for (let i = 0; i < food.length; i++) {
        board[food[i].x][food[i].y] = food[i].c
    }

    try {
        board[snake[0].x][snake[0].y] = "black"
    }
    catch (e) {
        console.log("e")
    }

    for (let k = 1; k < snake.length; k++) {
        board[snake[k].x][snake[k].y] = "#555"
    }

    try {
        board[buff.x][buff.y] = "white"
    }
    catch (err) {
        console.log("e")
    }

    drawBoard()
}

document.addEventListener('keydown', dir)
document.addEventListener("click", dir)

left = document.getElementById("left")
right = document.getElementById("right")
up = document.getElementById("up")
down = document.getElementById("down")

function dir(e) {
    if ((e.key == "ArrowUp" || e.target == up || e.key == "w") && move.x !== 1) {
        move.x = -1
        move.y = 0
    }
    if ((e.key == "ArrowDown" || e.target == down || e.key == "s") && move.x !== -1) {
        move.x = 1
        move.y = 0
    }
    if ((e.key == "ArrowLeft" || e.target == left || e.key == "a") && move.y != 1) {
        move.x = 0
        move.y = -1
    }
    if ((e.key == "ArrowRight" || e.target == right || e.key == "d") && move.y != -1) {
        move.x = 0
        move.y = 1
    }
}

function pause() {
    if (!pagemuted) pauses.play()
    if (!gamepaused) {
        document.querySelector("dialog").close()
        document.getElementById("paused").showModal()
        x = move.x
        y = move.y
        move.x = 0
        move.y = 0
        stoptime()
        document.getElementById("pause").classList.add("bi")
        document.getElementById("pause").classList.add("bi-play-fill")
        document.getElementById("pause").classList.remove("bi")
        document.getElementById("pause").classList.remove("bi-pause-fill")
        gamepaused = 1
        document.removeEventListener('keydown', dir)
        document.removeEventListener('click', dir)
    } else if (gamepaused) {
        document.getElementById("paused").close()
        move.x = x
        move.y = y
        document.addEventListener('keydown', dir)
        document.addEventListener('click', dir)
        document.getElementById("pause").classList.remove("bi")
        document.getElementById("pause").classList.remove("bi-play-fill")
        document.getElementById("pause").classList.add("bi")
        document.getElementById("pause").classList.add("bi-pause-fill")
        timer()
        gamepaused = 0
    }
}

function reset() {
    document.getElementById("gameover").close()
    stoptime()
    initGame()
}

function mutePage() {
    if (!pagemuted) {
        document.getElementById("vol").classList.remove("bi")
        document.getElementById("vol").classList.remove("bi-volume-up-fill")
        document.getElementById("vol").classList.add("bi")
        document.getElementById("vol").classList.add("bi-volume-mute-fill")
        pagemuted = true
    }
    else if (pagemuted) {
        document.getElementById("vol").classList.remove("bi")
        document.getElementById("vol").classList.remove("bi-volume-mute-fill")
        document.getElementById("vol").classList.add("bi")
        document.getElementById("vol").classList.add("bi-volume-up-fill")
        pagemuted = false
    }
}
