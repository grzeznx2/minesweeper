import { useState, useEffect } from 'react'
import { generateCells } from '../../utils'
import { Face as EFace, ICell } from '../../types'
import Body from '../Body'
import Cell from '../Cell'
import Face from '../Face'
import Header from '../Header'
import NumberDisplay from '../NumberDisplay'
import './App.scss'

const App: React.FC = () => {
  const [cells, setCells] = useState<ICell[][]>(generateCells())
  const [face, setFace] = useState<EFace>(EFace.smiled)
  const [time, setTime] = useState<number>(0)
  const [timerWorking, setTimerWorking] = useState<boolean>(false)

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
        />
      ))
    )

  return (
    <div className="app">
      <Header>
        <NumberDisplay value={0} />
        <Face face={face} />
        <NumberDisplay value={time} />
      </Header>
      <Body>{renderCells()}</Body>
    </div>
  )
}

export default App
