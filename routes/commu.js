var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
var util = require('util');
var fs = require('fs');
const readFile = util.promisify(fs.readFile);

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
router.post('/', function(req, res, next) {
    res.status(201).json('"messeage" : "success"'); 
  });
// 공유
router.post('/share', function(req, res, next){   
    
    var user_id = req.body.userid;
    var commudescript = req.body.commudescript;
    var sql = "select heart from community where userid=?"
    con.query(sql, [user_id], function(err,result){
        if(err){
            console.log(err)
        }
        var heart = result[0].heart
        var sql1 = "select image from community where userid=?"
        con.query(sql1, [user_id], function(err, result1){
            if(err){
                console.log(err)
            }
            console.log("성공");
            var image = result1[0].image;

            data = {commudescript, image, heart}
            res.status(201).json(data);
        })
    })
});
//좋아요
router.put('/heart', function(req, res, next){   
    var user_id = req.body.userid;
    var heart = req.body.heart;
    //boolean 필요
    var check = req.body.check;
    var count;
    if(check == 0){
        count = heart -1;
    }
    else{
        count = heart + 1
    }
    var sql = "Update community set heart=? where userid=?"
    con.query(sql,[count, user_id], function(err, result){
        if(err){
            console.log(err);
        }
        res.status(201).json({messeage : "success"}); 
    })
    
});
router.get('/share_show_all', function(req, res, next) {
    var sql= "select * from community"
    fileNames = fs.readdirSync('/public/shareimage/', ['**.jpg']);  // use async function instead of sync
    const files = fileNames.map(function (filename) {
        filepath = path.join(__dirname, '../public/shareimage') + '/' + filename;
       return readFile(filepath); //updated here
    });
    Promise.all(files).then(fileNames => {
        response.data = fileNames;
        res.json(response);
    }).catch(error => {
        res.status(400).json(response);
    });

    //con.query(sql, function(err, result){
    //    if(err){
    //        console.log(err)
    //    }
    //    res.status(201).json(result); 
    //})
  });
module.exports = router;