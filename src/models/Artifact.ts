import {db} from "../DAL/database";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// WIP
// AKA action
const ArtifactSchema = new Schema({
    name: String,
    text: String,
    title: String,
}, {
    timestamps: true
});

// TaskSchema.virtual("name", () => {
//     return this._id.toString();
// })

export const model = db.model("Artifact", ArtifactSchema);