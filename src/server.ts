// Server defaults
import {connectToJPost} from "./scrapping/WebScrapper";
import {handlePull} from "./scrapping/HandlePull";
import {ScrappingController} from "./controllers/ScrappingController";
import {ArtifactController} from "./controllers/ArtifactController";

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const scheduler = require("node-schedule")
require('jsonwebtoken');
// const auth = require('./BL/auth');

app.use(cors({ origin: ["http://localhost:3000", 'https://oggyclient.azurewebsites.net'], exposedHeaders: 'Authorization' }));
app.options('**', cors());

// // Middlewares.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/dist/'))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


app.all('**', new ArtifactController().createRouter())
app.all('**', new ScrappingController().createRouter())

process.env.TZ = "Asia/Jerusalem";

// Select port using env or default 8080.
const httpPort = process.env.HTTP_PORT || 8080;
http.createServer(app).listen(httpPort);
console.log("http Server is live and running at port: " + httpPort);
scheduler.scheduleJob("* * * * *", () => connectToJPost().then(value => handlePull(value)))
