const logger = require("./winston");

/**
 * 
 * @param {String} val i : info / e : error
 * @param {String} interface    Interface Code (4)
 * @param {String} funcName     Function Name (4)
 * @param {String} code         Code (2)
 * @param {Int} step            Process Step
 * 
 * @Auth TONY MIN
 */
function LogSet(val, interface, funcName, code, step ){
    if(val=="i"){
        logger.info(`IF_`+interface+`_`+funcName+` `+code+` PROC_STEP:`+step);
    }else if(val=="e"){
        logger.error(`IF_`+interface+`_`+funcName+` ERROR:`+code+`E PROC_STEP:`+step);
    }else{
        logger.error(`IF_`+interface+`_`+funcName+` ERROR:`+code+`E PROC_STEP:`+step);
    }
}

module.exports = {LogSet};