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
var gm = require('gm');
var resizeX = 1080
  , resizeY = 1080;

/* GET home page. */
router.post('/image',upload, function(req, res, next) {
 gm(req.file.path)
    .resize(resizeX, resizeY)
    .fill('#ffffff')
    .font('public/font/BMJUA_ttf.ttf', 30)
    .drawText(225,75,"MyPT")
    .write('public/images/'+req.file.filename + '-'+ Date.now()+'.jpg' ,function(err){
  if(err)
            console.log(err);
  console.log('done')
  })
});

module.exports = router;
