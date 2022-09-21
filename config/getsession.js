const {LogSet} = require('../config/common');

function getSession(){
    return new Promise((resolve) => function(req){
        var sessionId = req.session.email;
        LogSet("i","SESSION_CHECK","GTSS",sessionId,1);
        if(sessionId === null){
            LogSet("e","SESSION_CHECK","GTSS","null",1);
            return err;
        }else{
            resolve(sessionId)
        }
    })
}

module.exports = {getSession};