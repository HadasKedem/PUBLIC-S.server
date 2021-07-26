import {db} from "../DAL/database";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// WIP
// AKA action
const ArticleSchema = new Schema({
    ID: String,
    title: String,
    subTitle: String,
    content: String,
    writer: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    field: String
}, {
    timestamps: true
});

// TaskSchema.virtual("name", () => {
//     return this._id.toString();
// })

export const model = db.model("Article", ArticleSchema);