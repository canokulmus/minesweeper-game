//create cells
export const create2dCells = (row, column, mineAmount) => {
    const cells = []
    for (let i = 0; i < row; i++) {
        cells.push([])
        for (let j = 0; j < column; j++) {
            cells[i].push({
                id: `${i}-${j}`,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                surroundingMines: 0
            })
        }
    }

    //add mines randomly
    let minesPlaced = 0
    while (minesPlaced < mineAmount) {
        const randomRowIndex = Math.floor(Math.random() * row)
        const randomColumnIndex = Math.floor(Math.random() * column)
        const currentCell = cells[randomRowIndex][randomColumnIndex]
        if (!currentCell.isMine) {
            currentCell.isMine = true
            minesPlaced++
        }
    }

    //getSurroundingCells
    const getSurroundingCells = (rowIndex, columnIndex) => {
        const surroundingCells = []
        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            for (let j = columnIndex - 1; j <= columnIndex + 1; j++) {
                const isRowIndexValid = i >= 0 && i < row
                const isColumnIndexValid = j >= 0 && j < column
                const isCurrentCell = i === rowIndex && j === columnIndex
                if (isRowIndexValid && isColumnIndexValid && !isCurrentCell) {
                    surroundingCells.push(cells[i][j])
                }
            }
        }
        return surroundingCells
    }

    //add surrounding mines
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            const currentCell = cells[i][j]
            if (currentCell.isMine) {
                continue
            }
            const surroundingCells = getSurroundingCells(i, j)
            const mines = surroundingCells.filter(cell => cell.isMine)
            currentCell.surroundingMines = mines.length
        }
    }

    return cells
}

export const difficulties = [
    { level: 1, label: "easy", rows: 15, cols: 15, bombs: 15 },
    { level: 2, label: "easy", rows: 15, cols: 15, bombs: 20 },
    { level: 3, label: "easy", rows: 15, cols: 15, bombs: 25 },
    { level: 4, label: "medium", rows: 20, cols: 30, bombs: 60 },
    { level: 5, label: "medium", rows: 20, cols: 30, bombs: 75 },
    { level: 6, label: "medium", rows: 20, cols: 30, bombs: 90 },
    { level: 7, label: "hard", rows: 20, cols: 40, bombs: 100 },
    { level: 8, label: "hard", rows: 20, cols: 40, bombs: 125 },
    { level: 9, label: "hard", rows: 20, cols: 40, bombs: 150 },

]