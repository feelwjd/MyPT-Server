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