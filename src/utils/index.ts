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
        state: CellState.untouched,
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

  return cells
}
