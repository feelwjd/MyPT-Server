var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const e = require('express');
const multer = require("multer");
const path = require("path");

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
	host: 'ptdata.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com',
	user: 'mypt',
	password: '12345678',
	database: 'mypt',
  multipleStatements: true
});

con.connect();
/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });
//회원가입
router.post('/signup', upload.single("image"), function(req, res, next){  
  user_id = req.body.userid;
  password = req.body.pw;
  username = req.body.username;
  height = req.body.height;
  weight = req.body.weight;
  sex = req.body.sex;
  //picshare를 거쳐서 이미 경로화됨
  image = req.body.image;
  var sql = "select userid from users where userid=?;";
  var id = [user_id];
  var sql1 = mysql.format(sql, id);
  var sql2 = "insert into users(userid, pw, username, height, weight, sex, image) values ('"+user_id+"','"+password+"','"+username+"','"+height+"','"+weight+"','"+sex+"','"+image+"');"
  var sql3 = "insert into UserBeforeAfter(userid, before_pic, weight, height) values('"+user_id+"','"+image+"','"+weight+"','"+height+"');"

  con.query(sql1+sql2, function(err, result){
      con.query(sql3, function(err, result1){
        if(err){
          console.log(err);
          res.status(404).json
        }
      })
      res.status(201).json    
  })
  
});
//로그인
router.post('/signin', function(req, res, next){  
    user_id = req.body.userid;
    password = req.body.pw;
    var sql = "select userid, pw, weight from users where userid=?";
    var id = [user_id];
    con.query(sql, id, function(err, result){
      if(err){        
        res.status(201).json('"messeage" : "id not found"'); 
      }
      else{
        if(password === result[0].pw){         
          res.status(201).json({result});
        }
        else{
          res.status(201).json;
        }
      }
    })   
});
//로그아웃
router.post('/signout', function(req, res, next){ 
  
});
//회원탈퇴
router.delete('/signdel', function(req, res, next){
  user_id = req.body.userid;
  password = req.body.pw;
  var sql2 = "select pw from users where userid=?"
  con.query(sql2, [user_id], function(err,result){
    if(err){
      console.log(err);
    }
    else{
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
                    res.status(201).json('"messeage" : "회원 탈퇴 완료"'); 
                  })
                })
              })
            })
          })
          
        })
      }
      else{
        res.status(404).json('"messeage" : "delete denied"'); 
      }
    }
    

    
  })
  
});

module.exports = router;