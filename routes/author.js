const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {};

    if (req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchOptions);

        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });

    } catch {
        res.redirect('/');
    }
});

// New author route
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author: new Author()
    });
});

// create author route 
router.post('/', (req, res) => {

    const author = new Author({
        name: req.body.name
    });

    author.save()
        .then((newAuthor) => {
            res.redirect(`authors`);
            //res.redirect(`authors/${newAuthor._id}`);
        })
        .catch((err) => {
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error creating author'
            });
        });
});

// get author by id
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id}).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch (err){
        console.log(err);
        res.redirect('/');
    }
});

// edit page
router.get('/:id/edit', async (req, res) => {
    try {
        let author = await Author.findById(req.params.id);
        res.render('authors/edit', {
            author: author
        });

    } catch {
        res.redirect('/authors')
    }
});

// update author
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name  = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    }
    catch {
        if(author == null){
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            });   
        }
    }
});

// delete author
router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        let books = await Book.find({author: author.id});
        if(books.length > 0){
            console.log('cannot delete author has books');
            return res.redirect('/authors');
        }
        await author.deleteOne();
        res.redirect('/authors');
    }
    catch (err){
        if(author === null){
            res.redirect('/');
        } else {
            console.log(err);
            res.redirect(`/authors/${author.id}`);
        }
    }
});

module.exports = router;