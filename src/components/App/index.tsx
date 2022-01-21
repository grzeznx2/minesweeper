import React, { useState, useEffect, MouseEvent } from 'react'
import { generateCells, openMultipleCells } from '../../utils'
import { CellState, CellValue, Face as EFace, ICell } from '../../types'
import Body from '../Body'
import Cell from '../Cell'
import Face from '../Face'
import Header from '../Header'
import NumberDisplay from '../NumberDisplay'
import './App.scss'
import { BOMBS_COUNT, MAX_COLS, MAX_ROWS } from '../../constants'

const App: React.FC = () => {
  const [cells, setCells] = useState<ICell[][]>(generateCells())
  const [face, setFace] = useState<EFace>(EFace.smiled)
  const [time, setTime] = useState<number>(0)
  const [timerWorking, setTimerWorking] = useState<boolean>(false)
  const [flagsCount, setFlagsCount] = useState<number>(BOMBS_COUNT)
  const [hasLost, setHasLost] = useState<boolean>(false)
  const [hasWon, setHasWon] = useState<boolean>(false)
  const gameOver = hasLost || hasWon

  useEffect(() => {
    if (timerWorking) {
      const interval = setInterval(() => {
        setTime(time => time + 1)
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [timerWorking])

  useEffect(() => {
    if (time === 999) setTimerWorking(false)
  }, [time])

  useEffect(() => {
    if (hasLost) {
      setTimerWorking(false)
      setFace(EFace.lost)
    }
  }, [hasLost])

  useEffect(() => {
    if (hasWon) {
      setTimerWorking(false)
      setFace(EFace.won)
    }
  }, [hasWon])

  const restartGame = () => {
    setHasLost(false)
    setHasWon(false)
  }

  const handleFaceClick = () => {
    restartGame()
    setFace(EFace.smiled)
    setFlagsCount(BOMBS_COUNT)
    setTimerWorking(false)
    setTime(0)
    setCells(generateCells())
  }

  const handleCellContextMenu =
    (rowParam: number, colParam: number) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      if (cells[rowParam][colParam].state === CellState.touched || flagsCount <= 0) return

      const cellsCopy = cells.map((row, rowIndex) => {
        if (rowIndex !== rowParam) return [...row]
        else {
          return row.map((cell, cellIndex) => {
            if (cellIndex !== colParam) return { ...cell }
            else {
              if (cell.state === CellState.flagged) {
                setFlagsCount(flagsCount => flagsCount + 1)
                return { ...cell, state: CellState.untouched }
              } else {
                setFlagsCount(flagsCount => flagsCount - 1)
                return { ...cell, state: CellState.flagged }
              }
            }
          })
        }
      })

      setCells(cellsCopy)
    }

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (gameOver) return
    let newCells = cells.slice()

    // start the game
    if (!timerWorking) {
      let isABomb = newCells[rowParam][colParam].value === CellValue.bomb
      while (isABomb) {
        newCells = generateCells()
        if (newCells[rowParam][colParam].value !== CellValue.bomb) {
          isABomb = false
          break
        }
      }
      setTimerWorking(true)
    }

    const currentCell = newCells[rowParam][colParam]

    if ([CellState.flagged, CellState.touched].includes(currentCell.state)) {
      return
    }

    if (currentCell.value === CellValue.bomb) {
      setHasLost(true)
      newCells = showAllBombs()
      setCells(newCells)
      return
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam)
    } else {
      newCells[rowParam][colParam].state = CellState.touched
    }

    // Check to see if you have won
    let safeOpenCellsExists = false
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col]

        if (currentCell.value !== CellValue.bomb && currentCell.state === CellState.untouched) {
          safeOpenCellsExists = true
          break
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map(row =>
        row.map(cell => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            }
          }
          return cell
        })
      )
      setHasWon(true)
    }

    setCells(newCells)
  }
  const handleMouseDown = () => {
    if (gameOver) return
    setFace(EFace.scared)
  }
  const handleMouseUp = () => {
    if (gameOver) return
    setFace(EFace.smiled)
  }

  const renderCells = (): React.ReactNode =>
    cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          row={rowIndex}
          col={colIndex}
          state={cell.state}
          value={cell.value}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleCellClick}
          onContextMenu={handleCellContextMenu}
        />
      ))
    )

  const showAllBombs = (): ICell[][] => {
    const currentCells = cells.slice()
    return currentCells.map(row =>
      row.map(cell => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.touched,
          }
        }

        return cell
      })
    )
  }

  return (
    <div className="app">
      <Header>
        <NumberDisplay value={flagsCount} />
        <Face face={face} onClick={handleFaceClick} />
        <NumberDisplay value={time} />
      </Header>
      <Body>{renderCells()}</Body>
    </div>
  )
}

export default App
