const token = require('./token')

/**
 * 
 * @param {Number} code  状态码（1：成功，0：失败）
 * @param {String} msg      提示消息
 * @param {Array} data      返回数据
 */
function formatData({ code = 1, msg = 'success', data = [] } = {}) {

    if (code === 0) {
        msg = 'fail'
    }

    return {
        code,
        msg,
        data
    }
}
function getLocalTime(nS) {
    
    return new Date(nS).toLocaleString();

}
function uncodeUtf16(str){
    var reg = /\&#.*?;/g;
    var result = str.replace(reg,function(char){
        var H,L,code;
        if(char.length == 9 ){
            code = parseInt(char.match(/[0-9]+/g));
            H = Math.floor((code-0x10000) / 0x400)+0xD800;
            L = (code - 0x10000) % 0x400 + 0xDC00;
            return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
        }else{
            return char;
        }
    });
    return result;
}
module.exports = {
    formatData,
    token,
    getLocalTime,
    uncodeUtf16
    
}