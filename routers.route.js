
// var dal = require("./DAL/database");
// var generalCalc = require("./BL/generalCalc.js");
// var config = require("./BL/config.js");
// const jwt = require('jsonwebtoken');
// const Training = require('./schemas/training-schema');
// var multer = require('multer')
// var MulterAzure = require('multer-azure')
// var upload = multer({
//     storage: new MulterAzure({
//         connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
//         container: 'oggy-storage',
//         blobPathResolver: function (req, file, callback) {
//             var blobPath = req.query.name; //Calculate blobPath in your own way.
//             callback(null, blobPath);
//         }
//     })
// })

// const userCtrl = require('./controllers/user-controller')
// const taskCtrl = require('./controllers/task-controller')
//
//
// var express = require('express');
// const { requiresAdmin } = require('./BL/auth');
// const router = express.Router();
//
// // router.post('/api/files/upload', userCtrl.uploadFile);
// router.post("/api/users/create", requiresAdmin, userCtrl.createUser);
// router.get("/api/users/getAll", requiresAdmin, userCtrl.getAll_NOCAPTAINUP);
// router.get("/api/users/getUserByUsername", userCtrl.getUserByUsername);
// router.get("/api/users/getBest", userCtrl.getBest);
// router.get("/api/users/getWorst", requiresAdmin, userCtrl.getWorst);
// router.get("/api/users/getTasksFeed", userCtrl.getTasksFeed);
// // TODO requiresAdmin?
// router.get("/api/users/getUsersProps", userCtrl.getUsersProps);
//
// router.post('/api/tasks/create', requiresAdmin, taskCtrl.createTask);
// router.post('/api/tasks/upload', requiresAdmin, upload.array("file"), taskCtrl.uploadFile);
// router.get('/api/tasks/getAll', taskCtrl.getAllTasks);
// router.post('/api/tasks/markTaskAsDone', taskCtrl.markTaskAsDone);
// router.get('/api/tasks/getTaskById', taskCtrl.getTaskById);
// router.get('/api/tasks/resetTasksToAllUsers', requiresAdmin, taskCtrl.resetTasksToAllUsers);
// router.post('/api/tasks/toggleTaskActiveness', requiresAdmin, taskCtrl.toggleTaskActiveness);
// router.get('/api/tasks/getTasksStats', requiresAdmin, taskCtrl.getTasksStats);

var express = require('express');
const router = express.Router();
router.get('/helloWorld', function (req, res) {
    res.send("I am alive!")
} )

var webScrapper = require('./BL/WebScraper')
router.get('/scraper',function (req, res) {
    webScrapper.connectToJPost().then(function (result) {
        res.send(result)
    }).catch(function (error) {
        res.status = 400;
        res.send("error in scrapper " + error);
    })
})

module.exports = router;