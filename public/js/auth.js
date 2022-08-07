const myForm = document.querySelector('form');


const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://restt-server-node.herokuapp.com/api/auth'

//control data form 
myForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = {};

    for( let item of myForm.elements) {
        if ( item.name.length > 0){
            formData[item.name] = item.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-type': 'application/json'} 
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ) {
            return console.log(msg);
        }
        localStorage.setItem('token', token)
        console.log('success');
    })
    .catch( err => {
        console.log(err);
    })
})


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
            localStorage.setItem('token', token);
        })
        .catch(console.log)
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}