import { CellState, CellValue } from '../../types'
import './Cell.scss'

interface CellProps {
  row: number
  col: number
  state: CellState
  value: CellValue
}

const Cell: React.FC<CellProps> = ({ row, col, state, value }) => {
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

  return <div className={`cell ${state === CellState.touched ? 'cell--touched' : ''}`}>{renderContent()}</div>
}

export default Cell