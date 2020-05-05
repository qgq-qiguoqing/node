const express = require('express');
const Router = express.Router();

const { formatData, token } = require('../utils')
// const create = token.create()
const { mysql: query } = require('../db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// 定义中间件，并设置上传目录
// const upload = multer({ dest: 'uploads/' })
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            try {
                fs.accessSync('uploads/')
            } catch (err) {
                fs.mkdirSync('uploads/')
            }

            if (file.fieldname === 'avatar') {
                let dir = 'avatar/';
                try {
                    fs.accessSync(dir)
                } catch (err) {
                    fs.mkdirSync(dir)
                }
                cb(null, dir);
            } else if (file.fieldname === 'img') {
                let dir = 'imgs/';
                try {
                    fs.accessSync(dir)
                } catch (err) {
                    fs.mkdirSync(dir)
                }
                cb(null, dir);
            } else {
                cb(null, 'uploads/');
            }
        },

        // 上传文件保存目录，无则自动创建
        // destination:'./uploads/',

        // 格式化文件名
        filename: function (req, file, cb) {
            // console.log(666)
            // 获取文件后缀名
            let ext = path.extname(file.originalname);
            let filename = `${file.fieldname}-${Date.now()}${ext}`

            cb(null, filename);
        }
    })
})



Router.post('/notice', upload.single('img'), async (req, res) => {
    // req.file
   
    let token=req.query.token
    var url = 'http://' + req.headers.host + "/" + req.file.destination + req.file.filename;
    // console.log(req.file);
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    // console.log(result1)
    let userAdmin= result1[0].userAdmin
    
    var sql2 = `INSERT INTO img (imgurl,userid) VALUES ("${url}","${userAdmin}");`
    let result2=await query(sql2)
    // query(sql2)
    if(result2.affectedRows){
        var data=formatData({code:1,data:url})
    }else{
        var data=formatData({code:0})
    }
    res.send(data);
});


// 商品图片
Router.post('/img', upload.single('img'), async (req, res) => {
    // console.log(req.file)

    let user = req.query.id
    let p = req.query.p
    var url = 'http://' + req.headers.host + "/" + req.file.destination + req.file.filename;
    if (p != 0) {
        let token = req.query.token
        let sql1 = `SELECT user_id FROM user WHERE token="${token}"`
        var result = await query(sql1)
        var id = result[0].user_id
        if (result.length > 0) {
            var sql2 = `INSERT INTO img (imgurl,userid) VALUES ("${url}","${id}");`
            result[0].url = url
        } else {
            var data = formatData({ code: 0 })
        }
    } else {
        var sql2 = `INSERT INTO img (imgurl,userid) VALUES ("${url}","${user}");`
    }



    let r = await query(sql2)
    if (r.affectedRows == 1) {
        if (p == 0) {
            var data = formatData({ code: 1, data: url })
        } else {
            var data = formatData({ code: 1, data: result[0] })
        }

    } else {
        var data = formatData({ code: 0 })
    }
    // console.log(r)

    // console.log(data)
    res.send(data)
});

module.exports = Router;