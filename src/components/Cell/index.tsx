import { CellState, CellValue } from '../../types'
import './Cell.scss'

interface CellProps {
  row: number
  col: number
  state: CellState
  value: CellValue
  onMouseDown: () => void
  onMouseUp: () => void
  onClick: (rowParam: number, colParam: number) => () => void
}

const Cell: React.FC<CellProps> = ({ row, col, state, value, onMouseDown, onMouseUp, onClick }) => {
  const renderContent = () => {
    if (state === CellState.touched) {
      if (value === CellValue.bomb) {
        return (
          <span className="cell__content" role="img" aria-label="bomb">
            💣
          </span>
        )
      } else if (value === CellValue.none) {
        return null
      }
      return <span className={`cell__content cell__content--${value}`}>{value}</span>
    }
    if (state === CellState.flagged) {
      return (
        <span className="cell__content" role="img" aria-label="flag">
          🚩
        </span>
      )
    }
  }

  return (
    <div onClick={onClick(row, col)} onMouseUp={onMouseUp} onMouseDown={onMouseDown} className={`cell ${state === CellState.touched ? 'cell--touched' : ''}`}>
      {renderContent()}
    </div>
  )
}

export default Cell
