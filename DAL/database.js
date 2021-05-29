var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');

// Connection URI

// Dev (serverfull)
let url = "mongodb+srv://newsdb:newsdb@news.j4xay.mongodb.net/NEWS?retryWrites=true&w=majority";


mongoose
    .connect(url, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    });

const db = mongoose.connection;

module.exports = db;


