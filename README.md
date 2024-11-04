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

