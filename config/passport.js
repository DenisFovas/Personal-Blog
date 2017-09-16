var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var config = require('../config/database');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        // Match the username
        var quuery = {
            username:  username
        };
        User.findOne(quuery, function(err, user) {
            if (err) {
                throw (err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'No user found with this username'
                });
            }
            // Match the password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    throw (err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong password'
                    });
                }
            });
        });
    }));

    // Must have??  for the configuration of the passport when login in
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });    
}