// To create facebook app please follow instruction:
// https://magefan.com/blog/create-facebook-application

// Please note: replace 'App ID' and 'App Secret' generated in Facebook App

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy
let cookieParser = require('cookie-parser');
let session = require('express-session');

// set the view engine to ejs
app.set('view engine', 'ejs');

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

// app.use: register chain of middlewares before executing any end route logic
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
    secret: 'keyboard cat', 
    key: 'sid',
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// setup passport session - authentication middleware for Node.js
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: 'Your App ID',
    clientSecret: 'Your Secret ID',
    callbackURL: "http://localhost:3000/facebook/callback"
  },

  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
  }
));
// Bind and listen the connection 
app.listen(3000, () => console.log('App listening on port 3000'));

// Setup on given routes when requested by get htttp
app.get('/', (req, res) => {
    res.render('pages/index');
})

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('pages/account', {user: req.user.displayName})
});
  
app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));
  
// Facebook will redirect the user to this URL after approval.  
app.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect : '/account', failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    }
);

app.get('/login', (req, res) => {
    res.render('pages/login', {
        loginLink: "/auth/facebook"
    });
})

app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// middleware to ensure that any resource is protected
// and ensure a user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}