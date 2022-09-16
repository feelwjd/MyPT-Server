var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const {LogSet} = require('../config/common');
const INTERFACE_NAME = "FUNC";
const dotenv = require('dotenv');
dotenv.config();

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
  host: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE
});

/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });

//칼로리 계산 기능
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
        LogSet("e",INTERFACE_NAME,"CCAL","DF",1);
        console.log(err)
      }else{
        LogSet("i",INTERFACE_NAME,"CCAL","DS",1);
        res.status(201).json({message : "'+total_cal.toFixed(3)+'"}); 
      }
    })
});

//루틴 생성 기능
//추후 개발 예정.
router.post('/mkroutine', function(req, res, next){
    res.status(201).json({messeage : "success"});
});

//이미지 공유 기능
router.post('/picshare',upload.single('image'), (req, res)=>{
    try{
      let image = req.file.path;
      LogSet("i",INTERFACE_NAME,"PCSH","MS",1);
      res.status(201).json(image);
    }catch(e){
      LogSet("e",INTERFACE_NAME,"PCSH","MF",1);
      console.log(e);
    }  
});
module.exports = router;