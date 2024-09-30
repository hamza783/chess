"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        console.log('constructing game', this.board.ascii());
        this.sendMessage(this.player1, messages_1.START_GAME, { color: 'white', board: this.board.board() });
        this.sendMessage(this.player2, messages_1.START_GAME, { color: 'black', board: this.board.board() });
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
        console.log('done constructing game');
    }
    sendMessage(socket, type, payload) {
        socket.send(JSON.stringify({
            type: type,
            payload: payload
        }));
    }
    makeMove(socket, move) {
        // validation here
        if (this.board.turn() === 'w' && socket !== this.player1) {
            console.log('this is whites turn');
            return;
        }
        if (this.board.turn() === 'b' && socket !== this.player2) {
            console.log('this is blacks turn');
            return;
        }
        try {
            console.log('making a move', move);
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        // check if the game is over
        if (this.board.isGameOver()) {
            // Send the game over message to both players
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            this.sendMessage(this.player1, messages_1.GAME_OVER, { winner: winner, board: this.board.board() });
            this.sendMessage(this.player2, messages_1.GAME_OVER, { winner: winner, board: this.board.board() });
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
            return;
        }
        //send the update to both users
        console.log('sending message to both players');
        const messagePayload = Object.assign(Object.assign({}, move), { board: this.board.board() });
        this.sendMessage(this.player1, messages_1.MOVE, messagePayload);
        this.sendMessage(this.player2, messages_1.MOVE, messagePayload);
        // this.player1.send(JSON.stringify({
        //   type: MOVE,
        //   payload: messagePayload
        // }))
        // this.player2.send(JSON.stringify({
        //   type: MOVE,
        //   payload: messagePayload
        // }))
    }
    resignGame(socket) {
        const winner = socket === this.player1 ? 'black' : 'white';
        this.sendMessage(this.player1, messages_1.GAME_OVER, { winner: winner, board: this.board.board() });
        this.sendMessage(this.player2, messages_1.GAME_OVER, { winner: winner, board: this.board.board() });
    }
}
exports.Game = Game;
