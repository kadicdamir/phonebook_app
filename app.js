var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require ("passport-local"),
    User            = require("./models/user"),
    Entry           = require("./models/entry");


mongoose.connect("mongodb://localhost:27017/phonebook_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "Bilo kakva recenica",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/phonebook", isLoggedIn, function(req,res){
    Entry.find({}, function(err, entry){
        if(err){
            console.log(err);
        } else {
            res.render("index", {entries:entry});
        }
    });
});

app.post("/phonebook", isLoggedIn,function(req,res){
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

app.get("/phonebook/new", isLoggedIn, function(req,res){
    res.render("new.ejs");
});

// AUTH ROUTES

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/phonebook");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/phonebook",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
})