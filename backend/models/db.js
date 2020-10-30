const mongoose = require('mongoose');
require('./models');

// const dbURI = 'mongodb+srv://express_api:e2p0eB9bCSdvJhyY@cluster0.ooaot.mongodb.net/noisesensing?retryWrites=true&w=majority';

const dbURI = 'mongodb://127.0.0.1:27017';


mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    poolSize: 100
});


mongoose.connection.on('connected', () => {
    console.log(`Mongoose je povezan na ${dbURI}.`);
});

mongoose.connection.on('error', napaka => {
    console.log('Mongose napaka pri povezavi: ', napaka);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose ni povezan.');
});
