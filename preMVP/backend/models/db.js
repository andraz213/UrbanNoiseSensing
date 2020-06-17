const mongoose = require('mongoose');
require('./data');

const dbURI = 'mongodb+srv://express_api:e2p0eB9bCSdvJhyY@cluster0.ooaot.mongodb.net/noisesensing?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
