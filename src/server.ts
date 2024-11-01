import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const port = 3000;

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// Listen for WebSocket connections
wss.on('connection', (ws: WebSocket) => {
 console.log('New client connected');

 // Handle messages received from clients
 ws.on('message', (message: string) => {
   console.log(`Received message: ${message}`);
   // Echo the received message back to the client
   ws.send(`Server says: ${message}`);
 });

 // Handle client disconnections
 ws.on('close', () => {
   console.log('Client disconnected');
 });
});

// Express: Define a simple route
app.get('/', (req, res) => {
 res.send('Hello from Express!');
});

// Start the server
server.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);
});