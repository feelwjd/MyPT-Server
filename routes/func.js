var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  })

var upload = multer({ storage: storage })





router.use(function(req, res, next){
    next();
});

const con = mysql.createConnection({
	host: 'ptdata.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com',
	user: 'mypt',
	password: '12345678',
	database: 'mypt'
});

/* GET home page. */
router.GET('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });

  router.post('/calories_cal', function(req, res, next) {
    var count = req.body.count; // 1분 몇개인지
    var weight = req.body.weight;
    var userid = req.body.userid;
    var today = new Date();
    var day = now.getData();
    var total_cal = ((21 * weight)*0.0005) * count; // 1분운동한 칼로리
    let sql = 'INSERT INTO calories, day VALUES where userid=?'
    let params = [userid];
    con.query(sql , params, function(err, result){
        res.status(201).json('"messeage" : "success"'); 
    })
    
  });

router.post('/mkroutine', function(req, res, next){
    res.status(201).json('"messeage" : "success"');
});

router.post('/picshare', upload.single('image'), (req, res) =>{
    let image = req.file.path;
    res.status(201).json(image); 
});


module.exports = router;