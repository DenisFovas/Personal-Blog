var express = require("express");
var router = express.Router();

// Bring in Article model
var Article = require("../models/article");
// Bring in the User model
var User = require("../models/user");

router.get("/add", ensureAuthenticated, function (req, res) {
  res.render("add_article", {
    title: "Articles"
  });
});

// Add submit post route
router.post("/add", function (req, res) {
  // Data validation
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();
  // Receive errors, if we have some during the validation
  var errors = req.validationErrors();
  if (errors) {
    res.render("add_article", {
      title: "Add an article. Please insert in all fields.",
      errors: errors
    });
  } else {
    var article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Article posted with succes!");
        res.redirect("/");
      }
    });
  }
});

// Submit post route for editding/update
router.post("/edit/:id", function (req, res) {
  // Define an empty object and make it the new post
  var article = {};
  article.title = req.body.title;
  // We don't need it. I can just insert the name of the person which posts.
  // article.author = req.body.author;
  article.body = req.body.body;

  // Define the query, based on which we update the data
  var query = { _id: req.params.id };

  // Update method will receive the query, the updated data, and the function for
  // the redirection
  Article.update(query, article, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

// Load specific article (update) || Edit form
router.get("/edit/:id", ensureAuthenticated, function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user._id) {
      req.flash("danger", "Not Authorized");
      res.redirect("/");
    } else {
      res.render("edit_article", {
        title: "Edit article",
        article: article
      });
    }
  });
});

// Delete Route for delete
router.delete("/:id", function (req, res) {
  if (!req.user._id) {
    res.status(500).send();
  } else {
    var query = { _id: req.params.id };
    Article.findById(query, function (err, article) {
      if (err) {
        console.log(err);
      } else {
        if (article.author != req.user._id) {
          res.status(500).send();
        } else {
          Article.remove(query, function (err) {
            if (err) {
              console.log("error");
              console.log(err);
            } else {
              //   res.send("Success on deletion");
              res.redirect("/");
            }
          });
        }
      }
    });
  }
});

// Get single article
router.get("/:id", function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    User.findById(article.author, function (err, user) {
      res.render("article", {
        article: article,
        author: user.name
      });
    });
  });
});

// Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please log in to use this funcitonality");
    res.redirect("/users/login");
  }
}

module.exports = router;
