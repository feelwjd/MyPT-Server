var express = require('express');
var router = express.Router();
const {LogSet} = require('../config/common');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/home', function(req, res, next){
  LogSet("i","INDEX","HOME","DS",2);
  res.status(200).json('"messeage" : "postMethod success"'); 
})

router.get('/home', function(req, res, next){
  LogSet("i","INDEX","HOME","DS",1);
  res.status(200).json('"messeage" : "getMethod success"'); 
})
module.exports = router;
