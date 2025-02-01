

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
            location: `${publicIpData.city}, ${publicIpData.region}, ${publicIpData.country}`,
            isp: publicIpData.org,
            localIP: localIp
        };

        console.log("Visitor Info:", visitorInfo);

        // Update the HTML elements with the fetched information
        document.getElementById("public-ip").textContent = visitorInfo.publicIP || "Unavailable";
        document.getElementById("local-ip").textContent = visitorInfo.localIP || "Unavailable";
        document.getElementById("location").textContent = visitorInfo.location || "Unavailable";
        document.getElementById("isp").textContent = visitorInfo.isp || "Unavailable";

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

// Function to use the retrieved IP in another process
function useIP() {
    const info = getVisitorInfo();
    const publicIp = document.getElementById("public-ip").textContent;
    console.log("INFO ", info);
    console.log("publicIP", publicIp)
    alert(`Using Public IP: ${publicIp}`);
    alert(`Using another Public IP: ${info}`);
}

// Run the script when the page loads
window.onload = () => {
    getVisitorInfo();
};
// Create a WebSocket connection to the server
const socket = new WebSocket("ws://localhost:8765");

// Event listener for when the connection is opened
socket.onopen = (event) => {
    console.log("WebSocket connection opened");
};

// Event listener for receiving messages from the server
socket.onmessage = (event) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<p>Server: ${event.data}</p>`;
};

// Event listener for when the connection is closed
socket.onclose = (event) => {
    console.log("WebSocket connection closed");
};

// Event listener for errors
socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

// Send message to the server when the button is clicked
document.getElementById("sendButton").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    socket.send(message); // Send the message to the server
    messageInput.value = ""; // Clear the input field
});