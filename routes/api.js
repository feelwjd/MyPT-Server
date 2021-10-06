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

router.use(function(req, res, next){
        next();
    });
    

router.post("/routine", function(req, res, next) {
        con.query('SELECT * FROM routine', function(err, results){
                if(err)
                        console.log(err);
                res.send(results);
        });
});

router.post("/user", function(req, res, next){
        con.query('SELECT * FROM users', function(err, results){
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

router.post("/user-routine", function(req, res, next) {
    con.query('SELECT * FROM UserRoutine', function(err, results){
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

router.post("/user-routine-workout", function(req, res, next) {
    con.query('SELECT * FROM UserRoutineWorkout', function(err, results){
            if(err)
                    console.log(err);
            res.send(results);
     });
});

module.exports = router;
