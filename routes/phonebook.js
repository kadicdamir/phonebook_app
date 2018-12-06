var express = require("express");
var router  = express.Router();
var Entry   = require("../models/entry");

router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/phonebook", isLoggedIn, function(req,res){
    Entry.find({}, function(err, entry){
        if(err){
            console.log(err);
        } else {
            res.render("index", {entries:entry});
        }
    });
});

router.post("/phonebook", isLoggedIn,function(req,res){
    var name = req.body.name;
    var number = req.body.number;
    var email = req.body.email;
    var newEntry = {name: name, number: number, email: email};
    Entry.create(newEntry, function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/phonebook");
        }
    });
});

router.get("/phonebook/new", isLoggedIn, function(req,res){
    res.render("new.ejs");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;