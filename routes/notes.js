var notes = undefined;
exports.configure = function(params) {
    notes = params;
}
 
var readNote = function(key, res, done) {
    notes.read(key, 
        function(err, data) {
            if(err) {
            res.render('showerror', {
                title: "Could not read note " + key,
                error: err
            });
        done(err);
    } else
        done(null, data);
    });
}
 
exports.view = function(req, res, next) {
    if(req.query.key) {
        readNote(req.query.key, res, function(err, data) {
            if(!err) {
                res.render('noteview', {
                    title: data.title,
                    notekey: req.query.key,
                    note: data
                });
            }
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            error: "Must provide a Key to view a Note"
        });
    }
}
 
exports.save = function(req, res, next) {
    ((req.body.docreate === "create") ? notes.create : notes.update)
    (req.body.notekey, req.body.title, req.body.body,
        function(err) {
        if(err) {
            res.render('showerror', {
                title: "Could not update file",
                error: err
            });
        } else {
            res.redirect('/noteview?key='+req.body.notekey);
        }
        });
   }
 
exports.add = function(req, res, next) {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: "",
        note: undefined
    });
}
 
exports.edit = function(req, res, next) {
    if(req.query.key) {
        readNote(req.query.key, res, function(err, data) {
            if(!err) {
                res.render('noteedit', {
                    title: data ? ("Edit " + data.title) : "Add a Note",
                    docreate: false,
                    notekey: req.query.key,
                    note: data
                });
            }
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            error: "Must provide a Key to view a Note"
        });
    }
}
 
exports.destroy = function(req, res, next) {
    if(req.query.key) {
        readNote(req.query.key, res, function(err, data) {
            if(!err) {
                res.render('notedestroy', {
                    title: data.title,
                    notekey: req.query.key,
                    note: data
                });
            }
        });
    } else {
        res.render('showerror', {
            title: "No key given for Note",
            error: "Must provide a Key to view a note"
        });
    }
}
 
exports.dodestroy = function(req, res, next) {
    notes.destroy(req.body.notekey, function(err) {
        if(err) {
            res.render('showerror', {
            title: "Could not delete Note " + req.body.notekey,
            error: err
            });
        } else {
            res.redirect('/');
        }
    });
}
