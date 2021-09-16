const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'ptdata.ceiotvbr944v.ap-northeast-2.rds.amazonaws.com',
    user: 'mypt',
    password: '12345678',
    database: 'User'
});

con.connect(function(err){
	if(err) throw err;
	console.log('Connected');
});
