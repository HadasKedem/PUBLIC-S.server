const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// WIP
// AKA action
const TaskSchema = new Schema({

    name: String,
    isActive: {
        type: Boolean, default: true
    },
    captainUpID: String,
    link: String,
    points: Number,
    textContent: String,
    type: {
        type: String,
        enum: ['Document', 'Video', 'Questions']
    },
    actionName: String,
    badges: [],
    // Days
    goodFor: {
        type: Number,
        default: 180
    },
    canBeRenewedIn: {
        type: Number,
        default: 30
    }
}, {
    timestamps: true
});

// TaskSchema.virtual("name", () => {
//     return this._id.toString();
// })

module.exports = mongoose.model("Task", TaskSchema);