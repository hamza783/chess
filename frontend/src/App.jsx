import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { styled } from 'styled-components'

// Components
import Home from './routes/Home'
import Game from './routes/Game'

const Container = styled.div`
  padding: 50px 30px;
  min-width: 700px;
  overflow-x: auto;
  color: white;
`

function App() {
  return (
    <div className='h-screen bg-slate-950'>
      <Container>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/game" element={<Game />}/>
          </Routes>
        </BrowserRouter>
      </Container>
    </div>
  )
}

export default App
