const azure = require("azure-storage");

const Task = require('../models/task');
const mongoose = require('mongoose');
const User = require('../models/user')
const utilityManager = require('../BL/utilityManager');
const dotenv = require('dotenv');
dotenv.config();


uploadFile = async (req, res) => {
    const body = req.body
    res.json("abs")

}


createTask = async (req, res) => {

    const body = req.body
    console.log(body)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide info',
        })
    }
    if (body.type !== "Questions") {
        if (body.link === null) {
            return res.status(400).json({
                success: false,
                error: 'You must provide file',
            })
        }
        var blobSvc = azure.createBlobService(process.env.AZURE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCESS_KEY);


        var startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - 5);
        console.log(startDate);
        var expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        console.log(expiryDate);


        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                Start: startDate,
                Expiry: expiryDate
            }
        };

        let blobUrl = `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER}/${body.link}`;

        var token = blobSvc.generateSharedAccessSignature(process.env.AZURE_CONTAINER, body.link, sharedAccessPolicy);
        console.log(body.link);
        // var sasUrl = blobSvc.getUrl('oggy-storage', body.link, token,true);
        // body.link = blobSvc.getUrl('oggy-storage', link, process.env.AZURE_STORAGE_CONNECTION_STRING, process.env.AZURE_BLOB_HOST);
        blobUrl += `?${token}`;
        body.link = blobUrl;

        console.log(body.link);

    }




    const task = new Task(body)
    if (!task) {
        return res.status(400).json({ success: false, error: "err" })
    }

    //validate user data before saving ...
    console.log(task)
    task
        .save()
        .then(async () => {

            await addTaskToAllUsers(task);

            return res.status(201).json({
                success: true
            }).send();
        })
        .catch(error => {
            return res.status(400).json({
                error
            })
        })

}

addTaskToAllUsers = async (task) => {
    // TODO Hadas tests
    // return;
    await User.updateMany(
        {},
        {
            $push: {
                tasks: {
                    task: task._id,
                    status: {
                        recentlyCompleted: null
                    }
                }
            }
        },
    )
}

getAllTasks = async (req, res) => {
    await Task.find({}, (err, tasks) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!tasks.length) {

            return res
                .status(404)
                .json({ success: false, error: `Task not found` })
        }
        return res.status(200).json({ tasks })
    }).catch(err => console.log(err))
}

getTaskById = async (req, res) => {
    await Task.findOne({ _id: req.query.id }, async (err, task) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!task) {
            return res
                .status(404)
                .json({ success: false, error: `Task not found` })
        }
        task = task.toObject();

        // Try adding current user status.
        if (req.user) {
            let user = await User.findById(req.user._id)
            let usersStatus = user.tasks.find(t => t.task.toString() === req.query.id);
            if (usersStatus) {
                usersStatus = utilityManager.calcTaskStatus({ task: task, status: usersStatus.status }).status;
                task.userTaskDetails = usersStatus;
            }
        }
        return res.status(200).json(task)
    }).catch(err => console.log(err))
}

/** Marks task as done.
 * Be aware: tasks.task._id is not the same as tasks._id.
 * tasks.task._id Is for the task it self's id, while
 * tasks._id is the uniqe id for the task as it is stored in the user.tasks array.
 */
markTaskAsDone = async (req, res) => {
    let result = await User.findOneAndUpdate(
        {
            _id: req.user._id,
            tasks: { $elemMatch: { task: req.query._id } },
        },
        {
            $set:
            {
                "tasks.$.status.recentlyCompleted": new Date()
            }
        }
    )

    let task = result.tasks.find(t => t.task == req.query._id);

    task = await Task.findOne({ _id: task.task._id });

    let cr = await utilityManager.indicateTaskDoneToCaptainUp(req.user.captainUpInternalId, task);

    res.json(result);
};

/** RESETS DATA. do not use if not for development. */
resetTasksToAllUsers = async (req, res) => {
    if (req.query.password != "508932512256138") return res.json();

    let allTasks = await Task.find();

    let modifiedTasks = allTasks.map(t => ({
        task: t._id.toString(),
        status: { recentlyCompleted: null }
    }));

    await User.updateMany({}, { $set: { tasks: modifiedTasks } })

    res.json();
};

toggleTaskActiveness = async (req, res) => {
    Task.findOne({ _id: req.query._id }, (err, task) => {
        task.isActive = !task.isActive;
        task.save((err, upTask) => {
            res.status(200).send();
        })
    })
}

getTasksStats = async (req, res, next) => {

    let users = await User.find();

    let tasks = await Task.aggregate([
        {
            $match: {
                isActive: true
            }
        }
    ]);

    tasks.forEach(t => {
        t.usersDone = users.filter(u => {
            return u.tasks.find(ut => t._id.toString() == ut.task.toString()).status.recentlyCompleted
        }).length
    })

    res.json({ tasks: tasks.map(t => ({ _id: t._id, name: t.name, usersDone: t.usersDone })), numOfUsers: users.length });
}

module.exports = {
    createTask,
    toggleTaskActiveness,
    getAllTasks,
    markTaskAsDone,
    getTasksStats,
    resetTasksToAllUsers,
    getTaskById: getTaskById,
    uploadFile
}


