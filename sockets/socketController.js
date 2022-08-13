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

    socket.on('disconnect', () => {
        chatMessages.disconnectedUser( user.id );

        //emit everyone connected users
        io.emit('active-users', chatMessages.usersArr );
    })
};


module.exports = {
    socketController,
}