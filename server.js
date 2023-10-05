const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/author');
const bookRouter = require('./routes/book');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    limit: '10mb', 
    extended: false
}));

const connect = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.DB}.sv0xg.mongodb.net/Library?retryWrites=true&w=majority`;

mongoose.connect(connect, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
});
db.once('open', () => {
    console.log("Connected to mongoose :)");
});

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

let PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`app running at http://localhost:${PORT}/`);
});