/* --------HTML References---------- */
const myForm = document.querySelector('form'); // Login form

/* -------- SIGN IN ---------------- */
const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://restt-server-node.herokuapp.com/api/auth'

//control data form (LOGIN)
myForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = {};
    //console.log(myForm.elements);
    for( let item of myForm.elements) {
        if ( item.name.length > 0){
            formData[item.name] = item.value;
        }
    }

    /* ----------- LOGIN ----------- */
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-type': 'application/json'} 
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => { //RETURN only msg and TOKEN
        if( msg ) {
            return console.error(msg);
        }
        localStorage.setItem('token', token)
        window.location = 'chat.html';
        console.log('success');
    })
    .catch( err => {
        console.log(err);
    })
})

/* -------- Google SIGN IN ---------------- */
function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    // console.log(id_token)
    const data = { id_token }

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, //wich type i need the data
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            if( msg ) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log)
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}