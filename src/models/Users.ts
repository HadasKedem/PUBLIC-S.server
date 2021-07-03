import {db} from "../DAL/database";
import {UsersController} from "../controllers/UsersController";
const validator = require('validator');
const bcrypt = require("bcrypt");
const HASH_ROUNDS = 10;
import mongoose, { Schema, HookNextFunction } from 'mongoose';

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

usersSchema.methods.validatePassword = async function (pass: string) {
    const thisObj : any = this;
    return bcrypt.compare(pass, thisObj);
};


// Omit the password when returning a user
usersSchema.set('toJSON', {
    transform: function (doc:any, ret:any) {
        delete ret.password;
        return ret;
    }
});


export const model = db.model("Users", usersSchema);