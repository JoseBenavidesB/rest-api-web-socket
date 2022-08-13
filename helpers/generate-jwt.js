const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateJWT = ( uid = '' ) => {
    
    return new Promise ( (resolve, reject) => {

        const payload = { uid };

        //sign para firmar, al final opciones
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token) => { //callback si hay error y si todo sale bien

            if(err) {
                console.log(err)
                reject("No se pudo generar el token")
            } else {
                resolve( token );
            }
        })

    })
};

const checkJWT = async( token = '') => {

    try {
        

        if( token < 10 ){
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const user = await User.findById( uid );

        if( user && user.status ){
            return user;
        } else {
            return null;
        }

    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    generateJWT,
    checkJWT
}