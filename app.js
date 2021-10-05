var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var funcRouter = require('./routes/func');
var mypageRouter = require('./routes/mypage');
var commuRouter = require('./routes/commu');
var apiRouter = require('./routes/api');

var app = express();
const port = 8000;
const mysql = require('mysql');
const {response} = require('express')

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

app.get('/', (req, res) =>{
   con.query('Show databases;', function(err, result){
       if(err) throw err;
       res.send(result);
   })
})
// 왜안되지
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/main', mainRouter);
app.use('/func', funcRouter);
app.use('/mypage', mypageRouter);
app.use('/commu', commuRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
module.exports = app;
