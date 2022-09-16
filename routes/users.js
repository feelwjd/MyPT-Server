var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const e = require('express');
const multer = require("multer");
const path = require("path");
const crypto = require('crypto');
const { encrypt, decrypt } = require('./crypto');
const {LogSet} = require('../config/common');
const INTERFACE_NAME = "USRS";
const dotenv = require('dotenv');
dotenv.config();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
  },
});

var upload = multer({ storage: storage });

router.use(function(req, res, next){
    next();
});

const con = mysql.createConnection({
  host: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

con.connect();
/* GET home page. */
router.post('/', function(req, res, next) {
  res.status(201).json('"messeage" : "success"'); 
});

//회원가입 (추후 수정 예정)
router.post('/signup', upload.single("image"), function(req, res, next){  
  user_id = req.body.userid;
  password = req.body.pw;
  var encryptedpw = encrypt(password);
  username = req.body.username;
  height = req.body.height;
  weight = req.body.weight;
  sex = req.body.sex;
  //picshare를 거쳐서 이미 경로화됨
  image = req.body.image;
  var sql = "select userid from users where userid=?;";
  var id = [user_id];
  var sql1 = mysql.format(sql, id);
  var sql2 = "insert into users(userid, pw, username, height, weight, sex, image) values ('" + user_id + "','" + encryptedpw +"','"+username+"','"+height+"','"+weight+"','"+sex+"','"+image+"');"
  var sql3 = "insert into UserBeforeAfter(userid, before_pic, weight, height) values('"+user_id+"','"+image+"','"+weight+"','"+height+"');"

  con.query(sql1+sql2, function(err, result){
    if(err){
      LogSet("e",INTERFACE_NAME,"SGUP","DF",1);
      res.status(400).json({message : "회원 가입 실패"});
    }else{
      LogSet("i",INTERFACE_NAME,"SGUP","DS",1);
      con.query(sql3, function(err, result1){
        if(err){
          LogSet("e",INTERFACE_NAME,"SGUP","DF",2);
          console.log(err);
          res.status(404).json({message : "회원 가입 실패"});
        }else{
          LogSet("i",INTERFACE_NAME,"SGUP","DS",2);
        }
      });
      res.status(201).json({messeage : "회원 가입 완료"});   
    }  
  }); 
});
//로그인
router.post('/signin', function(req, res, next){ 
  user_id = req.body.userid;
  password = req.body.pw;
  var sql = "select userid, pw, weight from users where userid=?";
  var id = [user_id];
  con.query(sql, id, function(err, result){
    if(err){      
      LogSet("e",INTERFACE_NAME,"SGIN","DF",1);  
      res.status(301).json({messeage : "id not found"}); 
    }
    else{
      LogSet("i",INTERFACE_NAME,"SGIN","DS",1);
      var decryptedpw = decrypt(result[0].pw);
      if (password === decryptedpw){
        req.session.email = encrypt(user_id); // 세션 생성
        var session = req.session.email;
        var status = 201;
        LogSet("i",INTERFACE_NAME,"SGIN","DS",2);       
        res.status(201).json({result,status,session});
      }
      else{
        LogSet("e",INTERFACE_NAME,"SGIN","DF",2); 
        res.status(302).json({messeage : "passowrd wrong"}); 
      }
    }
  })   
});
//로그아웃
router.post("/logout", function (req, res, next) {
  req.session.destroy();
  res.clearCookie('sid');
})
//회원탈퇴 (추후 수정 예정)
router.delete('/signdel', function(req, res, next){
  user_id = req.body.userid;
  password = req.body.pw;
  var sql2 = "select pw from users where userid=?"
  con.query(sql2, [user_id], function(err,result){
    if(err){
      LogSet("e",INTERFACE_NAME,"SGDE","DF",1);
      console.log(err);
    }
    else{
      LogSet("i",INTERFACE_NAME,"SGDE","DS",1);
      if(password == result[0].pw){
        var sql = "select userRoutineId from UserRoutine where userid =?"
        con.query(sql, [user_id], function(err, result){
          if(err){
            console.log(err);
          }
          
          for(var i= 0;i <result.length; i++){
            var sql2 = "delete from UserRoutineWorkout where UserRoutineId=?"
            con.query(sql2, [result[i].userRoutineId], function(err,result){
              if(err){
                console.log(err)
              }
            })
          }
          var sql3 = "delete from UserRoutine where userid=?"
          con.query(sql3, [user_id], function(err, result){
            if(err){
              console.log(err)
            }
            var sql4 = "delete from calories where userid=?"
            con.query(sql4, [user_id], function(err, result){
              if(err){
                console.log(err)
              }
              var sql5 = "delete from community where userid=?"
              con.query(sql5, [user_id], function(err, result){
                if(err){
                  console.log(err)
                }
                var sql6 = "delete from UserBeforeAfter where userid=?"
                con.query(sql6, [user_id], function(err, result){
                  if(err){
                    console.log(err)
                  }
                  var sql7 = "delete from users where userid=?"
                  con.query(sql7, [user_id], function(err, result){
                    if(err){
                      console.log(err)
                    }
                    res.status(201).json({messeage : "회원 탈퇴 완료"}); 
                  })
                })
              })
            })
          })
          
        })
      }
      else{
        res.status(404).json({messeage : "delete denied"}); 
      }
    }   
  })
});

module.exports = router;