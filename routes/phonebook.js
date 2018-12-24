var express     = require("express");
var router      = express.Router();
var Entry       = require("../models/entry");
var User        = require("../models/user");
var middleware  = require("../middleware");

router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/phonebook", middleware.isLoggedIn, function(req,res){
    User.findById(req.user._id).populate("entries").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("index", {entry:foundUser.entries});
        }
    });
});

// POST ROUTE

router.post("/phonebook", middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var number = req.body.number;
    var email = req.body.email;
    var newEntry = {name: name, number: number, email: email};
    Entry.create(newEntry, function(err,newlyCreated){
        if(err){
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            User.findById((req.user._id),function(err, foundUser) {
                if(err){
                    console.log(err);
                } else {
                    foundUser.entries.push(newlyCreated);
                    foundUser.save(function(err,data){
                        if(err){
                            console.log(err);
                        } else {
                            req.flash("success", "Successfully added a new entry");
                            res.redirect("/phonebook");
                        }
                    });
                }
            });
        }
    });
});
      
router.get("/phonebook/new", middleware.isLoggedIn, function(req,res){
    res.render("new.ejs");
});

// EDIT ROUTE

router.get("/phonebook/:id/edit", middleware.checkOwnership, function(req,res){
    Entry.findById((req.params.id),function(err, foundEntry){
        if(err){
            res.redirect("back");
        } else {
            res.render("edit", {entry:foundEntry});
        }
    });
});

/*router.post("/phonebook/save", function(req,res){
if(){
    var name = req.body.name;
    var number = req.body.number;
    var email = req.body.email;
    var newEntry = {name: name, number: number, email: email};
    Entry.create(newEntry, function(err,newlyCreated){
        if(err){
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            User.findById((req.user._id),function(err, foundUser) {
                if(err){
                    console.log(err);
                } else {
                    foundUser.entries.push(newlyCreated);
                    foundUser.save(function(err,data){
                        if(err){
                            console.log(err);
                        } else {
                            req.flash("success", "Successfully added a new entry");
                            res.redirect("/phonebook");
                        }
                    });
                }
            });
        }
    });
}
else { 
    Entry.findById((req.body.id),function(err, foundEntry){
        if(err){
            res.redirect("back");
        } else {
            res.render("edit", {entry:foundEntry});
        }
    });
    
}
    
});*/



router.put("/phonebook/:id", middleware.checkOwnership,function(req,res){
    Entry.findByIdAndUpdate((req.params.id), req.body.entry, function(err,updatedEntry){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/phonebook");
        }
    });
});

// DELETE ROUTE
router.delete("/phonebook/:id", middleware.checkOwnership, function(req,res){
   Entry.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Entry deleted");
           res.redirect("/phonebook");
       }
   });
});

module.exports = router;