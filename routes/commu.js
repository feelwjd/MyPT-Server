var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const { RSA_NO_PADDING } = require('constants');
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
// 공유
router.post('/share', upload.single('image'), function(req, res, next){   
    
    var user_id = req.body.userid;
    var commu_descript = req.body.commudescript;
    var image = req.file.originalname
    console.log(commu_descript);
    var sql = "insert into community(userid, image ,commudescript, heart) value('"+user_id+"','"+image+"','"+commu_descript+"','"+0+"')"
    con.query(sql, function(err, result){
        if(err){
            console.log(err)
        }
        res.status(201).json({messeage : "success"}); 
    })
});
//좋아요
router.put('/heart', function(req, res, next){   
    var user_id = req.body.userid;
    var heart = req.body.heart;
    //boolean 필요
    var check = req.body.check;
    var count;
    if(check == 0){
        count = heart -1;
    }
    else{
        count = heart + 1
    }
    var sql = "Update community set heart=? where userid=?"
    con.query(sql,[count, user_id], function(err, result){
        if(err){
            console.log(err);
        }
        res.status(201).json({messeage : "success"}); 
    })
    
});
router.get('/share_show_all', function(req, res, next) {
    var sql= "select * from community"
    con.query(sql, function(err, result){
        if(err){
            console.log(err)
        }
        res.status(201).json(result); 
    })
});
module.exports = router;