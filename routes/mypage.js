var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const {LogSet} = require('../config/common');
const INTERFACE_NAME = "MYPG";
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
  database: process.env.DB_DATABASE
});

/* GET home page. */
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });
//BeforeAfter
router.put('/beforeafter', upload.single('image'), (req, res)=>{   
  let image = req.file.path;
  var user_id = req.body.userid;
  var sql = con.query("insert image from UserBeforeAfter where user_id=?")
  var id = [user_id];
  con.query(sql, id, function(err, result){
    if(err){
      LogSet("e",INTERFACE_NAME,"BEAF","DF",1);
      console.log(err);
    }else{
      LogSet("i",INTERFACE_NAME,"BEAF","DS",1);
      res.status(201).json({message : "애프터 사진 넣기 성공"}); 
    }      
  })  
});

//BeforeAfter 수정
router.put('/beforeafter_change', function(req, res, next) {
  var user_id = req.body.userid;
  let image = req.body.image;
  var weight = req.body.weight;
  var height = req.body.height;
  if(image != null){    
    if(weight != null){
      if(height != null){
        //이미지 , 몸무게, 키 다 받음
        var sql2 = "Update UserBeforeAfter set after_pic=?, weight=?,height=? Where userid=?"
        con.query(sql2, [image, weight, height, user_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"BFUP","DF",6);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"BFUP","DS",6);
            res.status(201).json({messeage : "수정완료"});
          }
        });
      }
      else{
        //이미지 , 몸무게 받음
        var sql3 = "Update UserBeforeAfter set after_pic=?, weight=? Where userid=?"
        con.query(sql3, [image, weight, user_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"BFUP","DF",5);
            console.log(err);
          }else{
            LogSet("e",INTERFACE_NAME,"BFUP","DS",5);
            res.status(201).json({messeage : "수정완료"});
          }
        });
      }
    }
    else{
      //이미지만 받음
      var sql4 = "Update UserBeforeAfter set after_pic=? Where userid=?"
        con.query(sql4, [image,user_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"BFUP","DF",4);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"BFUP","DS",4);
            res.status(201).json({messeage : "수정완료"});
          }
        });
    }
  }
  //이미지가 없는경우
  else{
    if(weight !=null){
      if(height != null){
        //몸무게 키 받음
        var sql5 = "Update UserBeforeAfter set weight=?,height=? Where userid=?"
        con.query(sql5, [weight, height, user_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"BFUP","DF",3);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"BFUP","DS",3);
            res.status(201).json({messeage : "수정완료"});
          }
        });
      }
      else{
        //몸무게만 받음
        var sql6 = "Update UserBeforeAfter set weight=? Where userid=?"
        con.query(sql6, [weight, user_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"BFUP","DF",2);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"BFUP","DS",2);
            res.status(201).json({messeage : "수정완료"});
          }
        });
      }
    }
    else{
      //키만 받음
      var sql7 = "Update UserBeforeAfter set height=? Where userid=?"
        con.query(sql7, [height, user_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"BFUP","DF",1);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"BFUP","DS",1);
            res.status(201).json({messeage : "수정완료"});
          }
        });
    }
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
      if (err) { 
        LogSet("e",INTERFACE_NAME,"PDRT","DF",1);
        res.json(err);
      }
      else{
        LogSet("i",INTERFACE_NAME,"PDRT","DS",1);
        routineid = result.insertId;
        //UserRoutine into mysql
        con.query("insert into UserRoutine(userid, routineid, RoutineDate, Time) values ('"+userid+"','"+routineid+"','"+RoutineDate+"','"+Time+"')"
        , function(err, result){
          if (err) { 
            LogSet("e",INTERFACE_NAME,"PDRT","DF",2);
            res.json(err);
          }else{
            LogSet("i",INTERFACE_NAME,"PDRT","DS",2);
            userroutineid = result.insertId;
            //UserRoutineWorkout into mysql
            for(var i =0;i<workoutid.length;i++){
              con.query("insert into UserRoutineWorkout(UserRoutineId, workoutid) values ('"+userroutineid+"','"+workoutid[i]+"')"
              , function(err, result){
                if (err) { 
                  LogSet("e",INTERFACE_NAME,"PDRT","DF",3);
                  res.json(err);
                }else{
                  LogSet("i",INTERFACE_NAME,"PDRT","DS",3);
                }
              });
            }
          }
        });
        //RoutineWorkout into mysql
        for(var i =0;i<workoutid.length;i++){
          con.query("insert into RoutineWorkout(routineid, workoutid) values ('"+routineid+"','"+workoutid[i]+"')"
          , function(err, result){
            if (err) { 
              LogSet("e",INTERFACE_NAME,"PDRT","DF",4);
              res.json(err);
            }else{
              LogSet("i",INTERFACE_NAME,"PDRT","DS",4);
            }
          });
        }
        res.json("success");
      }
    });
});

