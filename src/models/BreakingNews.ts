import {db} from "../DAL/database";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BreakingNewsSchema = new Schema({
    context: String,
    author: String,
    date: String
});


export const model = db.model("BreakingNews", BreakingNewsSchema);