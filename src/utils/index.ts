import { BOMBS_COUNT, MAX_COLS, MAX_ROWS } from '../constants'
import { ICell, CellState, CellValue } from '../types'

type GeneratingCells = (rows?: number, cols?: number) => ICell[][]

export const generateCells: GeneratingCells = (maxRows = MAX_ROWS, maxCols = MAX_COLS) => {
  const cells: ICell[][] = []
  for (let row = 0; row < maxRows; row++) {
    cells.push([])
    for (let col = 0; col < maxCols; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.touched,
      })
    }
  }

  let bomsPlaced = 0

  while (bomsPlaced < BOMBS_COUNT) {
    const row = Math.floor(Math.random() * maxRows)
    const col = Math.floor(Math.random() * maxCols)
    const targetCell = cells[row][col]
    if (targetCell.value !== CellValue.bomb) {
      cells[row][col] = { ...targetCell, value: CellValue.bomb }
      bomsPlaced++
    }
  }

  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const targetCell = cells[row][col]

      if (targetCell.value === CellValue.bomb) continue

      const topRow = row - 1
      const middleRow = row
      const bottomRow = row + 1
      const leftCol = col - 1
      const middleCol = col
      const rightCol = col + 1

      const tl = { row: topRow, col: leftCol }
      const tm = { row: topRow, col: middleCol }
      const tr = { row: topRow, col: rightCol }
      const ml = { row: middleRow, col: leftCol }
      const mr = { row: middleRow, col: rightCol }
      const bl = { row: bottomRow, col: leftCol }
      const bm = { row: bottomRow, col: middleCol }
      const br = { row: bottomRow, col: rightCol }

      const adjacentCells = [tl, tm, tr, ml, mr, bl, bm, br]

      let adjacentBombsCount = 0

      for (let cell of adjacentCells) {
        const cellExists = cell.row >= 0 && cell.row < maxRows && cell.col >= 0 && cell.col < maxCols
        if (cellExists) {
          if (cells[cell.row][cell.col].value === CellValue.bomb) adjacentBombsCount++
        }
      }
      targetCell.value = adjacentBombsCount
    }
  }

  return cells
}
