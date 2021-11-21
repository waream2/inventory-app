var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/your-mom', function(req, res, next){
  res.send('Your mom lives here')
});

module.exports = router;
