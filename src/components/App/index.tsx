import { useState } from 'react'
import { generateCells } from '../../utils'
import Body from '../Body'
import Cell from '../Cell'
import Face from '../Face'
import Header from '../Header'
import NumberDisplay from '../NumberDisplay'
import './App.scss'

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells())

  const renderCells = (): React.ReactNode => cells.map((row, rowIndex) => row.map((cell, colIndex) => <Cell key={`${rowIndex}-${colIndex}`} />))

  return (
    <div className="app">
      <Header>
        <NumberDisplay value={0} />
        <Face />
        <NumberDisplay value={40} />
      </Header>
      <Body>{renderCells()}</Body>
    </div>
  )
}

export default App
