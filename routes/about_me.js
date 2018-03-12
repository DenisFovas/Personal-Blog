const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  // TODO: Add the Angular GitHub Profile.
  res.render('about_me')
})

var aboutMe = router
module.exports = aboutMe
