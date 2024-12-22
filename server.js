const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Servește fișierele statice (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rute pentru API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Stocăm utilizatorii autentificați
let users = {};

io.on('connection', (socket) => {
    console.log('Un utilizator s-a conectat');

    // Trimitem un mesaj de bun venit atunci când un utilizator se conectează
    socket.emit('message', 'Te rugăm să te autentifici.');

    // Autentificare utilizator
    socket.on('login', (username) => {
        // Validare nume utilizator
        if (!username || username.trim() === "") {
            socket.emit('message', 'Numele de utilizator nu poate fi gol.');
            return;
        }

        if (users[username]) {
            socket.emit('message', 'Nume de utilizator deja utilizat.');
            return;
        }

        // Dacă numele este valid și nu este deja utilizat, îl adăugăm la lista de utilizatori
        users[username] = socket.id;
        socket.emit('message', `Bine ai venit, ${username}! Poți începe să scrii în chat.`);
        console.log(`${username} s-a autentificat`);

        // Permitem utilizatorului să trimită mesaje doar după autentificare
        socket.on('chatMessage', (msg) => {
            io.emit('message', `${username}: ${msg}`);
        });
    });

    // Când un utilizator se deconectează
    socket.on('disconnect', () => {
        // Eliminăm utilizatorul din lista
        for (const [username, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                console.log(`${username} s-a deconectat`);
                delete users[username];
                break;
            }
        }
    });
});

// Pornim serverul pe portul definit
server.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});