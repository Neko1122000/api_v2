const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 8080;

mongoose.connect('mongodb://localhost:27017/api_v2', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//require('../api_v2/model/seed');

const router = require('../api_v2/router/router');
app.use('/', router);

app.listen(port, () => {
    console.log('Listening port ' + port);
});