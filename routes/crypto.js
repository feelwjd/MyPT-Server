const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const {LogSet} = require('../config/common');
const INTERFACE_NAME = "CRTO";
const algorithm = 'aes-192-cbc';
const MYPASSWD = process.env.MYPASSWD;
const IV = process.env.IV;
const KEY = crypto.scryptSync(MYPASSWD, 'salt', 24);



function encrypt(text) {
    if (text.length < 16) {
        try{
            var cipher = crypto.createCipheriv(algorithm, KEY, Buffer.from(IV));
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            LogSet("i",INTERFACE_NAME,"ENCY","FS",2);
            return encrypted;
        }catch(e){
            LogSet("e",INTERFACE_NAME,"ENCY","FF",2);
            console.log(e);
        }
    }
    else {
        LogSet("e",INTERFACE_NAME,"ENCY","FF",1);
    }
}

function decrypt(text) {
    try{
        let encryptedData = Buffer.from(text, "hex");
        var decipher = crypto.createDecipheriv(algorithm, KEY, IV);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        LogSet("i",INTERFACE_NAME,"DECY","FS",1);
        return decrypted;
    }catch(e){
        LogSet("e",INTERFACE_NAME,"DECY","FF",1);
        console.log(e);
    }
}

module.exports = {
    encrypt,
    decrypt,
};