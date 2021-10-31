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
var shareimageRouter = require('./routes/shareimage');

var app = express();
const port = 8000;
const mysql = require('mysql');
const {response} = require('express')

function connect() {
    const db = mysql.createConnection({
      host: 'ptdata.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com',
      user: 'mypt',
      password: '12345678',
      database: 'mypt',
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

//app.get('/', (req, res) =>{
//   con.query('Show databases;', function(err, result){
//       if(err) throw err;
//       res.send(result);
//   })
//})
// 왜안되지
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
