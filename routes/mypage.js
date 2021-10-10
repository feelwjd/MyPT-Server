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
	database: 'mypt'
});

/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });
//비포에프터
router.post('/beforeafter', upload.single('image'), (req, res)=>{   
  let image = req.file.path;
  var user_id = req.body.userid;
  var sql = con.query("insert image from UserBeforeAfter where user_id=?")
  var id = [user_id];
  con.query(sql, id, function(err, result){
    res.status(201).json("애프터 사진 넣기 성공"); 
  })  
});
//비포테프터 수정
router.put('/beforeafter_change', function(req, res, next) {
  var user_id = req.body.userid;
  let image = req.file.path;
  var weight = req.body.weight;
  var height = req.body.height;
  if(image != null){
    if(weight != null){
      if(height != null){
        var sql = con.query("insert image, weight, height from UserBeforeAfter where user_id=?")
        var id = [user_id];
        con.query(sql, id, function(err, result){
          res.status(201).json("사진, 몸무게, 키 수정 성공"); 
        })
      }
    }
    else{
      var sql = con.query("insert weight, height from UserBeforeAfter where user_id=?")
      var id = [user_id];
      con.query(sql, id, function(err, result){
        res.status(201).json(" 몸무게, 키 수정 성공"); 
      })
    }
  }
  else{
    var sql = con.query("insert image from UserBeforeAfter where user_id=?")
    var id = [user_id];
    con.query(sql, id, function(err, result){
      res.status(201).json(" 사진 수정 성공"); 
    })
  }  
});
//루틴생성기
router.post('/produce_routine', function(req, res, next){
    routinename = req.body.routinename;
    description = req.body.description;
    userid = req.body.userid;
    workoutid = req.body.workoutid;
    let routineid;
    let userroutineid;
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let RoutineDate = year + '/' + month + '/' + date;
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    let Time = hours + ':' + minutes + ':' + seconds;
    //routine into mysql
    con.query("insert into routine(routinename, description) values ('"+routinename+"','"+description+"')"
    , function(err, result){
      if (err) throw res.json(err);
      routineid = result.insertId;
      //UserRoutine into mysql
        con.query("insert into UserRoutine(userid, routineid, RoutineDate, Time) values ('"+userid+"','"+routineid+"','"+RoutineDate+"','"+Time+"')"
        , function(err, result){
          if (err) throw res.json(err);
          userroutineid = result.insertId;
          //UserRoutineWorkout into mysql
          for(var i =0;i<workoutid.length;i++){
            con.query("insert into UserRoutineWorkout(UserRoutineId, workoutid) values ('"+userroutineid+"','"+workoutid[i]+"')"
            , function(err, result){
              if (err) throw res.json(err);
            })
          }
        })
        //RoutineWorkout into mysql
        for(var i =0;i<workoutid.length;i++){
          con.query("insert into RoutineWorkout(routineid, workoutid) values ('"+routineid+"','"+workoutid[i]+"')"
          , function(err, result){
            if (err) throw res.json(err);
          })
      }
      res.json("success");
    })
});

//루틴설정
router.post('/set_routine', function(req, res, next){  
    res.status(201).json('"messeage" : "success"');
});
module.exports = router;