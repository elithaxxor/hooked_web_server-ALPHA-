async function getVisitorInfo() {
    try {
        // Fetch public IP address
        const publicIpResponse = await fetch('https://ipinfo.io/json?token=a9134127b2ee10'); // Replace with your API key
        if (!publicIpResponse.ok) throw new Error('Failed to fetch public IP info');

        const publicIpData = await publicIpResponse.json();
        
        // Fetch local IP address
        const localIp = await getLocalIP();
        
        const visitorInfo = {
            publicIP: publicIpData.ip,
            location: publicIpData.city + ", " + publicIpData.region + ", " + publicIpData.country,
            isp: publicIpData.org,
            localIP: localIp
        };

        console.log("Visitor Info:", visitorInfo);
        return visitorInfo;
    } catch (error) {
        console.error("Error fetching visitor info:", error);
        return null;
    }
}

// Function to retrieve the local IP address using WebRTC
async function getLocalIP() {
    return new Promise((resolve) => {
        const peerConnection = new RTCPeerConnection({ iceServers: [] });

        peerConnection.createDataChannel(""); 
        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(offer))
            .catch(() => resolve(null));

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                const ipMatch = event.candidate.candidate.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                if (ipMatch) {
                    resolve(ipMatch[0]);
                }
            } else {
                resolve(null);
            }
        };
    });
}

// Call the function
var ipaddr = getVisitorInfo();
console.log("[!] found IP: ", ipaddr)


const websocket = require('ws');
const http = require('http');
// const wss = new websocket.Server({ port: 8080 });

// server.on('connection', (ws) => {

//     console.log('[!] Connection Established');

//     ws.on('connection', (ws) => {
//         console.log('[!] Connection Established');

//             ws.on('[+] message', (message) => {
//             console.log('[!] Incoming: %s', message);

//                 ws.send('[?] hi');
//             });

//         });
//     });
    // Initialize WebSocket connection
    const socket = new WebSocket('wss://', ipaddr);

    // Select elements
    const messagesDiv = document.getElementById('messages');
    const inputField = document.getElementById('input');
    const sendButton = document.getElementById('send');

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
            ionclickyeMessage.textContent = `You: [?] bye`;
        messagesDiv.appendChild(goodbyeMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } 
};
