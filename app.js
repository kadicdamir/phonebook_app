var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    cookieParser        = require("cookie-parser"),
    session             = require("express-session"),
    http                = require("http").Server(app),
    passportSocketIo    = require("passport.socketio"),
    io                  = require("socket.io")(http),
    passport            = require("passport"),
    LocalStrategy       = require ("passport-local"),
    FacebookStrategy    = require("passport-facebook"),
    methodOverride      = require("method-override"),
    Entry               = require("./models/entry"),
    User                = require("./models/user"),
    mongoStore          = require("connect-mongo")(session);
    
var phonebookRoutes = require("./routes/phonebook"),
    indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/phonebook_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//app.use(cookieParser());
//app.use(session({secret:"Shh, its a secret!"}));

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

/*var sessionStore = new mongoStore({
  mongooseConnection: mongoose.connection,
  touchAfter: 24 * 3600});
  var sessionSecret = "its a secret";*/
/*
var sessionMware =  session({
    name: 'socialify.sess', store: sessionStore, secret: sessionSecret, resave: false,
    saveUninitialized: true, cookie: {maxAge: 1000 * 60 * 60 * 24}});

app.use(sessionMware);

io.use(function (socket,next){
    sessionMware(socket.request, socket.request.res, next);
});
*/
/*app.use(session({
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIRONMENT !== 'development' && process.env.ENVIRONMENT !== 'test',
    maxAge: 2419200000
  },
  secret: sessionSecret
}));*/

/*io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: sessionSecret,
  store: sessionStore,
  passport: passport,
  cookieParser: cookieParser
}));*/

io.on('connection', function(socket){
/*    console.log(socket.request.user.logged_in);
    console.log(socket.request.user);
   if (socket.request.user && socket.request.user.logged_in) 
        var name = socket.request.user;
    console.log(name);*/
    io.emit('chat message', "User connected");
    socket.on('chat message', function(from, msg){
        io.emit('chat message', from + ": " + msg);
    });
    socket.on('disconnect', function(){
        io.emit('chat message',  "User disconnected");
    });
});



http.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
})