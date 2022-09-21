var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const e = require('express');
const path = require("path");
const dotenv = require('dotenv');
const logger = require('../config/winston');
var {getSession} = require('../config/getsession');
dotenv.config();

router.use(function(req, res, next){
    next();
});

const con = mysql.createConnection({
        host: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_DATABASE
});

//Client's Session Check
router.post("/SessionCheck", async function(req, res, next){
    let check = req.body.cookie;
    var sessionId = await getSession().then(result => {
        console.log(result);
        return result;
    });
    if(check == sessionId){
        res.status(201).json(sessionId);
    }else{
        logger.info(check);
        logger.info(sessionId);
        let msg = '세션이 만료되었습니다.'
        res.status(301).json(msg);
    }
});

module.exports = router;