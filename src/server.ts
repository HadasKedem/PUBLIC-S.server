// Server defaults
import {connectToJPost} from "./scrapping/WebScrapper";
import {handlePull} from "./scrapping/HandlePull";
import {ScrappingController} from "./controllers/ScrappingController";
import {ArticleController} from "./controllers/ArticleController";
import {UsersController} from "./controllers/UsersController";
import {CountryController} from "./controllers/CountryController";

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const scheduler = require("node-schedule")

app.use(cors());

// // Middlewares.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(__dirname + '/dist/'))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

let articleController = new ArticleController();
app.all('**', articleController.createRouter())
articleController.startWebSocket(Number(process.env.ARTICLE_WEBSOCKET_PORT) || 14000)
app.all('**', new ScrappingController().createRouter())
app.all('**', new UsersController().createRouter())
app.all("**", new CountryController().createRouter())


process.env.TZ = "Asia/Jerusalem";

// Select port using env or default 8080.
const httpPort = process.env.HTTP_PORT || 8080;
http.createServer(app).listen(httpPort);
console.log("http Server is live and running at port: " + httpPort);
scheduler.scheduleJob("* * * * *", () => connectToJPost().then(value => handlePull(value)))
