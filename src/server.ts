import express from 'express';
import { WebSocketServer, WebSocket } from 'ws'
import Game  from './model/game/index'

const webSocketServer = new WebSocketServer({ port: 9090, path: '/publish' })
type gameStat = {gameId: number, game: Game}
type Lobby = { lobbyId: number,maxPlayers:number, score:number ,players: string[]}
type KeyData = {key: string}
type Message = {topic: string, message: any}
interface ClientMap extends Record<string, (data: any, ws: WebSocket) => void> {
    subscribe(data: KeyData, ws: WebSocket): void
    unsubscribe(data: KeyData, ws: WebSocket): void
    send(message: Message, ws: WebSocket): void
    close(message: any, ws: WebSocket): void
}
// const TopicManager = (topic : string , msg:{}) : string =>{
//     switch(topic){
//         case 'CreateLooby':
//             const {score,maxPlayers,userName} = msg
//             const lobby = CreateLooby(score,maxPlayers,userName)
            
//         case 'JoinLooby':
//             const {lobbyId,userName} = msg
//             return "OK"

//     }
//     return "Invalid topic"
// }
// const games = new Map<number, Game>();
// const CreateLooby = (score: number , maxPlayers: number , userName: string): Lobby => {
//    const  lobbyId =Math.round( Math.random() * 1000)
//     const players = [userName]
//     return {lobbyId,maxPlayers,score, players}

// }
// const JoinLooby = (lobby: Lobby , userName: string): Lobby => {
//     if(lobby.players.length < lobby.maxPlayers){
//         lobby.players.push(userName)
//     }
//     return lobby
// }
// const StartGame = (lobby: Lobby): gameStat => {
//     const game = new Game(lobby.players, lobby.score);
//     return {gameId: lobby.lobbyId, game}
// }
const clientMap = (): ClientMap => {
    const clients: Record<string, Set<WebSocket>> = {}

    const subscribers = (key: string) => {
        clients[key] ??= new Set()
        return clients[key]
    }

    const subscribe = ({key}: KeyData, ws: WebSocket) => {

        subscribers(key).add(ws)
    }

    const unsubscribe = ({key}: KeyData, ws: WebSocket) => subscribers(key).delete(ws)

    const send = ({topic, message}: {topic: string, message: {}}, _: WebSocket) => {
        for (let ws of subscribers(topic))
            if (ws.readyState === WebSocket.OPEN) 
                ws.send(JSON.stringify({topic, message}))
    }

    const close = (_: unknown, ws: WebSocket) => {
        if (ws.readyState === WebSocket.OPEN) 
            ws.close()
        for(let k in clients)
            clients[k].delete(ws)
    }

    return { subscribe, unsubscribe, send, close }
}

const clients = clientMap()

type Command = { type: string } & Record<string, unknown>

webSocketServer.on('connection', (ws, req) => {
    ws.on('message', message => {
        try {
            const { type, ...params } = JSON.parse(message.toString()) as Command
            if (clients[type] !== undefined)
                clients[type](params, ws)
            else //if (TopicManager(type, params) === "Invalid topic")
                console.error(`Incorrect message: '${message}' from ${req.socket.remoteAddress} (${req.socket.remoteFamily})`)
        } catch (e) {
            console.error(e)
        }
    })
    ws.on('close', () => clients.close({}, ws))
})

console.log('Pub/Sub server listening on 9090')