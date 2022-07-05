var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

router.use(function(req, res, next){
    next();
});

const con = mysql.createConnection({
    host: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE
});

/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });
//캘린더
router.post('/calendar', function(req, res, next){   
    res.status(201).json('"messeage" : "success"'); 
});
//todo 리스트
router.post('/todolist', function(req, res, next){
    res.status(201).json('"messeage" : "success"');
});


module.exports = router;