const mongoose = require('mongoose');



const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN );
    
        console.log('Online Database');

    } catch (error) {
        console.log(error);
        throw new Error('Error to connect Database');
    }


}



module.exports = {
    dbConnection
}
