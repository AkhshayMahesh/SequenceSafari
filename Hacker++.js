let bsize = 20
let board = []
let lastPaintTime = 0
let speed = 10
let move = { x: 0, y: 0 }
let snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
let word = ["LIGHT", "MIGHT", "SNAKE", "WHITE", "FLAKE", "POISE", "NOISE", "VOICE", "VOCAL", "ABODE", "CHASE", "CABIN", "RIGHT", "FOCAL", "TRAIN", "WASTE", "EIGHT", "YACHT", "ADOPT", "CRATE", "SEDAN", "PASTE", "PAINT", "FAINT", "WHALE", "QUAIL", "IMAGE", "ZEBRA", "BRAVE", "CRAVE", "DREAM", "STEAM", "STARE", "FLARE", "GREAT", "SHALE", "WHIRL", "WHOLE", "WAFER", "WORTH", "WEIRD", "WRONG", "WORST", "WATER", "WASTE", "WORLD", "WORDS", "WOMEN"]
let food = [{ x: 0, y: 0, c: "orange" }, { x: 0, y: 0, c: "blue" }, { x: 0, y: 0, c: "cyan" }, { x: 0, y: 0, c: "red" }, { x: 0, y: 0, c: "brown" }]
let target = { x: 0, y: 0 }
let t = 60
let score = 0
let countDown
let gamepaused = 0
let best = document.getElementById("topinner")
let max, player
let life = [1, 1, 1, 1]
let buff, blocks, portal
let flag2 = true
let pagemuted = false
let buffss = new Audio("buffs.wav")
let eats = new Audio("eat.wav")
let gameovers = new Audio("Gameover.wav")
let dies = new Audio("heartdie.wav")
let pauses = new Audio("paused.wav")
let inits = new Audio("init.wav")
let obss= new Audio("obs.wav")
let myReq
let bspeed = 1

