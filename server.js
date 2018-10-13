const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const port = process.env.PORT || 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.resolve('static')));


mongoose.connect('mongodb://localhost:27017/quoting_dojo', { useNewUrlParser: true });
mongoose.connection.on('connected', () => console.log("MongoDB Connected"));
const quoteSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        min: [2, 'Name has a min length of 2'],
        max: [20, 'Name has a max length of 20']
    },
    text: {
        type: String,
        required: [true, 'Quote is required'],
        min: [10, 'Quote has a min length of 10'],
        max: [100, 'Quote has a max length of 100']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Quote = mongoose.model('Quote', quoteSchema);

app.get('/', (req,res) => {
    res.render('index');
});
app.post('/quotes', (req, res) => {
    const quote = new Quote({
        name: req.body.name,
        text: req.body.text
    });
    quote.save()
    .then((saved) => {
        console.log(saved);
        res.redirect('quotes');
    })
    .catch((err) => {
        const errors = Object.keys(err.errors)
            .map(key => err.errors[key].message);
        res.render('index', {errors});
    });
});

app.get('/quotes', (req,res) => {
    Quote.find({})
        .then(quotes => res.render('quotes/index', {quotes}))
        .catch(console.log("Error in find"));
});
app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
