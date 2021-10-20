import './NumberDisplay.scss'

interface NumberDisplayProps {
  value: number
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  return <div className="number-display">{value.toString().padStart(3, '0')}</div>
}

export default NumberDisplay
