const express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
  res.render('contact')
})

let contact = router
module.exports = contact
