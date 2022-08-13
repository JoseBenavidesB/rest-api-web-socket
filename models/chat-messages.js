

class Message {
    constructor( uid, name, message ){
        this.uid     = uid,
        this.name    = name,
        this.message = message
    }
};

class ChatMessages {
    
    constructor () {
        this.messages   = [];
        this.users      = {};
    
    
    };

    /* --------get the las 20 messages------- */
    get last20() {
        this.messages = this.messages.splice(0,10);
        return this.messages
    };

    /* --------get the users------- */
    get usersArr() {
        return Object.values( this.users ); 
    };

    /* --------send a message------- */
    sendMessage( uid, name, message ) {
        this.messages.unshift(
            new Message( uid, name, message )
        );
    };

    /* --------connect user------- */
    connectUser( user ){
        this.users[user.id]= user;
    };

    /* --------disconnect user------- */
    disconnectedUser( id ){
        delete this.users[id];
    }
};

module.exports = ChatMessages;