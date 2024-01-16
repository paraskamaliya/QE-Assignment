const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
    title: String,
    description: String,
    author: String,
    genre: String,
    date: String,
    username: String,
    userId: String
}, {
    versionKey: false
})
const BookModel = mongoose.model("book", bookSchema);
module.exports = { BookModel };