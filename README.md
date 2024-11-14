
# Uno server

# Sign up

{
"type":"signup",
"username":"Wael2",
"password": "Wael2"
}
returns => { "topic":"signup","message":{"username":"Wael2","password":"Wael2","\_id":"673355d6d595b9982ada7b2b","\_\_v":0} }

# login

{
"type":"login",
"username": "wael",
"password":"wael"
}

# Create new Game

{
"type": "createGame",
"numberOfPlayers": 4,
"score": 500,
"creator": "Wael"
} return => { "topic":"game key","message":{"game":{"gameId":"6733dd92c53c646bb63693f4","players":["Wael"],"targetScore":500,"playerCount":4,"playerScores":[0,0,0,0],"cardsPerPlayer":7,"dealer":3,"status":"Waiting"} } }

# Join Game

{
"type": "joinGame",
"gameId": "6733e39e231d4b3db4031545",
"player": "Wael3"
}
All Players in the game receives => {"topic":"joinGame","message":{"players":["Wael","Wael3"]} }

# Start Game

{
"type": "startGame",
"key": "6733e606ee6ec43eed703f82"

} Returns to all players : note that status become playing

{"topic":"startGame","message":{"result":{"players":["Wael","Wael3","Wael5"],"targetScore":500,"playerCount":4,"playerScores":[0,0,0,0,0,0],"handAtPlay":{"playerHands":[[{"type":"REVERSE","color":"GREEN","value":20},{"type":"NUMBERED","color":"GREEN","value":4},{"type":"DRAW2","color":"BLUE","value":20},{"type":"NUMBERED","color":"GREEN","value":1},{"type":"NUMBERED","color":"GREEN","value":5},{"type":"DRAW2","color":"YELLOW","value":20},{"type":"NUMBERED","color":"BLUE","value":0},{"type":"NUMBERED","color":"YELLOW","value":1},{"type":"REVERSE","color":"RED","value":20}],[{"type":"NUMBERED","color":"BLUE","value":8},{"type":"NUMBERED","color":"YELLOW","value":1},{"type":"DRAW4","color":"all","value":50},{"type":"NUMBERED","color":"RED","value":1},{"type":"NUMBERED","color":"GREEN","value":0},{"type":"SKIP","color":"BLUE","value":20},{"type":"NUMBERED","color":"YELLOW","value":7}],[{"type":"NUMBERED","color":"BLUE","value":2},{"type":"NUMBERED","color":"BLUE","value":7},{"type":"NUMBERED","color":"RED","value":2},{"type":"NUMBERED","color":"BLUE","value":7},{"type":"NUMBERED","color":"GREEN","value":1},{"type":"NUMBERED","color":"GREEN","value":3},{"type":"WILD","color":"all","value":50}]],"discardPile":[{"type":"DRAW2","color":"RED","value":20}],"shouldSayUno":[false,false,false],"callbacks":[],"ended":false,"playerCount":3,"players":["Wael","Wael3","Wael5"],"dealer":3,"turn":1,"cardsPerPlayer":7,"direction":"left","deck":{"deck":[{"type":"NUMBERED","color":"GREEN","value":3},{"type":"NUMBERED","color":"BLUE","value":5},{"type":"NUMBERED","color":"RED","value":5},{"type":"NUMBERED","color":"GREEN","value":5},{"type":"NUMBERED","color":"YELLOW","value":3},{"type":"SKIP","color":"RED","value":20},{"type":"NUMBERED","color":"RED","value":6},{"type":"NUMBERED","color":"RED","value":1},{"type":"NUMBERED","color":"YELLOW","value":4},{"type":"NUMBERED","color":"RED","value":8},{"type":"SKIP","color":"YELLOW","value":20},{"type":"NUMBERED","color":"GREEN","value":2},{"type":"NUMBERED","color":"RED","value":5},{"type":"NUMBERED","color":"GREEN","value":6},{"type":"NUMBERED","color":"BLUE","value":2},{"type":"DRAW2","color":"GREEN","value":20},{"type":"NUMBERED","color":"YELLOW","value":8},{"type":"NUMBERED","color":"RED","value":3},{"type":"NUMBERED","color":"RED","value":4},{"type":"NUMBERED","color":"YELLOW","value":4},{"type":"DRAW4","color":"all","value":50},{"type":"DRAW4","color":"all","value":50},{"type":"NUMBERED","color":"RED","value":2},{"type":"REVERSE","color":"BLUE","value":20},{"type":"REVERSE","color":"RED","value":20},{"type":"NUMBERED","color":"YELLOW","value":5},{"type":"NUMBERED","color":"YELLOW","value":2},{"type":"NUMBERED","color":"YELLOW","value":6},{"type":"DRAW2","color":"GREEN","value":20},{"type":"NUMBERED","color":"YELLOW","value":5},{"type":"NUMBERED","color":"RED","value":7},{"type":"NUMBERED","color":"GREEN","value":2},{"type":"NUMBERED","color":"YELLOW","value":7},{"type":"NUMBERED","color":"BLUE","value":4},{"type":"NUMBERED","color":"BLUE","value":3},{"type":"NUMBERED","color":"BLUE","value":1},{"type":"SKIP","color":"BLUE","value":20},{"type":"NUMBERED","color":"BLUE","value":1},{"type":"NUMBERED","color":"BLUE","value":6},{"type":"NUMBERED","color":"GREEN","value":7},{"type":"DRAW2","color":"RED","value":20},{"type":"NUMBERED","color":"GREEN","value":6},{"type":"REVERSE","color":"BLUE","value":20},{"type":"NUMBERED","color":"RED","value":8},{"type":"SKIP","color":"RED","value":20},{"type":"DRAW2","color":"YELLOW","value":20},{"type":"NUMBERED","color":"YELLOW","value":0},{"type":"NUMBERED","color":"GREEN","value":7},{"type":"NUMBERED","color":"BLUE","value":4},{"type":"SKIP","color":"GREEN","value":20},{"type":"SKIP","color":"GREEN","value":20},{"type":"WILD","color":"all","value":50},{"type":"NUMBERED","color":"RED","value":7},{"type":"NUMBERED","color":"GREEN","value":8},{"type":"NUMBERED","color":"YELLOW","value":9},{"type":"NUMBERED","color":"RED","value":6},{"type":"REVERSE","color":"YELLOW","value":20},{"type":"NUMBERED","color":"BLUE","value":6},{"type":"NUMBERED","color":"YELLOW","value":3},{"type":"NUMBERED","color":"GREEN","value":8},{"type":"NUMBERED","color":"YELLOW","value":9},{"type":"NUMBERED","color":"YELLOW","value":8},{"type":"NUMBERED","color":"GREEN","value":4},{"type":"NUMBERED","color":"YELLOW","value":6},{"type":"NUMBERED","color":"RED","value":9},{"type":"WILD","color":"all","value":50},{"type":"REVERSE","color":"YELLOW","value":20},{"type":"DRAW4","color":"all","value":50},{"type":"NUMBERED","color":"RED","value":3},{"type":"NUMBERED","color":"BLUE","value":9},{"type":"NUMBERED","color":"RED","value":4},{"type":"NUMBERED","color":"GREEN","value":9},{"type":"SKIP","color":"YELLOW","value":20},{"type":"NUMBERED","color":"RED","value":9},{"type":"NUMBERED","color":"BLUE","value":5},{"type":"NUMBERED","color":"BLUE","value":9},{"type":"NUMBERED","color":"BLUE","value":3},{"type":"NUMBERED","color":"BLUE","value":8},{"type":"NUMBERED","color":"GREEN","value":9},{"type":"DRAW2","color":"BLUE","value":20},{"type":"NUMBERED","color":"RED","value":0},{"type":"NUMBERED","color":"YELLOW","value":2},{"type":"REVERSE","color":"GREEN","value":20},{"type":"WILD","color":"all","value":50}]},"currentColor":"RED"},"cardsPerPlayer":7,"dealer":3,"status":"Playing"} } }

# ToDo

1. Remove subscriber , subscription and clients sockets because it added to game
2. Handel save to update the game in database
3. Handel On_init to retreave all games from database
4. Handel GetMyGame
5. Handel Make move and check rolse

# uno-server

# Join group of webSocket , if new key will create new group

{
    "type": "subscribe",
    "key": "15"
}

# Send to all players

{
    "type": "send",
    "topic": "15",
    "message": {
        //can be the state after each move user makes
    }
}


