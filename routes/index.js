var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

/*router.get("/register", function(req, res) {
    res.render("register");
});*/

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/phonebook");
        });
    });
});

/*router.get("/login", function(req, res) {
    res.render("login", {message: req.flash("error")});
});*/

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/phonebook",
        failureRedirect: "/",
        failureFlash: "Invalid username or password"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/");
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/phonebook',
                                      failureRedirect: '/' }));

module.exports = router;