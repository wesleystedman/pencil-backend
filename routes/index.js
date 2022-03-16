var express = require('express');
var router = express.Router();

router.get('/search', function(req, res) {
  console.log(req.query);
  res.json('');
});

module.exports = router;
