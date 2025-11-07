const btns = document.querySelectorAll('[data-move]')
const pScoreEl = document.getElementById('pScore')
const cScoreEl = document.getElementById('cScore')
const statusEl = document.getElementById('status')
const resetBtn = document.getElementById('reset')

let pScore = 0
let cScore = 0

function play (playerMove) {
    // nutzt die (noch zu implementierende) Logik aus "spiel-logik.js"
    try {
        const computerMove = getComputerMove()
        const outcome = decideWinner(playerMove, computerMove)

        if (outcome === 'gewonnen') pScore++
        if (outcome === 'verloren') cScore++

        pScoreEl.textContent = String(pScore)
        cScoreEl.textContent = String(cScore)
        statusEl.textContent = `Du: ${playerMove} | Computer: ${computerMove} → ${outcome}`
    } catch (e) {
        statusEl.textContent = 'Bitte implementiere erst die Logik in spiel-logik.js'
    }
}


btns.forEach(b => b.addEventListener('click', () => play(b.dataset.move)))

resetBtn.addEventListener('click', () => {
    pScore = 0; cScore = 0
    pScoreEl.textContent = '0'; cScoreEl.textContent = '0'
    statusEl.textContent = 'Wähle deinen Zug.'
})