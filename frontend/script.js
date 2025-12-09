let socket;
let username;

document.getElementById("joinBtn").onclick = () => {
    username = document.getElementById("username").value.trim();

    if (!username) return alert("Enter a username");

  socket = new WebSocket("wss://chat-system-lwde.onrender.com");


    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: "join",
            username
        }));
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        displayMessage(msg);
    };
};

document.getElementById("sendBtn").onclick = sendMessage;
document.getElementById("messageInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const text = document.getElementById("messageInput").value;
    if (!text) return;

    socket.send(JSON.stringify({
        type: "chat",
        text
    }));

    document.getElementById("messageInput").value = "";
}

function displayMessage(msg) {
    const area = document.getElementById("messages");

    if (msg.type === "status") {
        area.innerHTML += `<div class="status">${msg.text}</div>`;
        return;
    }

    const mine = msg.username === username;

    area.innerHTML += `
        <div class="message ${mine ? "me" : "other"}">
            <b>${msg.username}</b><br>
            ${msg.text}
        </div>
    `;

    area.scrollTop = area.scrollHeight;
}
