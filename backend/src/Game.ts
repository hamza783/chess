import { WebSocket } from "ws"
import { Chess } from 'chess.js'
import { MOVE, GAME_OVER, START_GAME } from "./messages"

export class Game {
  public player1: WebSocket
  public player2: WebSocket
  private board: Chess
  private moves: string[]
  private startTime: Date

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1
    this.player2 = player2
    this.board = new Chess()
    this.moves = []
    this.startTime = new Date()
    console.log('constructing game', this.board.ascii())
    this.sendMessage(this.player1, START_GAME, { color: 'white', board: this.board.board() })
    this.sendMessage(this.player2, START_GAME, { color: 'black', board: this.board.board() })
    // this.player1.send(JSON.stringify({
    //   type: INIT_GAME,
    //   payload: {
    //     color: 'white',
    //     board: this.board.board()
    //   }
    // }))
    // this.player2.send(JSON.stringify({
    //   type: INIT_GAME,
    //   payload: {
    //     color: 'black',
    //     board: this.board.board()
    //   }
    // }))
    console.log('done constructing game')
  }

  sendMessage(socket: WebSocket, type: string, payload: object) {
    socket.send(JSON.stringify({
      type: type,
      payload: payload
    }))
  }

  makeMove(socket: WebSocket, move: { from: string, to: string}) {
    // validation here
    if (this.board.turn() === 'w' && socket !== this.player1) {
      console.log('this is whites turn')
      return
    }
    if (this.board.turn() === 'b' && socket !== this.player2) {
      console.log('this is blacks turn')
      return
    }

    try {
      console.log('making a move', move)
      this.board.move(move)
    } catch (e) {
      console.log(e)
      return
    }

    // check if the game is over
    if (this.board.isGameOver()) {
      // Send the game over message to both players
      const winner = this.board.turn() === 'w' ? 'black' : 'white'
      this.sendMessage(this.player1, GAME_OVER, { winner: winner, board: this.board.board() })
      this.sendMessage(this.player2, GAME_OVER, { winner: winner, board: this.board.board() })
      // this.player1.emit('hello', {
      //   type: GAME_OVER,
      //   payload: {
      //     winner: this.board.turn() === "w" ? "black" : "white",
      //     board: this.board.board()
      //   }
      // })
      // this.player2.emit('hello', {
      //   type: GAME_OVER,
      //   payload: {
      //     winner: this.board.turn() === "w" ? "black" : "white",
      //     board: this.board.board()
      //   }
      // })
      return
    }

    //send the update to both users
    console.log('sending message to both players')
    const messagePayload = {
      ...move,
      board: this.board.board()
    }
    this.sendMessage(this.player1, MOVE, messagePayload)
    this.sendMessage(this.player2, MOVE, messagePayload)
    // this.player1.send(JSON.stringify({
    //   type: MOVE,
    //   payload: messagePayload
    // }))
    // this.player2.send(JSON.stringify({
    //   type: MOVE,
    //   payload: messagePayload
    // }))
  }

  resignGame(socket: WebSocket) {
    const winner = socket === this.player1 ? 'black' : 'white'
    this.sendMessage(this.player1, GAME_OVER, { winner: winner, board: this.board.board() })
    this.sendMessage(this.player2, GAME_OVER, { winner: winner, board: this.board.board() })
  }
}