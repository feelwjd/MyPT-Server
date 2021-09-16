const express = require('express');
const app = express();
const port = 3000;


app.get('/', (request,respnese) => {
    const sql ="select * from User";
    con.query(sql,function(err,result,fields){
        if(err) throw err;
        console.log(result);
    });
});
