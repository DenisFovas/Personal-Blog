var express = require('express');
var bcrypt = require('bcryptjs');
var passport = require('passport')
var router = express.Router();

// Bring in the user model
var User = require('../models/user');

// Register Form get
router.get('/register', function(req, res) {
    res.render('register');
});

// Register form - post
router.post('/register', function(req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('email', 'E-mail is not valid!').isEmail();
    req.checkBody('email', 'E-mail is not valid!').notEmpty();
    req.checkBody('password', 'The password is required!').notEmpty();
    req.checkBody('password2', 'You need to confirm the password!').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register',  {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        })
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and can log in!');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }   
});

// Login Form get
router.get('/login', function(req, res) {
    res.render('login');
});

// Login process
router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', function(req, res) {
    req.logOut();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
});

module.exports = router;