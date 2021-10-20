import Body from '../Body'
import Header from '../Header'
import NumberDisplay from '../NumberDisplay'
import './App.scss'

const App: React.FC = () => {
  return (
    <div className="app">
      <Header>
        <NumberDisplay value={0} />
        <NumberDisplay value={40} />
      </Header>
      <Body />
    </div>
  )
}

export default App
