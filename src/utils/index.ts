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

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  } = grabAdjacentCells(cells, row, col)

  const topRow = row - 1
  const middleRow = row
  const bottomRow = row + 1
  const leftCol = col - 1
  const middleCol = col
  const rightCol = col + 1

  if (topLeftCell?.state === CellState.untouched && topLeftCell.value !== CellValue.bomb) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, topRow, leftCol)
    } else {
      newCells[topRow][leftCol].state = CellState.touched
    }
  }

  if (topCell?.state === CellState.untouched && topCell.value !== CellValue.bomb) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, topRow, middleCol)
    } else {
      newCells[topRow][middleCol].state = CellState.touched
    }
  }

  if (topRightCell?.state === CellState.untouched && topRightCell.value !== CellValue.bomb) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, topRow, rightCol)
    } else {
      newCells[topRow][rightCol].state = CellState.touched
    }
  }

  if (leftCell?.state === CellState.untouched && leftCell.value !== CellValue.bomb) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, middleRow, leftCol)
    } else {
      newCells[middleRow][leftCol].state = CellState.touched
    }
  }

  if (rightCell?.state === CellState.untouched && rightCell.value !== CellValue.bomb) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, middleRow, rightCol)
    } else {
      newCells[middleRow][rightCol].state = CellState.touched
    }
  }

  if (bottomLeftCell?.state === CellState.untouched && bottomLeftCell.value !== CellValue.bomb) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, bottomRow, leftCol)
    } else {
      newCells[bottomRow][leftCol].state = CellState.touched
    }
  }

  if (bottomCell?.state === CellState.untouched && bottomCell.value !== CellValue.bomb) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, bottomRow, middleCol)
    } else {
      newCells[bottomRow][middleCol].state = CellState.touched
    }
  }

  if (bottomRightCell?.state === CellState.untouched && bottomRightCell.value !== CellValue.bomb) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, bottomRow, rightCol)
    } else {
      newCells[bottomRow][rightCol].state = CellState.touched
    }
  }

  return newCells
}
