var User = require("../models/user");
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/");
};

middlewareObj.checkOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.user._id).populate("entries").exec(function(err, foundUser) {
            if(err){
                req.flash("error", "User not found!");
                res.redirect("back");
            } else {
                var found = false;
                foundUser.entries.forEach(function(entry){
                    if (entry._id.equals(req.params.id)) {
                         found = true;
                        }
                    });
                    if(found){
                        return next();
                    } else {
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

module.exports = middlewareObj;