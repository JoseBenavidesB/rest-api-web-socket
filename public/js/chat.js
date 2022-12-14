/* --------HTML References---------- */
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');


/* -------- SIGN IN ---------------- */
const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://restt-server-node.herokuapp.com/api/auth'


let user = null;
let socket = null;

//validate JWT from loal storage
const validateJWT = async() =>{

    const token = localStorage.getItem('token');

    if ( !token || token.length <= 10 ) {
        window.location = 'index.html' //redirect
        throw new Error('There is not any token')
    };

    try {
        const resp = await fetch( url, {
            headers: { 'x-token': token }
        });
        const { user: userDB, token: tokenDB } = await resp.json();
        localStorage.setItem('token', tokenDB);
        user = userDB;

        //console.log(user);
        document.title = user.name;

        //enable socket connection
        await connectSocket();

    } catch (error) {
        console.log(error);
    };

    

};

/* ------------Connect Socket ------------ */
const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('sockets online');
    });

    socket.on('disconnect', () =>{
        console.log('Sockets disconnect');
    });

/* -----------Event custom Listen---------- */
    socket.on('message-receive', (payload) => {
        listMessages(payload);
    });

    socket.on('active-users', (payload) => {
        listUsers(payload);
    });

    socket.on('private-message', ( payload ) => {
        console.log('private: ', payload);
    });
};
/* -----llist users------ */
const listUsers = ( users = [] ) =>{
    let usersHTML = '';
    users.forEach(({ name, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success item">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    })

    ulUsers.innerHTML = usersHTML;
};

/* -----list messages------ */
const listMessages = ( messages = [] ) =>{
    let messagesHTML = '';
    messages.forEach(({ name, message }) => {
        messagesHTML += `
            <li>
                <p>
                    <span class="text-primary item">${name}:</span>
                    <span class="fs-6">${message}</span>
                </p>
            </li>
        `
    })

    ulMessages.innerHTML = messagesHTML;
};

/* -----listener on txtMessage input */
txtMessage.addEventListener('keyup',({ keyCode }) =>{

    const message = txtMessage.value;
    const uid     = txtUid.value

    if( keyCode !== 13 ){ return };

    if(message.length <= 0) { return };

    //emit event send-message to server
    socket.emit('send-message', { message, uid } );

    //clear input txtMessage
    txtMessage.value = '';

});

/* -----------logout----------- */
btnLogout.addEventListener('click', () =>{
    localStorage.removeItem('token');
    window.location = 'index.html'
})

/* -----execute */
const main = async() => {

    //validate JWT
    await validateJWT();
};


main();


