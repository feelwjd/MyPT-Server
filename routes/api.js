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

router.post("/workout",function(req, res, next){
        con.query('SELECT * FROM workout', function(err, results){
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

module.exports = router;
