const jwt = require('jsonwebtoken');
/**
 * Token的生成与校验
*/
/**
 * 
 * @param {String} data         加密数据
 * @param {Number} expiresIn    有效期（单位:s）
 */
// let { secretOrPrivateKey } = require('../config.json');
let secretOrPrivateKey = "suiyi"
function create(data, expiresIn = 60 * 60 * 24 * 7) {

    let token = jwt.sign({ data }, secretOrPrivateKey, {
        expiresIn
    });
    return token;
}

function verify(token) {
    let res;
    try {
        let result = jwt.verify(token, secretOrPrivateKey);
        console.log('token校验：', result)
        res = true;
    } catch (err) {
        res = false;
    }

    return res;
}

module.exports = {
    create,
    verify,

}