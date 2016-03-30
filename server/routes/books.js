var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');

router.get('/suggest/:input', function (req, res, next) {
    elastic.getSuggestions(req.params.input).then(function (result) {
        res.json(result)
    });
});

module.exports = router;
