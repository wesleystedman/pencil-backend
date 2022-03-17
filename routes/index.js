const express = require('express');
const router = express.Router();
const Question = require('../models/question');

router.get('/search', function(req, res) {
  Question.find({ annotations: req.query['q'].trim() }).exec()
    .then(questions => {
      ids = questions.map(question => question._id);
      res.json(ids);
    })
    .catch(err => {
      console.error(err);
      res.json([]);
    })
});

module.exports = router;
