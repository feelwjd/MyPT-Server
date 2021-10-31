var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function(req,file,cb){
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });


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

router.post('/calories_cal', function(req, res, next) {
    var count = req.body.count; // 1분 몇개인지
    var weight = req.body.weight;
    var user_id = req.body.userid;
    var today = new Date();
    var day = today.getDate();
    var total_cal = ((21 * weight)*0.0005) * count; // 1분운동한 칼로리
    console.log(total_cal.toFixed(3));
    console.log(day);
    let sql = "INSERT INTO calories(userid, calories, date) VALUES ('"+user_id+"','"+total_cal.toFixed(3)+"', '"+day+"')"
    con.query(sql, function(err, result){
      if(err){
        console.log(err)
      }
        res.status(201).json({message : "'+total_cal.toFixed(3)+'"}); 
    })
    
});
router.post('/mkroutine', function(req, res, next){
    res.status(201).json({messeage : "success"});
});

router.post('/picshare',upload.single('image'), (req, res)=>{
    let image = req.file.path;
    res.status(201).json(image);
});
module.exports = router;