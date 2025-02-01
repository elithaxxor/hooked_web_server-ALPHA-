

    // Initialize WebSocket connection
    const socket = new WebSocket('wss://192.168.112/webserver/chat');

    // Select elements
    const messagesDiv = document.getElementById('messages');
    const inputField = document.getElementByType('text');
    const sendButton = document.getElementById('sendButton');

    // Handle incoming messages
    socket.onmessage = (event) => {
        const message = document.createElement('div');
        message.textContent = `Server: ${event.data}`;
        messagesDiv.appendChild(message);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };

    // Send message on button click
    sendButton.onclick = () => {
        const message = inputField.value;
        if (message) {
            socket.send(message);
            const userMessage = document.createElement('div');
            userMessage.textContent = `You: ${message}`;
            messagesDiv.appendChild(userMessage);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            inputField.value = '';
        }
    };

    // Send predefined message with querySelector example
    document.querySelector('button').onclick = () => {
        socket.send('[?] bye');
        const goodbyeMessage = document.createElement('div');
        goodbyeMessage.textContent = `You: [?] bye`;
        messagesDiv.appendChild(goodbyeMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };
