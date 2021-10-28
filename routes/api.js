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

    
//Mysql 데이터
router.post("/routine", function(req, res, next) {
        con.query('SELECT * FROM routine', function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
        });
});
//전체 정보
router.post("/users", function(req, res, next){
        let sql = "SELECT * FROM users";
        con.query(sql, function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
         });
});

//사용자 정보
router.post("/user", function(req, res, next){
        userid = req.body.userid
        let sql = "SELECT * FROM users where userid IN ('" + userid+ "')";
        con.query(sql, function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
         });
});
//전체 운동 데이터
router.post("/workout",function(req, res, next){
        con.query('SELECT * FROM workout', function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
        });
});
//기구 필요 유무 운동
router.post("/workout-class",function(req, res, next){
        workout_class = req.body.workout_class;
        let sql = "SELECT * FROM workout where class in (";
        sql += workout_class;
        sql += ")";
        con.query(sql, function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
        });
});

//사용자의 루틴 데이터
router.post("/user-routine", function(req, res, next) {
        userid = req.body.userid;
        let sql = "SELECT * FROM UserRoutine where userid IN ('" + userid+ "')";
        con.query(sql, function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
        });
});

router.post("/routine-workout", function(req, res, next) {
    con.query('SELECT * FROM RoutineWorkout', function(err, results){
            if(err)
                    console.log(err);
            res.send(results);
     });
});
//사용자의 Routine & Workout 데이터
router.post("/user-routine-workout", function(req, res, next) {
        userid = req.body.userid;
        let sql = "SELECT * FROM UserRoutine where userid IN ('" + userid+ "')";
        let urw_id = [];
        con.query(sql, function(err ,results){
                if(err)
                        console.log(err);
                for(var i = 0; i<results.length; i++){
                        urw_id.push(results[i].UserRoutineId);
                }
                
                let urw_sql = "SELECT * FROM UserRoutineWorkout where UserRoutineId IN (";
                urw_sql += urw_id;
                urw_sql += ")";
                con.query(urw_sql, function(err, results){
                        if(err)
                                console.log(err);
                        res.send(results);
                });
        });
});
// 사용자에 따른 루틴의 필요한 정보 출력
router.post("/routine-info",function(req,res,next){
        userid = req.body.userid;
        con.query("select A.userid, A.routineid, A.UserRoutineId, A.RoutineDate, A.Time, group_concat(B.workoutid) as workoutid, C.routinename, C.description, group_concat(D.workoutname) as workoutname from UserRoutine A inner join UserRoutineWorkout B on A.UserRoutineId = B.UserRoutineId inner join routine C on A.routineid = C.routineid inner join workout D on D.workoutid = B.workoutid  where A.userid in ('"+userid+"') group by B.UserRoutineId",function(err,results){
                res.send(results);
        });
})
module.exports = router;