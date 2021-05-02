const axios = require("axios");
const config = require("../BL/config");

module.exports.getCaptainUpDetailsByUserId = (captainUpInternalId) => {
  let uri =
    config.captainUpUrlBase +
    "/players/" +
    captainUpInternalId +
    "?app=" +
    config.captainUpApiKey +
    "&api_secret=" +
    config.captainUpSecret;

  return axios.get(uri);
};

module.exports.getCaptainUpTop = (skip = 0, limit = 3) => {
  let uri =
    config.captainUpUrlBase +
    "/app/" +
    config.captainUpApiKey +
    `/leaderboards/all_time_ranking?limit=${limit}&skip=${skip}` +
    "&api_secret=" +
    config.captainUpSecret +
    "&name=all_time_ranking&extended=false&query=";
  return axios.get(uri);
};

module.exports.indicateTaskDoneToCaptainUp = (userCaptianupId, task) => {
  const params = new URLSearchParams();
  params.append("app", config.captainUpApiKey);
  params.append("secret", config.captainUpSecret);
  params.append("user", userCaptianupId);
  params.append("action[name]", task.actionName.toLowerCase());
  params.append("action[entity][captainUpID]", task.captainUpID);
  params.append("action[currencies][points][amount]", task.points);

  const reqConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  return axios.post(config.captainUpUrlBase + "/actions", params, reqConfig);
};

module.exports.calcTaskStatus = (task) => {
  // If never done this task,
  if (!task.status.recentlyCompleted) {
    task.status.status = "neverDone";
  } else {
    // Calc how many days passed since last training.
    let daysSinceCompleted = daysBetween(
      new Date(),
      task.status.recentlyCompleted
    );

    if (daysSinceCompleted > task.task.goodFor) {
      task.status.status = "expired";
    } else {
      task.status.status = "inShape";
      task.status.goodForDays = task.task.goodFor - daysSinceCompleted;
    }
  }

  return task;
};

const daysBetween = (date1, date2) => {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = date1 - date2;

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);
};
module.exports.daysBetween = daysBetween;