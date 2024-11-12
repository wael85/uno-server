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

# Join group of webSocket , if new key will create new group

{
"type": "subscribe",
"key": "15"
}
return => {"topic":"game key","message":"15"}

# Create New game

{
"type": "subscribe",
"key": "New Game"
}

# Create new game returns:

{"topic":"game key","message":"371"}

# Send to all players

{
"type": "send",
"topic": "15",
"message": {
//can be the state after each move user makes
}
}
