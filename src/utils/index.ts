import { BOMBS_COUNT, MAX_COLS, MAX_ROWS } from '../constants'
import { ICell, CellState, CellValue } from '../types'

type GeneratingCells = (rows?: number, cols?: number) => ICell[][]

const grabAdjacentCells = (
  cells: ICell[][],
  row: number,
  col: number
): {
  topLeftCell: ICell | null
  topCell: ICell | null
  topRightCell: ICell | null
  leftCell: ICell | null
  rightCell: ICell | null
  bottomLeftCell: ICell | null
  bottomCell: ICell | null
  bottomRightCell: ICell | null
} => {
  const topRow = row - 1
  const middleRow = row
  const bottomRow = row + 1
  const leftCol = col - 1
  const middleCol = col
  const rightCol = col + 1

  const topLeftCell = row > 0 && col > 0 ? cells[topRow][leftCol] : null
  const topCell = row > 0 ? cells[topRow][middleCol] : null
  const topRightCell = row > 0 && col < MAX_COLS - 1 ? cells[topRow][rightCol] : null
  const leftCell = col > 0 ? cells[middleRow][leftCol] : null
  const rightCell = col < MAX_COLS - 1 ? cells[middleRow][rightCol] : null
  const bottomLeftCell = row < MAX_ROWS - 1 && col > 0 ? cells[bottomRow][leftCol] : null
  const bottomCell = row < MAX_ROWS - 1 ? cells[bottomRow][middleCol] : null
  const bottomRightCell =
    row < MAX_ROWS - 1 && col < MAX_COLS - 1 ? cells[bottomRow][rightCol] : null

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  }
}

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
        const cellExists =
          cell.row >= 0 && cell.row < maxRows && cell.col >= 0 && cell.col < maxCols
        if (cellExists) {
          if (cells[cell.row][cell.col].value === CellValue.bomb) adjacentBombsCount++
        }
      }
      targetCell.value = adjacentBombsCount
    }
  }

  return cells
}

export const openMultipleCells = (cells: ICell[][], row: number, col: number): ICell[][] => {
  const currentCell = cells[row][col]

  if (currentCell.state === CellState.touched || currentCell.state === CellState.flagged) {
    return cells
  }

  let newCells = cells.slice()
  newCells[row][col].state = CellState.touched

  const topRow = row - 1
  const middleRow = row
  const bottomRow = row + 1
  const leftCol = col - 1
  const middleCol = col
  const rightCol = col + 1

  const adjCells = grabAdjacentCells(cells, row, col)

  Object.entries(adjCells).forEach(entry => {
    const [key, cell] = entry
    if (cell?.state === CellState.untouched && cell.value !== CellValue.bomb) {
      let row: number
      let col: number
      switch (key) {
        case 'topLeftCell':
          row = topRow
          col = leftCol
          break
        case 'topCell':
          row = topRow
          col = middleCol
          break
        case 'topRightCell':
          row = topRow
          col = rightCol
          break
        case 'leftCell':
          row = middleRow
          col = leftCol
          break
        case 'rightCell':
          row = middleRow
          col = rightCol
          break
        case 'bottomLeftCell':
          row = bottomRow
          col = leftCol
          break
        case 'bottomCell':
          row = bottomRow
          col = middleCol
          break
        case 'bottomRightCell':
          row = bottomRow
          col = rightCol
          break
      }

      if (cell.value === CellValue.none) {
        newCells = openMultipleCells(newCells, row!, col!)
      } else {
        newCells[row!][col!].state = CellState.touched
      }
    }
  })

  return newCells
}
