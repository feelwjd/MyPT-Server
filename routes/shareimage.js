var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const con = mysql.createConnection({
  host: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function(req,file,cb){
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage }).single('image');

var fs = require('fs');
var gm = require('gm'); // graphics magick use
var resizeX = 1080
  , resizeY = 1080;     // 1080x1080 resize


/* GET home page. */
router.post('/image',upload, function(req, res, next) {
  var jpgname = req.file.originalname;
  let userid = req.body.userid;
  let selectroutine = req.body.userroutineid;
  let descript = req.body.commudescript;
  let workouts = [];
  let workoutlist = [];
  con.query("select * from UserRoutineWorkout where UserRoutineId in ('"+selectroutine+"')",function(err,results){
    if (err) throw err;
    else{
      for(var idx in results){
        workouts.push(results[idx].workoutid);
      }
      console.log(workouts);
      con.query("select * from workout where workoutid in ("+workouts+")",function(err,results){
        for(var idx in results){
          workoutlist.push(results[idx].workoutname);
        }
        gm(req.file.path)
        .resize(resizeX, resizeY)
        .fill('#ffffff')
        .font('public/font/BMJUA_ttf.ttf', 50).drawText(105,105,"MyPT")   // 폰트 설정// 텍스트 주입
        .font('public/font/BMJUA_ttf.ttf', 40).drawText(105,605,"오늘의 루틴")               
        .font('public/font/BMJUA_ttf.ttf', 25).drawText(105,650,""+workoutlist+"")
        .write('public/shareimage/'+jpgname ,function(err){
          if(err){console.log(err);}  
          else{
            fs.readFile('public/shareimage/'+jpgname, function(err,data){   // 편집한 이미지 반환하여 보여주기
              if(err) throw err;
              res.writeHead(200, {"Context-Type": "image/jpg"});
              res.write(data);
              res.end();
              con.query("insert into community(userid, image, commudescript) values('"+userid+"','"+jpgname+"','"+descript+"')",function(err,results){
                if (err) throw err;
              });
            });
          }
        })
        console.log(results);
      });
      
    }
  });
  
  //res.setHeader('Content-Disposition', `attachment; filename = ${jpgname}`);
  //res.writeHead(200, {"Context-Type": "image/jpg"})
  //res.download('public/shareimage/',jpgname);
  //res.end(jpgname);
  //res.render('/imageshare');
});

module.exports = router;
