var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const e = require('express');


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
router.get('/', function(req, res, next) {
    if(req.cookies){
      console.log(req.cookies);
    }
    res.status(201).json('"messeage" : "success"'); 
  });

//회원가입
router.post('/signup', function(req, res, next){  
    user_id = req.body.userid;
    password = req.body.pw;
    username = req.body.username;
    height = req.body.height;
    weight = req.body.weight;
    sex = req.body.sex;
    var sql = "select userid from users where userid=?";
    var id = [user_id];
    con.query(sql, id, function(err, result){
        res.status(201).json('"messeage" : "id exist"'); 
    })
    con.query("insert into users(userid, pw, username, height, weight, sex) values ('"+user_id+"','"+password+"','"+username+"','"+height+"','"+weight+"','"+sex+"')"
    , function(err, result){
      if (err) throw res.json(err);
      res.json('success');
    })    
});
//로그인 get
router.get('/signup', function(req, res, next) {
  res.status(201).json('"messeage" : "success"'); 
});

//로그인 post
router.post('/signin', function(req, res, next){  
    user_id = req.body.userid;
    password = req.body.pw;
    var sql = "select userid, pw, weight from users where userid=?";
    var id = [user_id];
    con.query(sql, id, function(err, result){
      console.log(result[0].weight);
      if(err){        
        res.status(201).json('"messeage" : "id not found"'); 
      }
      else{
        if(password === result[0].pw){ 
          res.cookie("user_id", result[0].userid,
                     "password", result[0].pw,
                     "weight", result[0].weight
                      )
          console.log("로그인 성공")         
          res.redirect("http://localhost:8000/users/signin")
        }
        else{

          res.status(201).json('"messeage" : "passowrd wrong"'); 
          res.redirect("http://localhost:8000/users/signin");
        }
      }
    })   
});
//로그아웃
router.post('/signout', function(req, res, next){
  
});
//회원탈퇴
router.post('/signdel', function(req, res, next){
  user_id = req.body.userid;
  var sql = "delete from users where userid=?";
    var id = [user_id];
    con.query(sql, id, function(err, result){
        res.status(201).json('"messeage" : "회원 탈퇴 완료"'); 
    })
});
module.exports = router;