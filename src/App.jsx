import { useState } from 'react'
import logo from './assets/icon.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={logo} className="logo" alt="logo" />
        </a>
      </div>
      <h1>Campus Pulse</h1>
      <div className="card">
      </div>
    </>
  )
}

export default App
