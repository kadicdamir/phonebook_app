var User = require("../models/user");
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewareObj.checkOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.user._id).populate("entries").exec(function(err, foundUser) {
            if(err){
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
                        res.redirect("back");
                    }
                }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;