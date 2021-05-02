var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');

// Connection URI

// Dev (serverfull)
// let url = "mongodb://oggy-admin:w9TOrMvzWuBz5YKmGEeNHhc2TdnjcdzWcqPUz7Xn2qNmcuFfh6gmdUeXsMmwAcaUWlUpopTSx11V6kNTP7utlQ%3D%3D@oggy-admin.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@oggy-admin@";
let url = process.env.MONGO_CONNECT

// Prod (serverless)
// let url = "mongodb://oggyadmin:Y0duvp0fKbAkAmQuT6xelfOE7wZ6h6TIyu5pKs04bGb0TG3oUAPKLtHbbgOd8nOQnlIBEYeVealp3l5hbrbglw%3D%3D@oggyadmin.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@oggyadmin@";

mongoose
    .connect(url, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    });

const db = mongoose.connection;

module.exports = db;


