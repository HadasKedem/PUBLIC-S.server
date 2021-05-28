const User = require('../models/user')
const Task = require('../models/task')
const config = require('../BL/config');
const axios = require('axios');
const mongoose = require('mongoose');
const utilityManager = require('../BL/utilityManager');

module.exports.createUser = async function (req, res, next) {

  let user = new User(req.body);

  // Weird syntax but ok
  let isUnvalidObject = await user.validate().catch((e) => {
    return res.status(500).json(e.message)
  });
  if (isUnvalidObject && isUnvalidObject.statusCode === 500) {
    return;
  }

  user._id = mongoose.Types.ObjectId();

  // Create captainup user.
  let uri = config.captainUpUrlBase + '/app/5fab9f52a39ad7174326f8c9/players?secret=' + config.captainUpSecret + '&user[id]=' + user._id + '&user[name]=' + 'U-' + user._id;

  try {
    let captainupResponse = await axios.post(uri);
    if (captainupResponse && captainupResponse.data) {
      user.captainUpInternalId = captainupResponse.data.data.id
    } else {
      throw '';
    }
  } catch (error) {
    res.json("Failed to create user in CaptainUp server")
  }

  // Populate all tasks.
  let allTasks = await Task.find();

  let modifiedTasks = allTasks.map(t => ({
    task: t._id.toString(),
    status: { recentlyCompleted: null }
  }));

  user.tasks = modifiedTasks;

  let dbUser = await User.create(user)
    .catch(er => {
      res.json(er);
    })

  res.json(dbUser);
}

// TODO AUTH
module.exports.getAll_NOCAPTAINUP = async function (req, res, next) {

  let allUsers = await User.find();

  res.json(allUsers);
}

// TODO AUTH
module.exports.getUserByUsername = async function (req, res, next) {

  let user = await User.findOne({ username: req.query.username }).lean();

  if (!user) res.json("not found");

  let captainUpUser;

  try {
    captainUpUser = await utilityManager.getCaptainUpDetailsByUserId(user.captainUpInternalId);
  } catch (error) {
    return res.status(500).json("Failed to find user in CaptainUp server")
  }

  user.captainUpDetails = captainUpUser.data.data;

  res.json(user);
}


const getLeadingBoard = async function (skip, limit, currentUser) {
  let captainUpLeaders;

  try {
    captainUpLeaders = await utilityManager.getCaptainUpTop(skip, limit);
  } catch (error) {
    return "Failed to conenct to CaptainUp server";
  }

  if (!captainUpLeaders || !captainUpLeaders.data) {
    return [];
  }

  let topUsers = [];

  for (let user of captainUpLeaders.data.data) {
    // For case where ecaptain up id is not valid response.
    try {
      let dbUser = await User.findOne({ _id: user.app_specific_id });
      if (!dbUser) continue;

      topUsers.push({
        name: dbUser.profile.firstName + " " + dbUser.profile.lastName,
        isCurrentUser: currentUser.captainUpInternalId == user.id,
        points: user.currencies.points,
      });
    } catch (error) {
      continue;
    }
  }

  result = {
    top: topUsers,
  };

  if (!topUsers.some((l) => l.isCurrentUser)) {
    currentUser.captainUpData = await utilityManager.getCaptainUpDetailsByUserId(
      currentUser.captainUpInternalId
    );
    result["currentUser"] = {
      name: currentUser.profile.firstName + " " + currentUser.profile.lastName,
      points: currentUser.captainUpData.data.data.currencies.points,
      rank: currentUser.captainUpData.data.data.all_time_position,
      isCurrentUser: true,
    };
  }

  return result;
};


const howManyUsers = () => {
  return User.count();
};

module.exports.getWorst = async function (req, res, next) {
  let usersSize = await howManyUsers();
  let worsts = await getLeadingBoard(usersSize - 3, 3, req.user);
  res.json(worsts);
};
module.exports.getBest = async function (req, res, next) {
  let bests = await getLeadingBoard(0, 3, req.user);
  res.json(bests);
};

module.exports.getTasksFeed = async (req, res) => {

  // Fetch user.
  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).json("usernotfound");

  // Populate tasks.
  await user.populateTasks;
  user.calcTasksStatuses;

  user = user.toObject();
  user.tasks = user.tasks.filter(t => t.task && t.task.isActive);
  // TODO maybe isActive filter?

  res.json(user);
}

module.exports.getUsersProps = async (req, res) => {
  // Fetch user.
  let user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).json("usernotfound");

  let allUsers = await User.find()
  let resUsersArr = []

  for (let i = 0; i < allUsers.length; i++) {
    // Populate tasks.
    await allUsers[i].populateTasks
    allUsers[i].calcTasksStatuses;

    resUsersArr.push(allUsers[i].toObject())
  }

  res.json(resUsersArr);
}