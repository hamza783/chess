"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
// need user and game class
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(socket) {
        this.users.push(socket);
        console.log('initializing user');
        socket.send(JSON.stringify({
            type: messages_1.STATS,
            payload: {
                numberOfActiveGames: this.games.length
            }
        }));
        this.addHandler(socket);
    }
    removeUser(socket) {
        console.log('removing user');
        this.users = this.users.filter(user => user !== socket); // remove player from users
        console.log('user removed');
        // remove the game this user was playing
        this.games = this.games.filter(game => {
            if (game.player1 !== socket && game.player2 !== socket) {
                // valid game
                console.log('valid game');
                return game;
            }
            console.log('game resign');
            game.resignGame(socket);
        });
        console.log('game removed');
        console.log(this.games);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            var _a;
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    // start the game
                    console.log('starting');
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                    console.log('done starting game');
                }
                else {
                    console.log('found player 1. looking for player 2');
                    this.pendingUser = socket;
                    socket.send(JSON.stringify({
                        type: messages_1.WAITING_FOR_PLAYER
                    }));
                }
            }
            if (message.type === messages_1.CANCEL_INIT_GAME && this.pendingUser === socket) {
                console.log('canceling init game');
                this.pendingUser = null;
                socket.send(JSON.stringify({
                    type: messages_1.STATS,
                    payload: {
                        numberOfActiveGames: this.games.length
                    }
                }));
            }
            if (message.type === messages_1.MOVE) {
                console.log('message move');
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log('making a move', message);
                    game.makeMove(socket, (_a = message.payload) === null || _a === void 0 ? void 0 : _a.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
