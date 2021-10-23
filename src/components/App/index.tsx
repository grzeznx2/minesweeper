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
        />
      ))
    )

  return (
    <div className="app">
      <Header>
        <NumberDisplay value={0} />
        <Face face={face} />
        <NumberDisplay value={40} />
      </Header>
      <Body>{renderCells()}</Body>
    </div>
  )
}

export default App