//루틴삭제
router.delete('/delete_routine', function(req, res, next){
    var user_id = req.body.userid;
    var routine_id = req.body.routineId;
    var sql = "select UserRoutineId from UserRoutine where userid=? and routineid=?"
    con.query(sql, [user_id,routine_id], function(err, result){
      if(err){
        LogSet("e",INTERFACE_NAME,"RTDE","DF",1);
        console.log(err);
      }else{
        LogSet("i",INTERFACE_NAME,"RTDE","DS",1);
        Uid = result[0].UserRoutineId
        var sql1 = "delete workoutId from UserRoutineWorkdout where UserRoutineId=?"
        var sql2 = "delete routineid from UserRoutine where routineid=?"
        var sql3 = "delete routineid from RoutineWorkout where routineid=?"
        var sql4 = "delete routineid from routine where routineid=?"
        con.query(sql1+sql2+sql3+sql4, [Uid,Uid,routine_id,routine_id], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"RTDE","DF",2);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"RTDE","DS",2);
          }
        });
      }
    });
    res.status(201).json({messeage : "success"});
});
//루틴 수정
router.put('/set_routine', function(req, res, next){
  var user_id = req.body.userid;
  var routine_id = req.body.routineId;
  var workout_id = req.body.workoutid; 
  var change_workout_id = req.body.change_workoutid;
  let Uid;
  //UserRoutineWorkout 수정
  var sql = "select UserRoutineId from UserRoutine where userid=? and routineid=?"    
    con.query(sql, [user_id,routine_id], function(err, result){
      if(err){
        LogSet("e",INTERFACE_NAME,"RTSE","DF",1);
        console.log(err);
      }else{
        LogSet("i",INTERFACE_NAME,"RTSE","DS",1);
        Uid = result[0].UserRoutineId       
        var sql1 = "select workoutid from UserRoutineWorkout where UserRoutineId=?"
        con.query(sql1, [Uid], function(err, result){
          if(err){
            LogSet("e",INTERFACE_NAME,"RTSE","DF",2);
            console.log(err);
          }else{
            LogSet("i",INTERFACE_NAME,"RTSE","DS",2);
            try{
              for(var i =0;i<result.length;i++){
                if(workout_id == result[i].workoutid){
                  var sql2 = "update UserRoutineWorkout set Workoutid=? where Workoutid=? and UserRoutineId=?"
                  con.query(sql2, [change_workout_id,workout_id, Uid], function(err, result){
                    if(err){
                      console.log(err);
                    }else{
                      //Routine Workout 수정
                      var sql3 = "select workoutid from RoutineWorkout where routineid=?"
                      con.query(sql3, [routine_id], function(err, result){
                        if(err){
                          console.log(err)                    
                        }else{
                          for(var i =0; i<result.length; i++){
                            if(workout_id == result[i].workoutid){
                              var sql4 = "update RoutineWorkout set workoutid=? where workoutid=? and routineid=?"
                              con.query(sql4, [change_workout_id,workout_id,routine_id], function(err, result){
                                if(err){
                                  console.log(err);
                                }else{
                                  res.status(201).json({messeage : "success"});
                                }
                              });
                            }
                          }
                        }
                      });
                    }
                  });
                }            
              }
              LogSet("i",INTERFACE_NAME,"RTSE","DS",3);
            }catch(e){
              LogSet("e",INTERFACE_NAME,"RTSE","DF",3);
            }
          }
        })
      }
  });
});
module.exports = router;