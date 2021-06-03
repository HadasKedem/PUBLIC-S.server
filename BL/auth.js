const User = require('../models/user')
const jwt = require('jsonwebtoken');
const config = require('./config');

const tryToLogin = async (username, password) => {
    let user = await User.findOne({ username: username });
    let isValid = user && user.comparePassword(password);
    return isValid && user.isActive ? user : false;
};

const verify = async (token) => {
    try {
        let d = jwt.verify(token, config.secret);
        return d;
    } catch (e) {
        return e.message;
    }
}
module.exports.verify = verify

module.exports.login = async (req, res, next) => {
    let user = await tryToLogin(req.body.username, req.body.password)
    if (!user) {
        return res.json("Authentication failed");
    }

    try {
        let token = createToken(user);
        return res.json(token);
    } catch (error) {
        return res.json("Authentication failed");
    }
}


module.exports.refreshToken = async (req, res, next) => {

    try {
        let payload = await verify(req.headers["authorization"].split(' ')[1]);
        if (!payload.username) throw 'failed'
        let token = createToken(await User.findById(payload._id))
        res.json(token)
    } catch (error) {
        res.json("failed");
    }
}

module.exports.auth = async (req, res, next) => {

    let payload = await verify(req.headers["authorization"]?.split(' ')[1]);
    if (payload.username) {
        req.user = payload;
        next();
    } else {
        res.json("failed");
    }
}

const createToken = (user) => {
    return jwt.sign({
        username: user.username,
        profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName
        },
        captainUpInternalId: user.captainUpInternalId,
        role: user.role,
        _id: user._id
    }, config.secret, {
        expiresIn: '7d'
    });
}

module.exports.requiresAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json("unauthorized")
    }

    if (req.user.role == "admin") {
        return next();
    }
    else {
        return res.status(401).json("unauthorized")
    }
}