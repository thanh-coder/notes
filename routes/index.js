var express = require('express');
var router = express.Router();
var notes = undefined;
exports.configure = function(params) {
    notes = params;
}
 
exports.index = router.get('/', function(req, res, next) {
    res.render('index', { title: 'Notes', notes: notes });
});
