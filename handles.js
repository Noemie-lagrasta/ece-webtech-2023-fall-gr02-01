// Import necessary modules
const express = require('express');
const router = express.Router();
//recuperation of the database
const db = require('./database'); 


// GET/ articles 
router.get('/articles', (req, res) => {
//status 200 eaqual to a success
  res.status(200).json(db.articles);
});


// POST/ articles 
router.post('/articles', (req, res) => {

    //recuperation of the input
    const newArticle = req.body;
    //verifcation that all the field are full
    if (newArticle.id && newArticle.title && newArticle.content && newArticle.date && newArticle.author) {
        //push it in the database
      db.articles.push(newArticle); 
      res.status(201).json(newArticle);
    } else {
      res.status(400).json({ error: 'Invalid article data' });
    }
  
});

  //GET/ articles /:articlesID
  router.get('/articles/:articleId', (req, res) => {

    //recuperation of the selection parameter
    const articleId = req.params.articleId;
    // comparaison in the database
    const article = db.articles.find((article) => article.id === articleId);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }  
    res.json(article);
  
});

 //GET/ articles /:articlesID/comments
router.get('/articles/:articleId/comments', (req, res) => {

    //recuperation of the selection parameter
    const articleId = req.params.articleId;
    // comparaison in the database
    const comments = db.comments.filter(comment => comment.articleId === articleId);
    if (comments.length === 0) {
      return res.status(404).json({ error: 'No comments found for this article' });
    }
    res.status(200).json(comments);
  
  });

//POST/ articles /:articlesID/comments
router.post('/articles/:articleId/comments', (req, res) => {

    //recuperation of the input
    const newComment = req.body; 
    if (newComment.id && newComment.timestamp && newComment.content && newComment.articleId && newComment.author ) {
        //push in the database
      db.comments.push(newComment);
      res.status(201).json(newComment);
    }
    else{
      res.status(400).json({ error: 'Invalid article data' });
    }
  });

  //GET/ articles /:articlesID/comments/:commentsId
  router.get('/articles/:articleId/comments/:commentId', (req, res) => {

    //Recuperation of the selection parameter
    const articleId = req.params.articleId;
    const commentId = req.params.commentId;
    const comment = db.comments.find(comment => comment.articleId === articleId && comment.id === commentId);
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
        res.status(200).json(comment);
  
  });
  
  

  module.exports = router;