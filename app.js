let express = require('express');

//bodyParser: node.js middleware for handling incoming URL requests
let bodyParser = require('body-parser');
let app = express();
let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy
let cookieParser = require('cokie-parser');
let session = require('express-session');

// app.use: register chain of middlewares before executing any end route logic
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'heyboard cat', key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());

//Passport session setup
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
