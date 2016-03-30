var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/books', require('./routes/books'));

var elastic = require('./elasticsearch');
elastic.indexExists().then(function (exists) {
    if (exists) {
        return elastic.deleteIndex();
    }
}).then(function () {
    return elastic.initIndex().then(elastic.initMapping).then(function () {
        var promises = [
            'The Lord of the Rings',
            'The Hobbit',
            'The Little Prince',
            'Harry Potter and the Philosopher`s Stone',
            'And Then There Were None'
        ].map(function (bookTitle) {
            return elastic.addBook({
                title: bookTitle,
                content: bookTitle + " content",
                metadata: {
                    titleLength: bookTitle.length
                }
            });
        });
        return Promise.all(promises);
    });
});

// Error handling middleware must be after all other middleware and routing.
// Handle error in development mode.
if (app.get('env') === 'development') {
    console.log('running in dev mode');
    app.use(function (err, req, res, next) {
        res.status(500).json(err.stack);
    });

// Handle error in production mode.
} else {
    console.log('running in production mode');
    app.use(function (err, req, res, next) {
        res.status(500).json(err.message);
    });
}

app.listen(5000, function () {
    console.log('Listening server on port 5000');
});
