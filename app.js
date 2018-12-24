var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require ("passport-local"),
    FacebookStrategy    = require("passport-facebook"),
    methodOverride      = require("method-override"),
    Entry               = require("./models/entry"),
    User                = require("./models/user");
    
var phonebookRoutes = require("./routes/phonebook"),
    indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/phonebook_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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

passport.use(new FacebookStrategy({
    clientID: "333581227228232",
    clientSecret: "5498c433a0105bb31aeea90e03f15a00",
    callbackURL: "https://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done){
    User.findOrCreate({ facebookId: profile.id } , function(err,user) {
        if (err) {
            return done(err);
        }
    done(null, user);
    });
}));

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(phonebookRoutes);


app.listen(3000, process.env.IP, function(){
    console.log("Server started");
})