var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var logger = require('../MyPT-Server/config/winston.js');
const session = require('express-session');
const crypto = require('crypto');

// Router Setting
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var funcRouter = require('./routes/func');
var mypageRouter = require('./routes/mypage');
var commuRouter = require('./routes/commu');
var apiRouter = require('./routes/api');
var shareimageRouter = require('./routes/shareimage');
const dotenv = require('dotenv');
dotenv.config();

var app = express();
const port = process.env.PORT;
const mysql = require('mysql');
const {response} = require('express')

//DB connect
function connect() {
    const db = mysql.createConnection({
      host: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_DATABASE,
      multipleStatements: true,
    });
  
    db.connect(err => {
      if (err) {
        console.log(err.message);
        setTimeout(connect(), 2000);
      }
      console.log("Connect!!")
    });
  
    // mysql 에러 발생 시 실행됨
    db.on('error', err => {
      console.log(err.message);
  
      // 장시간 미사용으로 연결이 끊겼을 때
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        return connect();
      } else {
        throw err;
      }
    });
  };
  
connect();

//Use Session
app.use(session({
  key: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2000 * 60 * 60 // 쿠키 유효기간 2시간
  }
}));


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));  
app.use('/images', express.static('images')); 
app.use('/shareimage', express.static('shareimage')); 


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/main', mainRouter);
app.use('/func', funcRouter);
app.use('/mypage', mypageRouter);
app.use('/commu', commuRouter);
app.use('/api', apiRouter);
app.use('/shareimage', shareimageRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
module.exports = app;
