const express = require('express');
const app = express();
const mysql = require('mysql');
const con = mysql.createConnection({
        host: 'ptdata.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com',
        user: 'mypt',
        password: '12345678',
        database: 'mypt'
});

con.connect(function(err){
        if(err) throw err;
        console.log('Connected');
});

app.set('port' ,3000);

app.get("/routine", (req, res) => {
        con.query('SELECT * FROM routine', (err, results)=>{
                if(err)
                        console.log(err);
                res.send(results);
        });
});

app.get("/user", (req, res) => {
        con.query('SELECT * FROM users', (err, results)=>{
                if(err)
                        console.log(err);
                res.send(results);
         });
});

app.get("/workout", (req, res) => {
        con.query('SELECT * FROM workout', (err, results)=>{
                if(err)
                        console.log(err);
                res.send(results);
        });
});

app.get("/user-routine", (req, res) => {
    con.query('SELECT * FROM UserRoutine', (err, results)=>{
            if(err)
                    console.log(err);
            res.send(results);
     });
});

app.get("/routine-workout", (req, res) => {
    con.query('SELECT * FROM RoutineWorkout', (err, results)=>{
            if(err)
                    console.log(err);
            res.send(results);
     });
});

app.get("/user-routine-workout", (req, res) => {
    con.query('SELECT * FROM UserRoutineWorkout', (err, results)=>{
            if(err)
                    console.log(err);
            res.send(results);
     });
});



app.listen(app.get("port"));
console.log("Listening on", app.get("port"));

