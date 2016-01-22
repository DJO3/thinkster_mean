var express = require('express')
var router = express.Router()

/* Mongoose Models */
var mongoose = require('mongoose')
var Post = mongoose.model('Post')
var Comment = mongoose.model('Comment')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

/* GET all posts */
router.get('/posts', function (req, res, next) {
  Post.find(function (err, posts) {
    if (err) {
      return next(err)
    }

    res.json(posts)
  })
})

/* POST new post */
router.post('/posts', function (req, res, next) {
  var post = new Post(req.body)

  post.save(function (err, posts) {
    if (err) {
      return next(err)
    }

    res.json(post)
  })
})

/* GET individual post */
router.get('/posts/:post', function (req, res, next) {
  req.post.populate('comments', function (err, post) {
    if (err) {
      return next(err)
    }

    res.json(req.post)
  })
})

/* PUT post upvote */
router.put('/posts/:post/upvote', function (req, res, next) {
  req.post.upvote(function (err, post) {
    if (err) {
      return next(err)
    }

    res.json(post)
  })
})

/* POST Comment */
router.post('/posts/:post/comments', function (req, res, next) {
  var comment = new Comment(req.body)
  comment.post = req.post

  comment.save(function (err, comment) {
    if (err) {
      return next(err)
    }

    req.post.comments.push(comment)
    req.post.save(function (err, post) {
      if (err) {
        return next(err)
      }

      res.json(comment)
    })
  })
})

/* PUT comment upvote */
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
  req.comment.upvote(function (err, comment) {
    if (err) {
      return next(err)
    }

    res.json(comment)
  })
})

/* Preload post */
router.param('post', function (req, res, next, id) {
  var query = Post.findById(id)

  query.exec(function (err, post) {
    if (err) {
      return next(err)
    } else if (!post) {
        return next(new Error('Cannot find post!'))
    }

    req.post = post
    return next()
  })
})

/* Preload comment */
router.param('comment', function (req, res, next, id) {
  var query = Comment.findById(id)

  query.exec(function (err, comment) {
    if (err) {
      return next(err)
    } else if (!comment) {
        return next(new Error('Cannot find comment!'))
    }

    req.comment = comment
    return next()
  })
})

module.exports = router
