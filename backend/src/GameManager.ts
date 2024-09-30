import { WebSocket } from "ws"
import { STATS, INIT_GAME, MOVE, WAITING_FOR_PLAYER, CANCEL_INIT_GAME } from "./messages"
import { Game } from "./Game"

// need user and game class
export class GameManager {
  private games: Game[]
  private pendingUser: WebSocket | null
  private users: WebSocket[]

  constructor() {
    this.games = []
    this.users = []
    this.pendingUser = null;
  }

  addUser(socket: WebSocket) {
    this.users.push(socket)
    console.log('initializing user')
    socket.send(JSON.stringify({
      type: STATS,
      payload: {
        numberOfActiveGames: this.games.length
      }
    }))
    this.addHandler(socket)
  }

  removeUser(socket: WebSocket) {
    console.log('removing user')
    this.users = this.users.filter(user => user !== socket) // remove player from users
    console.log('user removed')
    // remove the game this user was playing
    this.games = this.games.filter(game => {
      if (game.player1 !== socket && game.player2 !== socket) {
        // valid game
        console.log('valid game')
        return game
      }
      console.log('game resign')
      game.resignGame(socket)
    })
    console.log('game removed')
    console.log(this.games)
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString())

      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          // start the game
          console.log('starting')
          const game = new Game(this.pendingUser, socket)
          this.games.push(game)
          this.pendingUser = null
          console.log('done starting game')
        } else {
          console.log('found player 1. looking for player 2')
          this.pendingUser = socket
          socket.send(JSON.stringify({
            type: WAITING_FOR_PLAYER
          }))
        }
      }

      if (message.type === CANCEL_INIT_GAME && this.pendingUser === socket) {
        console.log('canceling init game')
        this.pendingUser = null
        socket.send(JSON.stringify({
          type: STATS,
          payload: {
            numberOfActiveGames: this.games.length
          }
        }))
      }

      if (message.type === MOVE) {
        console.log('message move')
        const game = this.games.find(game => game.player1 === socket || game.player2 === socket)
        if (game) {
          console.log('making a move', message)
          game.makeMove(socket, message.payload?.move)
        }
      }
    })
  }
}