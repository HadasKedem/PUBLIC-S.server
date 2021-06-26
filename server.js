// Server defaults.
const express = require('express');
const bodyParser = require('body-parser');
// const history = require('connect-history-api-fallback');
const http = require('http');
const app = express();
const cors = require('cors');
const User = require('./models/user')
const dotenv = require('dotenv');



dotenv.config();
const jwt = require('jsonwebtoken');
// const auth = require('./BL/auth');
const config = require('./BL/config');

// DB connection.
const db = require('./DAL/database');
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function () {
    console.log("We're connected to MongoDB-Atlas!");
});

app.use(cors({ origin: ["http://localhost:3000", 'https://oggyclient.azurewebsites.net'], exposedHeaders: 'Authorization' }));
app.options('**', cors());

// // Middlewares.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/dist/'))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


// Login.
// app.post('/api/users/login', auth.login)

// Refresh token
// app.use('/api/users/refreshToken', auth.refreshToken)

// Auth
// app.use(auth.auth)


const router = require('./routers.route')
app.all('**', router)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    res.status(404).send();
});

// fetch breaking news every 6 hours
const schedule = require('node-schedule');
const scrapBreakingNews = require("./BL/WebScraper")
const job = schedule.scheduleJob('* 0,6,12,24 * * *', function(){
    scrapBreakingNews.fetchBreakingNews().then(news => {
        news.save()
    })
});

process.env.TZ = "Asia/Jerusalem";

// Select port using env or default 80.
const httpPort = process.env.HTTP_PORT || 80;
http.createServer(app).listen(httpPort);
console.log("http Server is live and running at port: " + httpPort);

module.exports = app;