var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')
var expressValidator = require('express-validator')
// var flash = require('connect-flash')
var passport = require('passport')
var config = require('./config/database')

// Initializa the app
var app = express()
var Article = require('./models/article')

// Routes
let aboutMe = require('./routes/about_me')
let users = require('./routes/users')
let article = require('./routes/article')
let contact = require('./routes/contact')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set public folder
app.use(express.static(path.join(__dirname, '/public')))

// Connect to the data base
mongoose.connect(config.database)
var db = mongoose.connection

// Check for a connection. If it exists, we will display the log. Otherwise, we will display the error below.
db.once('open', function () {
  console.log('Connected to Mongo DB..')
})
// Check for DB errors
db.on('error', function (err) {
  console.log('Error with Mongo DB @ ' + Date() + '. Please check the connections...')
  console.log(err)
})

// Load view engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

// Express messages middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Express validator middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
    var root = namespace.shift()
    var formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Passport config
require('./config/passport')(passport)

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null
  next()
})
// Home route
app.get('/', function (req, res) {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err)
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      })
    }
  })
})

// Route files
// Route for articles
app.use('/articles', article)
// Route for users
app.use('/users', users)
// Route for about_me part
app.use('/about_me', aboutMe)
// Route for the contact form
app.use('/contact', contact)
// TODO: Add the route for the games

// Start server
app.listen('3000', function () {
  console.log('Server started on port 3000...')
})
