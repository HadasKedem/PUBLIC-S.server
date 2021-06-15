const mongoose = require('mongoose');

// Connection URI

// Dev (serverfull)
const url = "mongodb+srv://newsdb:newsdb@news.j4xay.mongodb.net/NEWS?retryWrites=true&w=majority";


mongoose
    .connect(url, { useNewUrlParser: true })
    .catch((e: { message: any; }) => console.error('Connection error', e.message)
    )

export const db = mongoose.connection;


