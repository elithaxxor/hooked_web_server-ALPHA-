const io = require('socket.io')(3001); 

const user_name_log = {}; 
const chat_log = {}; 

io.on('connection', socket => {
    console.log(""); 
    socket.emit("god says: ", "Hi, peanut");

    socket.on("event-data", eData => {
        console.log("Received event data: ", eData);
    })
}); 