const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let clients = new Map();

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (data) => {
        const msg = JSON.parse(data);

        // Store username
        if (msg.type === "join") {
            clients.set(ws, msg.username);
            broadcast({
                type: "status",
                text: `${msg.username} joined the chat`
            });
        }

        // Normal chat message
        if (msg.type === "chat") {
            broadcast({
                type: "chat",
                username: clients.get(ws),
                text: msg.text
            });
        }
    });

    ws.on("close", () => {
        const username = clients.get(ws);
        clients.delete(ws);
        broadcast({
            type: "status",
            text: `${username} left the chat`
        });
    });
});

// Broadcast to all users
function broadcast(msg) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

console.log("WebSocket server running...");
