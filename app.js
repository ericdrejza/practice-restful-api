const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to database
mongoose.connect("mongodb://localhost:27017/wikiDB");

// Create article schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String
});

// Create articles collection
const Article = mongoose.model('article', articleSchema);


///////////////////// REQUESTS TARGETTING ALL ARTICLES /////////////////////
app.route("/articles")
.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      console.log(foundArticles);
      res.send(foundArticles);
    } else {
      console.log(err);
      res.send(err);
    }
  })
})
.post(function(req, res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });

  console.log(article);

  article.save(function(err) {
    if (!err) {
      res.send("Successfully add a new article.");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});


///////////////////// REQUESTS TARGETTING A SINGLE ARTICLE /////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res) {
  const articleTitle = req.params.articleTitle;

  console.log(articleTitle);

  Article.findOne({ title: articleTitle }, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles match");
    }
  });
})
.put(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {
      title: req.body.title,
      content: req.body.content
    },
    function(err) {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        console.log(err);
      }
    }
  )
})
.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if (!err) {
        res.send("Successfully patched article.");
      } else {
        console.log(err);
      }
    }
  );
})
.delete(function(req, res) {
  Article.deleteOne({title: req.params.articleTitle}, function(err) {
    if (!err) {
      res.send("Successfully deleted article.");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});