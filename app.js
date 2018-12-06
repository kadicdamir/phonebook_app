var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require ("passport-local"),
    User            = require("./models/user"),
    Entry           = require("./models/entry");
    
var phonebookRoutes = require("./routes/phonebook"),
    indexRoutes      = require("./routes/index");


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

app.use(indexRoutes);
app.use(phonebookRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
})