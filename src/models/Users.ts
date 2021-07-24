import {db} from "../DAL/database";
const validator = require('validator');
const bcrypt = require("bcrypt");
const HASH_ROUNDS = 10;
import  {Schema, HookNextFunction} from 'mongoose';

const {ObjectId} = require("mongoose").Schema

const usersSchema = new Schema({

    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [ validator.isEmail, 'invalid email' ],
    },
    password: { type: String, required: true },
    country: {type: ObjectId, ref: "Country", required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    isWriter: {type: Boolean, required: true, default: false}
}, {
timestamps: true
})

usersSchema.pre('save', async function (next: HookNextFunction) {
    const thisObj : any = this;

    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(HASH_ROUNDS);
        thisObj.password = await bcrypt.hash(thisObj.password, salt);
        return next();
    } catch (e) {
        return next(e);
    }
});

usersSchema.methods.comparePassword = function(candidatePassword, cb) {
    const thisObj : any = this;
    bcrypt.compare(candidatePassword, thisObj.password, function(err:any, isMatch:any) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Omit the password when returning a user
usersSchema.set('toJSON', {
    transform: function (doc:any, ret:any) {
        delete ret.password;
        return ret;
    }
});

export const model = db.model("Users", usersSchema);