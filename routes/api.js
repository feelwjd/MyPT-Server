var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const e = require('express');
const dotenv = require('dotenv');
dotenv.config();

router.use(function(req, res, next){
    next();
});
var rec_count = 1;
var rec_count1 = 11;

const con = mysql.createConnection({
        host: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_DATABASE
});

    
//routine 데이터
router.post("/routine", function(req, res, next) {
        con.query('SELECT * FROM routine', function(err, results){
                if(err){
                        logger.info(`MP_IF_APIP_RU SE PROC_STEP:1 SUCC_CNT:0 FAIL_CNT:1`);
                        logger.error(`MP_IF_APIP_RU SE ERROR_CODE:FNE0001 LS:1`);
                        console.log(err);
                }else{
                        logger.info(`MP_IF_APIP_RU SF PROC_STEP:1 SUCC_CNT:1 FAIL_CNT:0`);
                        res.send(results);
                }
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

router.post("/recommand_routine", function(req, res, next){
        var userid = req.body.userid;
        
        sql = "select workoutid from recommand_routine where userid =? and rec_id=?"
        if(userid == "feelwjd"){
                con.query(sql, [userid, rec_count], function(err, result){
                        rec_count +=1;
                        if(err){
                                console.log(err)
                        }
                        if(rec_count > 10){
                                rec_count = 1;
                        }
                        console.log(rec_count);
                        res.status(201).json(result);
                }) 
        }
        if(userid == "dbehdgns118"){
                con.query(sql, [userid, rec_count1], function(err, result){
                        rec_count1 +=1;
                        if(err){
                                console.log(err)
                        }
                        if(rec_count1 > 20){
                                rec_count1 = 11;
                        }
                        console.log(rec_count1);
                        res.status(201).json(result);
                })
        }
        
        
})

//Client's Session Check
router.post("/SessionCheck", function(req, res, next){
        let check = req.body.cookie;
        let session = req.session.email;
        if(check == session){
                res.status(201).json(session);
        }else{
                let msg = '세션이 만료되었습니다.'
                res.status(301).json(msg);
        }
        
})
module.exports = router;