var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');

router.use(function(req, res, next){
    next();
});

const con = mysql.createConnection({
	host: 'ptdata.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com',
	user: 'mypt',
	password: '12345678',
	database: 'mypt'
});

/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });
// 공유
router.post('/share', function(req, res, next){   
    res.status(201).json('"messeage" : "success"'); 
});
//좋아요
router.post('/i_like_you', function(req, res, next){   
    res.status(201).json('"messeage" : "success"'); 
});

module.exports = router;