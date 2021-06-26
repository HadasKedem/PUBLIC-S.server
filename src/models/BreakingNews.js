const mongoose = require('mongoose');

const breakingNewsSchema = new mongoose.Schema({

    content:{
        type:String,
        unique:true
    },
    author:String,
    date:Date


}, {
    timestamps: true
})

module.exports = mongoose.model("BreakingNews", breakingNewsSchema)