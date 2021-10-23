import React, { useState, useEffect, MouseEvent } from 'react'
import { generateCells } from '../../utils'
import { CellState, Face as EFace, ICell } from '../../types'
import Body from '../Body'
import Cell from '../Cell'
import Face from '../Face'
import Header from '../Header'
import NumberDisplay from '../NumberDisplay'
import './App.scss'
import { BOMBS_COUNT } from '../../constants'

const App: React.FC = () => {
  const [cells, setCells] = useState<ICell[][]>(generateCells())
  const [face, setFace] = useState<EFace>(EFace.smiled)
  const [time, setTime] = useState<number>(0)
  const [timerWorking, setTimerWorking] = useState<boolean>(false)
  const [flagsCount, setFlagsCount] = useState<number>(BOMBS_COUNT)

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

  const handleFaceClick = () => {
    setTimerWorking(false)
    setTime(0)
    setCells(generateCells())
  }

  const handleCellContextMenu = (rowParam: number, colParam: number) => (e: MouseEvent<HTMLDivElement>) => {
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

  const handleCellClick = (rowParam: number, colParam: number) => () => {
    if (!timerWorking) setTimerWorking(true)
  }
  const handleMouseDown = () => setFace(EFace.scared)
  const handleMouseUp = () => setFace(EFace.smiled)

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
