const express = require("express");
const passport = require("passport");
const Post = require("../models/post.js");
const handle = require("../../lib/error_handler");
const fileUpload = require("../../lib/file-upload");
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// index
router.get("/posts", requireToken, (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      handle(err, res);
      console.error(err);
    });
});

// show
router.get("/posts/:id", requireToken, (req, res) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => res.status(200).json({ post: post.toObject() }))
    .catch(err => handle(err, res));
});

// create
router.post("/posts", requireToken, (req, res) => {
  // let's try it without putting in anything about the blog...
  // think that needs to come from the front end
  const postPost = {
    title: req.body.post.title,
    text: req.body.post.text,
    image: req.body.post.image,
    blogID: req.body.post.blogID
  };
  fileUpload(postPost.image)
    .then(data => {
      postPost.image = data.Location;
    })
    .then(data => {
      Post.create(postPost)
        .then(post => {
          res.status(201).json(post);
        })
        .catch(err => handle(err, res));
      console.log(data);
    })
    .catch(console.error);
});

// // update
// router.patch("/posts/:id", requireToken, (req, res) => {
//     // prevent client from changing blog that post belongs to
// })

module.exports = router;
