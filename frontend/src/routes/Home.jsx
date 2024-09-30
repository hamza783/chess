import React from 'react'
import { useNavigate } from 'react-router-dom'
import Flex from '../components/Flex'
import Button from '../components/Button'

const Home = () => {
  const navigate = useNavigate()

  return (
    <Flex>
      <div style={{ width: '45%' }}><img src='/src/assets/chess_board.jpeg' /></div>
      <Flex
        justifyContent='center'
        width='50%'
        padding='16px'
        flexDirection='column'
        alignItems='center'
        textAlign='center'
      >
        <p style={{ fontSize: '40px' }}>Play Chess Online</p>
        <Button margin='16px 0 0 0' onClick={() => navigate('/game')}>Start Game</Button>
      </Flex>
    </Flex>
  )
}

export default Home