const boardForm = document.getElementById('board')
const statusEl = document.getElementById('status')
const resetBtn = document.getElementById('reset')

// Koordinaten-Liste (für Reihenfolge & Computerzug)
const COORDS = [
  'A1','A2','A3',
  'B1','B2','B3',
  'C1','C2','C3'
]

// vordefinierte Gewinnlinien (Reihen, Spalten, Diagonalen)
const WIN_LINES = [
  // Reihen
  ['A1','A2','A3'],
  // TODO 

  // Spalten - TODO erweitern
  // Diagonalen - TODO erweitern
]

// Datenstruktur: Menge der Felder pro Seite
const picks = {
  P: new Set(), // Spieler X
  C: new Set(), // Computer O
}

let gameOver = false
let turn = 'P' // P = Spieler, C = Computer

// Prüft, ob set alle coords in line enthält
function hasLine(set, line) {
  // TODO prüfen, ob in line alle coords in set sind
  return false
}

function setStatus(text) { statusEl.textContent = text }

function resetGame() {
  picks.P.clear()
  picks.C.clear()
  gameOver = false
  turn = 'P'

  // alle Checkboxen leeren & optische Marks löschen
  for (const coord of COORDS) {
    const cb = document.getElementById(coord)
    cb.checked = false
    cb.disabled = false
    const label = cb.closest('.cell')
    label.classList.remove('won', 'data-x', 'data-o')
    const mark = label.querySelector('.mark')
    mark.setAttribute('data-mark', '')
  }

  setStatus('Am Zug: Spieler X')
}

resetBtn.addEventListener('click', resetGame)


// Wenn jemand gewonnen hat, gib Gewinner und Linie zurück
function winner() {
  for (const line of WIN_LINES) {
    if (hasLine(picks.P, line)) return { who: 'P', line }
    if (hasLine(picks.C, line)) return { who: 'C', line }
  }
  return null
}

function highlightWin(line, who) {
  for (const c of line) {
    const cb = document.getElementById(c)
    const label = cb.closest('.cell')
    label.classList.add('won')
  }
  gameOver = true
  // nach Spielende alle Felder sperren
  for (const id of COORDS) document.getElementById(id).disabled = true
  setStatus(who === 'P' ? 'Spielende – du gewinnst!' : 'Spielende – Computer gewinnt')
}

// sehr einfache „KI“: erstes freies Feld nehmen
function computerMove() {
  if (gameOver) return
  // blockiere Eingaben kurz während des Computerzugs
  for (const id of COORDS) document.getElementById(id).disabled = true

  // finde erstes freies
  const free = COORDS.find(id => {
    return !picks.P.has(id) && !picks.C.has(id)
  })

  if (free) {
    // „anklicken“
    picks.C.add(free)
    applyVisual(free, 'O')
  }

  const w = winner()
  if (w) {
    highlightWin(w.line, w.who)
    return
  }

  // wenn noch nicht vorbei, Spieler ist dran
  if (!isDraw()) {
    turn = 'P'
    // freie Felder wieder aktivieren
    for (const id of COORDS) {
      const cb = document.getElementById(id)
      if (!cb.checked) cb.disabled = false
    }
    setStatus('Am Zug: Spieler X')
  } else {
    gameOver = true
    setStatus('Unentschieden')
  }
}

function isDraw() {
  return picks.P.size + picks.C.size === 9
}

function applyVisual(coord, symbol) {
  const cb = document.getElementById(coord)
  cb.checked = true
  cb.disabled = true
  const label = cb.closest('.cell')
  const mark = label.querySelector('.mark')
  mark.setAttribute('data-mark', symbol)
  if (symbol === 'X') label.classList.add('data-x')
  if (symbol === 'O') label.classList.add('data-o')
}

// Spieler klickt ein Feld
boardForm.addEventListener('change', e => {
  const cb = e.target
  if (!(cb instanceof HTMLInputElement)) return
  if (cb.type !== 'checkbox') return
  if (gameOver) return
  if (turn !== 'P') return  // verhindere Doppelklicks in falscher Phase

  const coord = cb.dataset.coord
  // falls schon belegt, abbrechen
  if (picks.P.has(coord) || picks.C.has(coord)) return

  // Spieler markiert X
  picks.P.add(coord)
  applyVisual(coord, 'X')

  const w = winner()
  if (w) {
    highlightWin(w.line, w.who)
    return
  }

  if (isDraw()) {
    gameOver = true
    setStatus('Unentschieden')
    return
  }

  // Computer ist dran
  turn = 'C'
  setStatus('Computer denkt …')
  // ganz mini Verzögerung für sichtbares Feedback
  setTimeout(computerMove, 250)
})

// Start
resetGame()