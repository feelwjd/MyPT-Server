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
//비포에프터
router.post('/beforeafter', function(req, res, next){   
    res.status(201).json('"messeage" : "success"'); 
});
//루틴생성기
router.post('/produce_routine', function(req, res, next){
    routine_id = req.body.routineid;
    routinename = req.body.routinename;
    description = req.body.description;
    
    con.query("insert into routine(routineid, routinename, description) values ('"+routine_id+"','"+routinename+"','"+description+"')"
    , function(err, result){
      if (err) throw res.json(err);
      res.json('success');
    })    
});
//루틴설정
router.post('/set_routine', function(req, res, next){
    res.status(201).json('"messeage" : "success"');
});
module.exports = router;