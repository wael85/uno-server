# Uno server

# Join group of webSocket , if new key will create new group

{
"type": "subscribe",
"key": "15"
} 
return => {"topic":"game key","message":"371"}
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
