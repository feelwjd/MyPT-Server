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
//회원가입
router.post('/signup', function(req, res, next){   
    res.status(201).json('"messeage" : "success"'); 
});
//로그인
router.post('/signin', function(req, res, next){  
    res.status(201).json('"messeage" : "success"');
});
//로그아웃
router.post('/signout', function(req, res, next){
  res.status(201).json('"messeage" : "success"');
});
//회원탈퇴
router.post('/signdel', function(req, res, next){
  res.status(201).json('"messeage" : "success"');
});
module.exports = router;