import { useEffect, useState } from 'react'

const WS_URL = 'ws://localhost:8080/ws'
export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = 'game_over'
export const useSocket = () => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const ws= new WebSocket(WS_URL)
    ws.onopen = () => {
      console.log('connected')
      setSocket(ws)
    }

    ws.onclose = () => {
      console.log('disconnected')
      setSocket(null)
    }

    // ws.onmessage = (event) => {
    //   console.log('debug event', event)
    //   const message = JSON.parse(event.data)
    //   console.log('debug message', message)
    //   switch (message.type) {
    //     case INIT_GAME:
    //       console.log('debug message payload', message.payload)
    //       setChessGame(new Chess())
    //       setBoard(chess.board())
    //       console.log('Starting game')
    //       break
    //     case MOVE:
    //       const move = message.payload
    //       chessGame.move(move)
    //       setBoard(chessGame.board())
    //       console.log('Move made')
    //       break
    //     case GAME_OVER:
    //       console.log('Game over')
    //       break
    //   }
    // }

    return () => {
      ws.close()
    }
  }, [])

  return socket
}