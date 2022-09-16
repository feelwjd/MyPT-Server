var express = require('express');
const app = require('../app');
var router = express.Router();
const mysql = require('mysql');
const e = require('express');
const dotenv = require('dotenv');
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
router.post("/SessionCheck", function(req, res, next){
    let check = req.body.cookie;
    let session = req.session.email;
    if(check == session){
            res.status(201).json(session);
    }else{
            let msg = '세션이 만료되었습니다.'
            res.status(301).json(msg);
    }
    
})