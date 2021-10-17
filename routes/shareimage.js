var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function(req,file,cb){
    cb(null, file.fieldname + '-' + Date.now()+'.jpg');
  }
});
var upload = multer({ storage: storage }).single('image');

var fs = require('fs');
var gm = require('gm'); // graphics magick use
var resizeX = 1080
  , resizeY = 1080;     // 1080x1080 resize


/* GET home page. */
router.post('/image',upload, function(req, res, next) {
  var jpgname = req.file.fieldname + '-'+ Date.now()+'.jpg';
  gm(req.file.path)
    .resize(resizeX, resizeY)
    .fill('#ffffff')
    .font('public/font/BMJUA_ttf.ttf', 30)  // 폰트 설정
    .drawText(225,75,"MyPT")                // 텍스트 주입
    .write('public/shareimage/'+jpgname ,function(err){
      if(err){console.log(err);}  
      else{
        fs.readFile('public/shareimage/'+jpgname, function(err,data){   // 편집한 이미지 반환
          if(err) throw err;
          res.writeHead(200, {"Context-Type": "image/jpg"});
          res.write(data);
          res.end();
        });
      }
    })
  
  //res.setHeader('Content-Disposition', `attachment; filename = ${jpgname}`);
  //res.writeHead(200, {"Context-Type": "image/jpg"})
  //res.download('public/shareimage/',jpgname);
  //res.end(jpgname);
  //res.render('/imageshare');
});

module.exports = router;
