# Chess

## How to run the game locally

### Step 1: Run backend server.

Navigate to the `backend` folder and run this command.
```
node dist/index.js
```

### Step 2: Run frontend server
Navigate to the `frontend` folder

Run this command to update all dependencies. Only need to do it once
```
yarn install
```

Run this command to run the project
```
npm run dev
```

### Step 3: Navigate to `http://localhost:5173` url to start the game for player 1.

### Step 4: Navigate to `http://localhost:5173` url in a different tab/browser to start the game for player 2.

### Step 5(Important!!!!): Enjoy the game of chess.


## How to make changes and test locally.

## Backend
Step 1: make changes locally in backend source code.

Step 2: Build the code using this command: `tsc -b`

Step 3: run back end server: `node dist/index.js`

### Testing backend changes
Step 1: Make sure server is running.

Step 2: Navigate to `https://hoppscotch.io/realtime/websocket` to test the backend changes

Step 3: Enter this websocket url: `ws://localhost:8080/ws`

Step 4: Connect to server and make sure the connection is successful.

Step 5: Test your changes.

Example payloads.


#### Init game
{
  "type": "init_game"
}

#### Make move
{
  "type": "move",
  "move": {
    "from": “a2”,
    "to": “a3”
  }
}