window.onload = function () {
    document.getElementById("paused").close()
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
    if (!pagemuted) obss.play()
    bsize = parseInt(document.getElementById("bs").value)
    player = document.getElementById("name").value
    document.getElementById("size").innerHTML = `Board Size: ${bsize}`
    document.getElementById("pname").innerHTML=`${player}`
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
    speed = 10
    timer()
    life = [1, 1, 1, 1]
    gamepaused = 0
    move = { x: 0, y: 0 }
    buff = { x: 0, y: 0 }
    portal = [{ x: 3, y: 4 }, { x: bsize - 3, y: bsize - 5 }]
    blocks = { x: 0, y: 0 }
    snake = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    target = { x: 0, y: 0 }
    score = 0
    createPortal()
    createSnake()
    createFood()
    createBuff()
    createBlock()
    drawBoard()
    drawFood()
    drawlife()
    target.x = food[0].x
    target.y = food[0].y
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
    bspeed = 1
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

function createPortal() {
    let s1 = Math.floor(Math.random() * ((bsize / 2) - 3) + 3)
    let s2 = Math.floor(Math.random() * ((bsize / 2) - 3) + 3)
    if (board[s1][s2] == "none") {
        portal[0].x = s1
        portal[0].y = s2
        portal[1].x = bsize - s1
        portal[1].y = bsize - s2
        board[s1][s2] = "spiral"
    }
    else {
        createBuff()
    }
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

function createBlock() {
    let s1 = Math.floor(Math.random() * (bsize - 1) + 1)
    let s2 = Math.floor(Math.random() * (bsize - 1) + 1)
    if (board[s1][s2] == "none") {
        blocks.x = s1
        blocks.y = s2
        board[s1][s2] = "cyan"
    }
    else {
        createBlock()
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
            else if (board[i][j] == "cyan") {
                tileDiv.style.borderRadius = "100%"
                tileDiv.style.backgroundColor = "brown"
            }
            else if (board[i][j] == "white") {
                tileDiv.classList.add("buffs")
            }
            else if (board[i][j] == "spiral") {
                tileDiv.classList.add("bi-bullseye")
                tileDiv.classList.add("bi")
                tileDiv.style.fontSize = `${80 / bsize - 1}vmin`
            }
            else if (board[i][j] != "none") {
                tileDiv.classList.add("word")
                tileDiv.innerHTML = board[i][j]
            }
            gameBoard.append(tileDiv)
        }
    }
    let sc = document.getElementById("score1")
    sc.innerHTML = `Score: ${score}`
    best.innerHTML = `Best: ${max}`
}

function drawFood() {
    let gameBoard = document.getElementById("target")
    gameBoard.innerHTML = ""
    for (let i = 0; i < food.length; i++) {
        let tileDiv = document.createElement("div")
        tileDiv.classList.add("food")
        tileDiv.innerHTML = `${food[i].c}`
        tileDiv.id = `${food[i].c}`
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
    if (snake[0].x == blocks.x && snake[0].y == blocks.y) {
        if (life.length) {
            document.getElementById(`${life.length - 1}`).classList.add("heartover")
            life.pop()
            if (!pagemuted) dies.play()
            return false
        }
        return true
    }

    return false
}

function game() {
    if (isCollide()) {
        if (!pagemuted) gameovers.play()
        move.x = 0
        move.y = 0
        stoptime()
        document.getElementById("gameover").showModal()
        window.cancelAnimationFrame(myReq)
    }

    if (snake[0].x == target.x && snake[0].y == target.y) {
        if (!pagemuted) eats.play()
        tile = document.getElementById(`${food[0].c}`)
        tile.classList.add("complete")
        food.shift()
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
        target.x = food[0].x
        target.y = food[0].y
        if (score > max) {
            max = score
            localStorage.setItem("best", max)
        }
    }

    if (snake[0].x == buff.x && snake[0].y == buff.y) {
        if (!pagemuted) buffss.play()
        if (snake.length > 2) snake.pop()
        if (speed > 1) speed -= 0.5
        buff.x = buff.y = 0
        setTimeout(() => {
            createBuff()
        }, speed * 2000)
    }

    if (move.x != 0 || move.y != 0) {
        for (let i = snake.length - 2; i >= 0; i--) {
            snake[i + 1] = { ...snake[i] }
        }
    }


    if (snake[0].x == portal[0].x && snake[0].y == portal[0].y) {
        snake[0].x = portal[1].x + move.x
        snake[0].y = portal[1].y + move.y
    }

    else if (snake[0].x == portal[1].x && snake[0].y == portal[1].y) {
        snake[0].x = portal[0].x + move.x
        snake[0].y = portal[0].y + move.y
    }
    else {
        snake[0].x += move.x
        snake[0].y += move.y
    }

    for (let i = 0; i < bsize; i++) {
        for (let j = 0; j < bsize; j++) {
            board[i][j] = "none"
        }
    }

    for (let i = 0; i < food.length; i++) {
        board[food[i].x][food[i].y] = food[i].c
    }

    if (blocks.x >= bsize - 1 || blocks.x <= 0) {
        bspeed *= (-1)
    }
    blocks.x += bspeed
    board[blocks.x][blocks.y] = "cyan"

    try {
        board[snake[0].x][snake[0].y] = "black"
    }
    catch (e) {
        console.log("e")
    }

    for (let k = 1; k < snake.length; k++) {
        board[snake[k].x][snake[k].y] = "#555"
    }

    for (let k = 0; k < portal.length; k++) {
        board[portal[k].x][portal[k].y] = "spiral"
    }

    try {
        if (buff.x != 0 && buff.y != 0)
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
        cancelAnimationFrame(myReq)
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
        myReq = window.requestAnimationFrame(animate)
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
    cancelAnimationFrame(myReq)
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

function savelater() {
    localStorage.setItem("snake", JSON.stringify(snake))
    localStorage.setItem("food", JSON.stringify(food))
    localStorage.setItem("time", JSON.stringify(t))
    localStorage.setItem("target", JSON.stringify(target))
    localStorage.setItem("life", JSON.stringify(life))
    localStorage.setItem("buff", JSON.stringify(buff))
    localStorage.setItem("size", JSON.stringify(bsize))
    localStorage.setItem("speed", JSON.stringify(speed))
    localStorage.setItem("score", JSON.stringify(score))
    localStorage.setItem("block", JSON.stringify(blocks))
    localStorage.setItem("portal", JSON.stringify(portal))
    localStorage.setItem("name", JSON.stringify(player))
    location.reload()
}

function playSaved() {
    document.getElementById("land").close()
    snake = JSON.parse(localStorage.getItem("snake"))
    food = JSON.parse(localStorage.getItem("food"))
    t = JSON.parse(localStorage.getItem("time"))
    target = JSON.parse(localStorage.getItem("target"))
    life = JSON.parse(localStorage.getItem("life"))
    buff = JSON.parse(localStorage.getItem("buff"))
    bsize = JSON.parse(localStorage.getItem("size"))
    score = JSON.parse(localStorage.getItem("score"))
    blocks = JSON.parse(localStorage.getItem("block"))
    portal = JSON.parse(localStorage.getItem("portal"))
    player = JSON.parse(localStorage.getItem("name"))

    if (snake == null) {
        bsize = 20
        initGame()
    }

    let ba = []
    for (let i = 0; i < bsize; i++) {
        ba.push("none")
    }
    for (let i = 0; i < bsize; i++) {
        board.push([...ba])
    }

    drawBoard()
    drawFood()
    drawlife()
    timer()
    document.getElementById("size").innerHTML = `Board Size: ${bsize}`
    document.getElementById("pname").innerHTML=`${player}`

    max = localStorage.getItem("best")
    if (max == undefined || max == null) {
        localStorage.setItem("best", 0)
    }

    localStorage.clear()
    localStorage.setItem("best", max)
    gamepaused = 0
    myReq = window.requestAnimationFrame(animate)
}