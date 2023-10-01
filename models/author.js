const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('deleteOne', async function (next) {
    try {
        let books = Book.find({author: this.id});
        if (books.length > 0){
            next(new Error('This author has books still'));
        } else {
            next();
        }
    }
    catch {
        next(err);
    }
});

module.exports = mongoose.model('Author', authorSchema);