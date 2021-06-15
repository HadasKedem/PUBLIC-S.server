// Server defaults
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
require('jsonwebtoken');
// const auth = require('./BL/auth');

// Controllers
const ArtifactController = require("./controllers/ArtifactController");

app.use(cors({ origin: ["http://localhost:3000", 'https://oggyclient.azurewebsites.net'], exposedHeaders: 'Authorization' }));
app.options('**', cors());

// // Middlewares.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/dist/'))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


const c_artifact = new ArtifactController.ArtifactController()
app.all('**', c_artifact.createRouter())

process.env.TZ = "Asia/Jerusalem";

// Select port using env or default 8080.
const httpPort = process.env.HTTP_PORT || 8080;
http.createServer(app).listen(httpPort);
console.log("http Server is live and running at port: " + httpPort);

module.exports = app;