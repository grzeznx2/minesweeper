import { MouseEvent } from 'react'
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
  onContextMenu: (rowParam: number, colParam: number) => (e: MouseEvent<HTMLDivElement>) => void
}

const Cell: React.FC<CellProps> = ({ row, col, state, value, onMouseDown, onMouseUp, onClick, onContextMenu }) => {
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
    <div
      onContextMenu={onContextMenu(row, col)}
      onClick={onClick(row, col)}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      className={`cell ${state === CellState.touched ? 'cell--touched' : ''}`}
    >
      {renderContent()}
    </div>
  )
}

export default Cell
