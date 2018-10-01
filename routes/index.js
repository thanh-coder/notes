var express = require('express');
var router = express.Router();
var notes = undefined;
exports.configure = function(params) {
    notes = params;
}
 var express = require('express');
var router = express.Router();
var notes = undefined;
exports.configure = function(params) {
    notes = params;
}
/* GET home page. */
  
exports.index = router.get('/', function(req, res, next) {  
    notes.titles(function(err, titles) {        
        if(err) {           
            res.render('showerror', {
                title: "Could not retrieve note keys from data store",
                error: err,
                user: req.user ? req.user : undefined
            });
        } else {                        
            res.render('index', { 
                title: "Notes", 
                notes: titles,
                user: req.user ? req.user : undefined
            });         
        }
    });
});