import {db} from "../DAL/database";
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema


// WIP
// AKA action
const ArticleSchema = new Schema({

    ID: String,
    title: String,
    subTitle: String,
    content: String,
    writer: {
        type: ObjectId,
        ref: "User"
    },
    field: String
}, {
    timestamps: true
});

// TaskSchema.virtual("name", () => {
//     return this._id.toString();
// })

export const model = db.model("Article", ArticleSchema);