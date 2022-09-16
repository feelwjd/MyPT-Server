const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../config/winston');
const algorithm = 'aes-192-cbc';
const MYPASSWD = process.env.MYPASSWD;
const IV = process.env.IV;
const KEY = crypto.scryptSync(MYPASSWD, 'salt', 24);



function encrypt(text) {
    if (text.length < 16) {
        var cipher = crypto.createCipheriv(algorithm, KEY, Buffer.from(IV));
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        logger.info(`MP_IF_ENCR_FN SF PROC_STEP:1 SUCC_CNT:1 FAIL_CNT:0`);
        return encrypted;
    }
    else {
        logger.info(`MP_IF_ENCR_FN SE PROC_STEP:1 SUCC_CNT:0 FAIL_CNT:1`);
        logger.error(`MP_IF_ENCR_FN SE ERROR_CODE:FNE0001 LS:1`);
    }
}

function decrypt(text) {
    let encryptedData = Buffer.from(text, "hex");
    var decipher = crypto.createDecipheriv(algorithm, KEY, IV);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
};