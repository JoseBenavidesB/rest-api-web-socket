const { checkJWT } = require("../helpers/generate-jwt");
const {ChatMessages} = require("../models");

const chatMessages = new ChatMessages();


const socketController = async( socket, io ) => {

    const token = socket.handshake.headers['x-token'];

    const user = await checkJWT( token );
    if( !user ){
        return socket.disconnect();
    }

/* ------------Emit custom events-------------- */
    //when user is connected
    chatMessages.connectUser( user ); 

    //send all connected users 
    io.emit('active-users', chatMessages.usersArr )  //io for everyone
    socket.emit('message-receive', chatMessages.last20 ); //send messages to new user connect

    //connect user special room
    socket.join( user.id ); // there are 3 types of room: global | socket.id | user.id (custom)

    socket.on('disconnect', () => {
        chatMessages.disconnectedUser( user.id );
        //emit everyone connected users
        io.emit('active-users', chatMessages.usersArr );
    });

    //send message
    socket.on('send-message', ({ uid, message }) => {

        if( uid ) {
            //this is a private message
            socket.to( uid ).emit('private-message',{ from:user.name, message})
        } else {
            //save message on model
            chatMessages.sendMessage(user.id, user.name,  message)
            //emit messages to everyone
            io.emit('message-receive', chatMessages.last20 )
        };
    })
};


module.exports = {
    socketController,
}