import React, { useEffect, useState } from 'react'
import { Chess } from 'chess.js'

/* components */
import Flex from '../components/Flex'
import ChessBoard from '../components/ChessBoard'
import Button from '../components/Button'
import Modal from '../components/Modal'

/* Hooks */
import { useSocket } from '../hooks/useSocket'

export const STATS = 'stats'
export const INIT_GAME = 'init_game'
export const CANCEL_INIT_GAME = 'cancel_init_game'
export const START_GAME = 'start_game'
export const MOVE = 'move'
export const GAME_OVER = 'game_over'
export const WAITING_FOR_PLAYER = 'waiting_for_player'

const Game = () => {
  const socket = useSocket()
  const initialChessGame = new Chess()
  const [board, setBoard] = useState(initialChessGame?.board())
  const [waiting, setWaiting] = useState(false)
  const [winner, setWinner] = useState(null)
  const [gameInProgress, setGameInProgress] = useState(false)
  const [currentActiveGames, setCurrentActiveGames] = useState(0)
  const [isBlack, setIsBlack] = useState(false)

  console.log('debug board', board)
  useEffect(() => {
    if (!socket) return

    const handleSocketMessage = (event) => {
      const message = JSON.parse(event.data)
      // const newBoard = asciiToBoard(message?.payload?.board)
      const newBoard = message?.payload?.board
      // console.log('debug board', message?.payload?.board)
      console.log('debug newBoard', newBoard)
      switch (message.type) {
        case STATS:
          setCurrentActiveGames(message?.payload?.numberOfActiveGames)
          break
        case WAITING_FOR_PLAYER:
          setWaiting(true)
          return
        case START_GAME:
          setBoard(newBoard)
          setWaiting(false)
          console.log('Starting game')
          setGameInProgress(true)
          setIsBlack(message?.payload?.color === 'black' ? true : false)
          break
        case MOVE:
          setBoard(newBoard)
          console.log('Move made')
          break
        case GAME_OVER:
          console.log('Game over')
          setWinner(message?.payload?.winner)
          setBoard(newBoard)
          setGameInProgress(false)
          return
      }
    }

    socket.addEventListener('message', handleSocketMessage)

    return () => {
      socket.removeEventListener('message', handleSocketMessage)
    }

  },[socket])

  const sendMessage = (type, payload = null) => {
    try {
      socket.send(JSON.stringify({
        type,
        payload
      }))
    } catch (e) {
      console.log('error occurred', e)
    }
  }

  if (!socket) return <div>Connecting...</div>

  return (
    <div>
      <Flex justifyContent='center'>
        <Flex
          width='80vw'
          height='90vh'
          justifyContent='center'
          padding='0 32px'
          style={{ minWidth: '500px', maxWidth: '1000px', pointerEvents: !gameInProgress && 'none' }}
        >
          <ChessBoard socket={socket} board={board} isBlack={isBlack} />
        </Flex>
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          style={{ padding: '32px', backgroundColor: '#0f172a', borderRadius: '8px' }}
        >
          {!gameInProgress && (
            <>
              <Button
                onClick={() => {
                  sendMessage(INIT_GAME)
                }}
              >
                Play
              </Button>
              <p style={{ marginTop: '8px', whiteSpace: 'nowrap' }}>{currentActiveGames} games in progress</p>
            </>
          )}
          {gameInProgress && (
            <p>TODO: show all moves for the current game here</p>
          )}
        </Flex>
      </Flex>
      <Modal
        showModal={waiting}
        onClose={() => {
          sendMessage(CANCEL_INIT_GAME)
          setWaiting(false)
        }}
      >
        <p style={{ fontSize: '32px' }}>Waiting for an opponent</p>
        <p>Please wait.....</p>
      </Modal>
      <Modal
        showModal={winner !== null}
        onClose={() => {
          setWinner(null)
          // reset board
          setBoard(initialChessGame?.board())
        }}
      >
        <p style={{ fontSize: '32px' }}>{winner} won</p>
      </Modal>
    </div>
  )
}

export default Game