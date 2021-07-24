import {db} from "../DAL/database";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// WIP
// AKA action
const schema = new Schema({
    title: String,
    alpha2: String,
    country: String,
    latitude: Number,
    alpha3: String,
    longitude: Number,
    numeric: Number,

});

// TaskSchema.virtual("name", () => {
//     return this._id.toString();
// })

export const model = db.model("Country", schema);