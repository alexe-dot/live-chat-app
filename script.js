
const socket = io();
let currentUser = '';

// Afișăm un mesaj din server
socket.on('message', (msg) => {
    appendMessage(msg, 'received');

    // Dacă utilizatorul s-a logat, ascunde formularul de login și arată chat-ul
    if (msg.startsWith('Bine ai venit')) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    }

    // Dacă există o eroare (ex: nume de utilizator deja folosit sau invalid)
    if (msg === 'Nume de utilizator deja utilizat.' || msg === 'Numele de utilizator nu poate fi gol.') {
        alert(msg);
    }
});

// Funcția de login
function login() {
    const username = document.getElementById('username').value;
    if (username) {
        socket.emit('login', username);  // Trimite numele de utilizator la server
        currentUser = username;
        document.getElementById('username').value = '';
    } else {
        alert('Te rugăm să introduci un nume de utilizator!');
    }
}

// Trimite mesajele la server atunci când utilizatorul apasă Enter
function sendMessage(event) {
    if (event.key === 'Enter' && messageInput.value.trim() !== '') {
        socket.emit('chatMessage', messageInput.value);  // Trimite mesajul la server
        appendMessage(messageInput.value, 'sent');
        messageInput.value = '';
    }
}

// Adaugă mesaje în chat
function appendMessage(text, type) {
    let message = document.createElement('div');
    message.classList.add('message', type);
    message.textContent = text;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Evenimentul de login
document.getElementById('login-button').addEventListener('click', login);

// Eveniment pentru trimiterea mesajelor
let messageInput = document.getElementById('message-input');
let messagesContainer = document.getElementById('messages');
messageInput.addEventListener('keyup', sendMessage);
