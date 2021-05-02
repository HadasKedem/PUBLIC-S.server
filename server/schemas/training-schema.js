const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Training = new Schema(
    {
        email: { type: String, required: true },
        title: { type: String, required: true },
        link: { type: String, required: true },
        isActive: {type: Boolean, required: true}
    },
    { timestamps: true },
);

module.exports = mongoose.model('trainings', Training);