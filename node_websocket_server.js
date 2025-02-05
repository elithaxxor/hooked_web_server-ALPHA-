const io = require('socket.io')(3001); 

const user_name_log = {}; 
const chat_log = {}; 

io.on('connection', socket => {
    console.log(""); 
    socket.emit("god says: ", "Hi, peanut");

    // stores the username and socket id in an object
    socket.on("new-user", new_user_name => {
        user_name_log[socket.id] = new_user_name; 
        socket.broadcast.emit('user-connected', "has joined");
        console.log('ID: ', user_name_log.id , 'user: ' , new_user_name); 
    })
    socket.on("chat-message", message => {
        chat_log[socket.id] = message;
        // creates an object with the user's name and the message that is depackaged on clients side 
        socket.broadcast.emit('chat-message', { message: message, name: user_name_log[socket.id]}); 
        console.log('ID: ', chat_log.id , 'MSG:: ' ,message); 

    })

    socket.on("user-disconnected", () => {
        socket.broadcast.emit('user-disconnected: ', user_name_log[socket.id]);
        console.log('ID: ', user_name_log.id , 'user: ' , user_name_log[socket.id]);
        delete user_name_log[socket.id];
    })
});
