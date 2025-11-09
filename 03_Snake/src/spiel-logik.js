const boardEl = document.getElementById('board')
const startBtn = document.getElementById('startBtn')
const pauseBtn = document.getElementById('pauseBtn')
const resetBtn = document.getElementById('resetBtn')
const scoreEl = document.getElementById('score')
const highEl = document.getElementById('high')

/** Spielfeld-Groesse (NxN) */
const SIZE = 15

/** Richtung als Vektor */
const DIRS = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
}

/** Zustand */
let cells = []
let snake = []              // Array von Indizes (0..SIZE*SIZE-1), [0] = Kopf
let dir = DIRS.ArrowRight   // aktuelle Richtung
let nextDir = dir           // vorgemerkte Richtung (verhindert Doppeldreher)
let apple = null            // Index Apfel
let score = 0
let high = Number(localStorage.getItem('snakeHigh') || 0)
let timer = null
let speedMs = 220           // Startgeschwindigkeit (ms pro Schritt)
let running = false
let gameOver = false

highEl.textContent = String(high)

/** Hilfen */
const xyToIndex = (x, y) => y * SIZE + x
const indexToXY = i => ({ x: i % SIZE, y: Math.floor(i / SIZE) })

function inBounds(x, y) { return x >= 0 && x < SIZE && y >= 0 && y < SIZE }

function createBoard() {
  boardEl.innerHTML = ''
  cells = []
  for (let i = 0; i < SIZE * SIZE; i++) {
    const div = document.createElement('div')
    div.className = 'cell'
    div.dataset.index = i
    boardEl.appendChild(div)
    cells.push(div)
  }
}

function setCell(idx, className, on) {
  const c = cells[idx]
  if (!c) return
  if (on) c.classList.add(className)
  else c.classList.remove(className)
}

function randomFreeIndex() {
  const occupied = new Set(snake)
  const options = []
  for (let i = 0; i < SIZE * SIZE; i++) if (!occupied.has(i)) options.push(i)
  if (options.length === 0) return null
  const k = Math.floor(Math.random() * options.length)
  return options[k]
}

function placeApple() {
  if (apple != null) setCell(apple, 'apple', false)
  apple = randomFreeIndex()
  if (apple != null) setCell(apple, 'apple', true)
}

function resetGame() {
  clearInterval(timer)
  running = false
  gameOver = false
  startBtn.disabled = false
  pauseBtn.disabled = true
  score = 0
  scoreEl.textContent = '0'
  speedMs = 220
  dir = DIRS.ArrowRight
  nextDir = dir

  // Schlange mittig mit Laenge 3
  const mid = Math.floor(SIZE / 2)
  const startHead = xyToIndex(4, mid)
  snake = [startHead, startHead - 1, startHead - 2]

  // Board neu zeichnen
  for (const c of cells) c.className = 'cell'
  for (let i = 0; i < snake.length; i++) {
    const idx = snake[i]
    setCell(idx, 'snake', true)
  }
  setCell(snake[0], 'head', true)

  placeApple()
}

function start() {
  if (running || gameOver) return
  running = true
  startBtn.disabled = true
  pauseBtn.disabled = false
  timer = setInterval(tick, speedMs)
}

function pause() {
  if (!running) return
  running = false
  pauseBtn.disabled = true
  startBtn.disabled = false
  clearInterval(timer)
}

function gameOverState() {
  running = false
  gameOver = true
  clearInterval(timer)
  startBtn.disabled = true
  pauseBtn.disabled = true
  // Highscore speichern
  if (score > high) {
    high = score
    localStorage.setItem('snakeHigh', String(high))
    highEl.textContent = String(high)
  }
}

function setDirection(key) {
  const cand = DIRS[key]
  if (!cand) return
  // nicht direkt in den eigenen Schwanz drehen (keine 180°)
  const back = { x: -dir.x, y: -dir.y }
  if (cand.x === back.x && cand.y === back.y) return
  nextDir = cand
}

function tick() {
  dir = nextDir

  // neuen Kopf berechnen
  const head = indexToXY(snake[0])
  let nx = head.x + dir.x
  let ny = head.y + dir.y

  // Kollision Wand -> Game Over
  // (TODO 2: fuer „Wrap“ hier statt Game Over nx/ny modulo SIZE setzen)
  if (!inBounds(nx, ny)) {
    gameOverState()
    return
  }

  const nextIndex = xyToIndex(nx, ny)

  // Kollision mit sich selbst
  if (snake.includes(nextIndex)) {
    gameOverState()
    return
  }

  // Kopf verschieben
  snake.unshift(nextIndex)
  setCell(nextIndex, 'snake', true)
  setCell(nextIndex, 'head', true)
  // alter Kopf verliert die Kopffarbe
  setCell(snake[1], 'head', false)

  // Apfel?
  if (nextIndex === apple) {
    score += 1
    scoreEl.textContent = String(score)
    placeApple()

    // TODO 1: Geschwindigkeit leicht erhoehen, z. B. alle 5 Punkte

  } else {
    // kein Apfel: Schwanz verkürzen
    const tail = snake.pop()
    setCell(tail, 'snake', false)
  }
}

function restartInterval() {
  if (!running) return
  clearInterval(timer)
  timer = setInterval(tick, speedMs)
}

/** Events */
document.addEventListener('keydown', e => {
  setDirection(e.key)
})

startBtn.addEventListener('click', () => {
  start()
})

pauseBtn.addEventListener('click', () => {
  pause()
})

resetBtn.addEventListener('click', () => {
  resetGame()
})

/** Init */
createBoard()
resetGame()