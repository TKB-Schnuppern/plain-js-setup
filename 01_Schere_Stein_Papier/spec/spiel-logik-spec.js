describe('Spiel Logik', function() {
    it('beispiel: addition', function() {
        const addition = (a, b) => a + b
        expect(addition(1, 2)).toEqual(3);
    })

    it('MOVES enthält schere, stein, papier', () => {
        expect(MOVES.sort()).toEqual(['papier','schere','stein'].sort())
    })

    it('getComputerMove gibt gültigen Zug zurück', () => {
        // Wird fehlschlagen bis implementiert
        const m = (() => { try { return getComputerMove() } catch { return null } })()
        if (m) expect(MOVES.includes(m)).toBeTrue()
        else fail('getComputerMove noch nicht implementiert')
    })

    it('decideWinner bestimmt Ausgang', () => {
        try {
            expect(decideWinner('schere','papier')).toBe('gewonnen')
            expect(decideWinner('papier','stein')).toBe('gewonnen')
            expect(decideWinner('stein','schere')).toBe('gewonnen')
        } catch {
            fail('decideWinner noch nicht implementiert')
        }
    })
})
