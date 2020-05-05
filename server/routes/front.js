const express = require('express');
const Router = express.Router();
var expressWs = require('ws');

var fs=require("fs");

// expressWs(Router);
console.log(expressWs)

const { formatData, token, getLocalTime,uncodeUtf16 } = require('../utils')
// const create = token.create()
var https = require('https');
var qs = require('querystring');
const crypto = require("crypto");
const { mysql: query } = require('../db');
Router.route("/index").get(async (req, res) => {
    // let a=
    if (req.query.per_page * 1 == 0) {
        var a = req.query.per_page * 1
        var b = (req.query.per_page * 1 + 1) * 10
    } else {
        var a = (req.query.per_page * 1 - 1) * 10
        var b = req.query.per_page * 10
    }

    let sql = `SELECT * FROM total_post WHERE status=1  ORDER BY pid desc limit ${a},${b} `
    // console.log(sql)
    let result = await query(sql);
    if (result.length > 0) {
        for (let key in result) {
            let sql3=`SELECT *FROM comment WHERE objectid="${result[key].id}"`
        let result3=await query(sql3)
        result[key].comment_num=result3.length
            let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result[key].userid}" `
            let result2 = await query(sql2)
            result[key].author = result2[0]
            result[key].content=uncodeUtf16(result[key].content)
            if (result[key].imgurl) {
                result[key].imgurl = result[key].imgurl.split(',')
                // let arr = []
                // for (let i in result[key].imgurl) {
                //     if (result[key].imgurl[i] != "") {
                //         arr.push(result[key].imgurl[i])
                //     }
                // }
                // result[key].imgurl = arr
            }


        }
        var data = formatData({ code: 1, data: result })
    } else {
        var data = formatData({ code: 0 })
    }

    if (req.query.per_page * 1 == 0) {
        data.per_page = 2
    } else {
        data.per_page = req.query.per_page * 1 + 1
    }
    // console.log(req.query.per_page * 1 + 2)
    res.send(data);
})
Router.route("/postDetail").get(async (req, res) => {
    let id = req.query.id
    let token = req.query.token

        let sql3 = `SELECT user_id,status FROM user WHERE token = "${token}"`
        var result3 = await query(sql3)
        if(result3.length){
   // console.log()
   let sql4 = `SELECT * FROM love WHERE userid = "${result3[0].user_id}" AND postid = "${id}"`
   let sql5 = `SELECT * FROM collect WHERE userid = "${result3[0].user_id}" AND postid = "${id}"`
   var result4 = await query(sql4)
   var result5 = await query(sql5)

let sql1 = `SELECT * FROM total_post WHERE id = "${id}"`
if(result3[0].status==0){
console.log(result3[0])
let result1 = await query(sql1);
console.log(result1.userid)
let user_id = result1[0].userid

let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = ${user_id} `
let result2 = await query(sql2);
let slq6 = `SELECT * FROM attention WHERE follower_id="${user_id}" AND user_id="${result3[0].user_id}"`
let result6 = await query(slq6)
result1[0].imgurl = result1[0].imgurl.split(",")
result1[0].content=uncodeUtf16(result1[0].content)
if (result4.length > 0) {
result1[0].islike = 1
}
if (result5.length > 0) {
result1[0].isfav = 1
}
if (result6.length > 0) {
result2[0].isFollow = 1
} else {
result2[0].isFollow = 0
}
let result = {
data: result1[0],
author: result2[0]
}


if (result.data) {

var data = formatData({ code: 1, data: result })
} else {

}
}else{
var data = formatData({ code: 0 })
}
        }else{
            var data = formatData({ code: 0 })
        }
     
   
  
    res.send(data);
})
Router.route("/comment").get(async (req, res) => {
    let id = req.query.objectid
    let sql = `SELECT * FROM comment WHERE objectid = "${id}" ORDER BY id desc `
    let result = await query(sql);
    if (result.length > 0) {

        for (let i in result) {
            result[i].content=uncodeUtf16(result[i].content)
            // console.log(Date.parse(result[i].createtime))
            result[i].createtime = getLocalTime(Number(result[i].createtime))

        }
        var data = formatData({ code: 1, data: result })
    } else {
        var data = formatData({ code: 0 })
    }

    res.send(data);
})
Router.route("/login").post(async (req, res) => {
    let sno = req.body.sno
    let password = req.body.password
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    // console.log(newPas)
    let sql = `SELECT * FROM user WHERE user_id = "${sno}" AND user_password = "${newPas}" `
    let tok = token.create(sno)
    let inst = `UPDATE user SET token = '${tok}' WHERE user_id = "${sno}" `
    let result = await query(sql);
    // console.log(req.body)
    if (result.length > 0) {
        if(result[0].status==0)
        { 
            let result2 = await query(inst)
            if (result2.affectedRows == 1) {
                // console.log(result2)
                var data = formatData({ code: 1, data: tok })
            } else {
                var data = formatData({ code: 0 })
            }
            data.name=result[0].user_name
        } else{
            let r={status:1}
                var data = formatData({ code: 0 ,data:r})
                
            }
       
    }else {
            var data = formatData({ code: 0 })
        }
       


    res.send(data);
})
Router.route("/token").get(async (req, res) => {
    let token = req.query.token
    // console.log(token)
   
    let p = req.query.p
    if(token){
        let sql = `SELECT user_name, user_header, status,follow_num, user_id, followed_num, signature  FROM user WHERE token = "${token}" `

    let result = await query(sql);
console.log(result)
    if(result.length==0){
        let f={
            f:0
        }
        var data = formatData({ code:0, data:f})
    }else{
        if (result[0].status==0) {
            // console.log(result)
            if (p == 1) {
    
                var data = formatData({ code: 1, data: result[0] })
            } else {
                var data = formatData({ code: 1 })
            }
        } else {
            var data = formatData({ code: 0 })
        }
    }
    }else{
        var data = formatData({ code: 0 })
    }
   
    

    res.send(data);
})
Router.route('/sno').post(async (req, res) => {
    let student_id = req.query.sno
    let sql = `SELECT * FROM user WHERE user_id = ${student_id} `
    let result = await query(sql)

    if (result.length > 0) {
        if (result[0].user_password) {
            var data = formatData({ code: 1, data: 1 })
        } else {
            var data = formatData({ code: 1 })
        }

    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route("/reg").post(async (req, res) => {
    let student_id = req.query.sno
    let phone = req.query.phone
    let nickname = req.query.nickname
    let password = req.query.password
    let signature = req.query.signature
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    // console.log(student_id)
    let img = req.query.img
    let sql = `UPDATE user SET  user_name = "${nickname}", user_password = "${newPas}", user_phone = "${phone}", signature = "${signature}", user_header="${img}" WHERE user_id = "${student_id}"`
    // console.log(sql)
    let result = await query(sql)
    if (result.affectedRows == 1) {
        let tok = token.create(student_id)
        let inst = `UPDATE user SET token = '${tok}' WHERE user_id = ${student_id} `
        let result2 = await query(inst)
        if (result2.affectedRows == 1) {
            var data = formatData({ code: 1, data: tok })
        } else {
            var data = formatData({ code: 0 })
        }

    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route("/section").get(async (req, res) => {
    let sql = `SELECT * FROM section`
    let result = await query(sql)
    if (result.length > 0) {
        var data = formatData({ code: 1, data: result })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route("/delete").get(async (req, res) => {
    let d = req.query.d
    let id = req.query.id
    let token = req.query.token
    let sql1 = `SELECT user_id FROM user WHERE token = "${token}"`
    let result = await query(sql1)
    // console.log(result)
    var user = result[0].user_id
    if (result.length > 0) {

        if (d == 1) {

        } else {
            let sql = `DELETE FROM img WHERE imgurl = "${id}" and userid = "${user}"`
            let result2 = await query(sql)
            // console.log(sql)
            if (result2.affectedRows == 1) {
                var data = formatData({ code: 1 })
            }
            else {
                var data = formatData({ code: 0 })
            }
            // console.log(result)
        }
    } else {
        var data = formatData({ code: 0 })
    }

    res.send(data);
})
Router.route('/addition').post(async (req, res) => {
    let id = (Math.random() * 10000000).toString(16).substr(0, 4) + (new Date()).getTime() + Math.random().toString().substr(2, 5);
    let title = req.body.title
    let nickname = req.body.nickname
    let userid = req.body.userid
    // let keywords=req
    // let description=
    // let status
    let imgurl = req.body.imgurl
    let content = req.body.content
    var timestamp = (new Date()).getTime();
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var day = date.getDate();
    // if (month < 10) {
    //     month = "0" + month;
    // }
    // if (day < 10) {
    //     day = "0" + day;
    // }
    let timeago = getLocalTime(timestamp)
    // console.log(timeago)
    let gid = req.body.gid

    let sql = `INSERT INTO total_post(id, title, nickname, userid, content, imgurl, gid, timeago) VALUES("${id}", "${title}", "${nickname}", "${userid}", "${content}", "${imgurl}", "${gid}", "${timeago}")`;
    // console.log(req.body.gid)
    let result = await query(sql)

    if (result.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ data: 0 })
    }
    res.send(data)

})
Router.route("/classify").get(async (req, res) => {
    let gid = req.query.gid
    let sql = `SELECT * FROM total_post WHERE gid = ${gid} ORDER BY pid desc`
    let result1 = await query(sql)
    // console.log(result1)
    for (let key in result1) {
        let sql3=`SELECT * FROM comment WHERE objectid="${result1[key].id}"`
        let result3=await query(sql3)
        result1[key].comment_num=result3.length
        let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result1[key].userid}"`
        let result2 = await query(sql2)
        result1[key].author = result2[0]
        result1[key].content=uncodeUtf16(result1[key].content)
        if (result1[key].imgurl != null && result1[key].imgurl != '') {
            result1[key].imgurl = result1[key].imgurl.split(',')
        }

    }
    if (result1.length > 0) {
        var data = formatData({ code: 1, data: result1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)

})
Router.route('/view').get(async (req, res) => {
    let id = req.query.id
    let sql1 = `SELECT view_num FROM total_post WHERE id = "${id}"`
    let result1 = await query(sql1)
    // console.log(result1)
    let view_num = Number(result1[0].view_num) + 1
    let sql2 = `UPDATE total_post SET view_num = ${view_num} WHERE id = "${id}"`
    let result2 = await query(sql2)
    if (result2.affectedRows == 1) {
        var data = formatData({ code: 1 })
    }
    else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route("/islike").get(async (req, res) => {
    let id = req.query.id
    let token = req.query.token
    let d = req.query.d
    let sql4 = `SELECT love_num FROM total_post WHERE id = "${id}"`
    let result4 = await query(sql4)
    if (result4[0].love_num == 0) {
        var nu = 0
    } else {
        var nu = result4[0].love_num * 1
    }

    let sql1 = `SELECT user_id FROM user WHERE token = "${token}"`
    let result1 = await query(sql1)
    if (d == 1) {
        var sql2 = `DELETE FROM love WHERE userid="${result1[0].user_id}" AND postid="${id}"`
        if (nu == 0) {
            var sql3 = `UPDATE total_post SET love_num=${nu} WHERE id="${id}"`
        } else {
            var sql3 = `UPDATE total_post SET love_num=${nu - 1} WHERE id="${id}"`
        }

    } else {
        var sql2 = `INSERT INTO love (userid,postid) VALUES ("${result1[0].user_id}","${id}")`
        var sql3 = `UPDATE total_post SET love_num=${nu + 1} WHERE id="${id}"`
    }
    query(sql3)
    let result2 = await query(sql2)

    if (result2.affectedRows == 1) {

        var data = formatData({ code: 1 })
    } else {
        var data = formatData({
            code: 0
        })
    }
    res.send(data)
})
Router.route("/iscollect").get(async (req, res) => {
    let id = req.query.id
    let token = req.query.token
    let d = req.query.d
    let sql1 = `SELECT user_id FROM user WHERE token = "${token}"`
    let result1 = await query(sql1)
    // console.log(result1)
    if (d == 1) {
        var sql2 = `DELETE FROM collect WHERE userid="${result1[0].user_id}" AND postid="${id}"`
    } else {
        var sql2 = `INSERT INTO collect (userid,postid) VALUES ("${result1[0].user_id}","${id}")`
    }
    let result2 = await query(sql2)
    // console.log(result2)
    if (result2.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({
            code: 0
        })
    }
    res.send(data)
})
Router.route('/love').get(async (req, res) => {
    let token = req.query.token
    let sql1 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE token = "${token}"`
    var data = []
    let result1 = await query(sql1)
    if (result1.length > 0) {
        let sql2 = `SELECT postid FROM love WHERE userid=${result1[0].user_id}`
        var result2 = await query(sql2)
        // console.log(result2)
        if (result2.length > 0) {
            for (let key in result2) {
                let sql3 = `SELECT * FROM total_post WHERE id="${result2[key].postid}"`
                let result3 = await query(sql3)
                // data.push({
                //     data: result3[0],
                //     author: result1[0]
                // })
                data.push(result3[0])

            }
            var result = formatData({ code: 1, data: data })
        } else {
            var result = formatData({ code: 0 })
        }

    } else {
        var result = formatData({ code: 0 })
    }
    res.send(result)
})
Router.route('/collect').get(async (req, res) => {
    let token = req.query.token
    let sql1 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE token = "${token}"`
    var data = []
    let result1 = await query(sql1)
    if (result1.length > 0) {
        let sql2 = `SELECT postid FROM collect WHERE userid=${result1[0].user_id}`
        var result2 = await query(sql2)
        // console.log(result2)
        if (result2.length > 0) {
            for (let key in result2) {
                let sql3 = `SELECT * FROM total_post WHERE id="${result2[key].postid}"`
                let result3 = await query(sql3)
                // data.push({
                //     data: result3[0],
                //     author: result1[0]
                // })
                data.push(result3[0])

            }
            var result = formatData({ code: 1, data: data })
        } else {
            var result = formatData({ code: 0 })
        }

    } else {
        var result = formatData({ code: 0 })
    }
    res.send(result)
})
Router.route('/mypost').get(async (req, res) => {
    let token = req.query.token
    let sql1 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE token = "${token}"`
    var data = []
    let result1 = await query(sql1)
    if (result1.length > 0) {


        let sql2 = `SELECT * FROM total_post WHERE userid="${result1[0].user_id}" ORDER BY pid desc`
        let result2 = await query(sql2)
        for (let key in result2) {
            if (result2[key].imgurl != null) {
                result2[key].imgurl = result2[key].imgurl.split(',')
            }
        }
        data = {
            data: result2,
            author: result1[0]
        }

        var result = formatData({ code: 1, data: data })

    } else {
        var result = formatData({ code: 0 })
    }
    res.send(result)
})
Router.route("/deletepost").get(async (req, res) => {
    let token = req.query.token
    let postId = req.query.postId
    let sql1 = `SELECT user_id FROM user WHERE token = "${token}"`
    let result1 = await query(sql1)
    if (result1.length > 0) {
        let sql2 = `DELETE FROM total_post WHERE id="${postId}" AND userid="${result1[0].user_id}"`
        let result2 = await query(sql2)
        if (result2.affectedRows == 1) {
            var data = formatData({ code: 1 })
        } else {
            var data = formatData({ code: 0 })
        }
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)

})
Router.route("/onepost").get(async (req, res) => {
    let postId = req.query.postId
    let sql = `SELECT * FROM total_post WHERE id = "${postId}"`
    let result = await query(sql)
    let data = formatData({ code: 1, data: result })
    res.send(data)

})
Router.route('/updatepost').post(async (req, res) => {
    let title = req.query.title
    // let keywords=req
    // let description=
    let id = req.query.id
    let imgurl = req.query.imgurl
    let content = req.query.content
    // let timeago = new Date().getTime();
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    let timeago = year + "-" + month + "-" + day;
    let gid = req.query.gid
    let sql = `UPDATE total_post SET title="${title}" ,content="${content}", gid=${gid} ,imgurl="${imgurl}",timeago="${timeago}" WHERE id="${id}"`
    let result = await query(sql)
    if (result.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route('/attention').get(async (req, res) => {
    let follower_id = req.query.follower
    let p = req.query.p
    let token = req.query.token
    let sql1 = `SELECT followed_num FROM  user WHERE user_id ="${follower_id}"`
    let result1 = await query(sql1)
    let follow_num = result1[0].followed_num

    let sql2 = `SELECT user_id FROM user WHERE token = "${token}"`
    let result2 = await query(sql2)
    let user_Id = result2[0].user_id
    // console.log(user_Id)
    // console.log(follow_num)
    if(follower_id!=user_Id){
        if (p == 0) {
        follow_num = follow_num + 1
        var sql3 = `INSERT INTO attention (follower_id,user_id) VALUES ("${follower_id}","${user_Id}")`
        var d = 1
    } else {
        follow_num = follow_num - 1
        var sql3 = `DELETE FROM attention WHERE user_id="${user_Id}" AND follower_id="${follower_id}"`
        var d = 0
    }
    // console.log(follow_num)
    let sql4 = `UPDATE user SET followed_num=${follow_num} WHERE user_id="${follower_id}"`
    // console.log(sql3, sql4)
    let result3 = await query(sql3)
    let result4 = await query(sql4)
    // console.log(result3, result4)
    if (result4.affectedRows == 1 && result3.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }}else{
        var data = formatData({ code: 0 })
        d=2
    }
    
    data.dt = d
    res.send(data)
})
Router.route('/info').post(async (req, res) => {
    let user_id = req.query.id
    let name = req.query.name
    let signature=req.query.signature
    let sql = `UPDATE  user set user_name="${name}", signature="${signature}" WHERE user_id="${user_id}"`
    let result = await query(sql)
    if (result.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route('/inset').get(async (req, res) => {
    let password = req.query.password
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    let sql = `SELECT * FROM user WHERE user_password="${newPas}"`
    let result = await query(sql)
    if (result.length > 0) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route('/set').post(async (req, res) => {
    let password = req.query.password
    let token = req.query.token
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    let sql = `UPDATE user set user_password="${newPas}" WHERE token="${token}"`
    let result = await query(sql)
    if (result.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route('/setheader').post(async (req, res) => {
    let header = req.body.header
    let id = req.body.id
    let sql = `UPDATE user set user_header="${header}" WHERE user_id="${id}"`
    // console.log(sql)
    let result = await query(sql)
    if (result.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route("/search").get(async (req, res) => {
    let keyword = req.query.keyword
    let sql = `SELECT * FROM total_post WHERE title LIKE "%${keyword}%"`
    let result = await query(sql)
    // console.log(result)
    if (result.length > 0) {
        for (let key in result) {
               let sql3=`SELECT *FROM comment WHERE objectid="${result[key].id}"`
        let result3=await query(sql3)
        result[key].comment_num=result3.length
            let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result[key].userid}" `
            let result2 = await query(sql2)
            result[key].author = result2[0]
            if (result[key].imgurl) {
                result[key].imgurl = result[key].imgurl.split(',')
                // let arr = []
                // for (let i in result[key].imgurl) {
                //     if (result[key].imgurl[i] != "") {
                //         arr.push(result[key].imgurl[i])
                //     }
                // }
                // result[key].imgurl = arr
            }


        }
        var data = formatData({ code: 1, data: result })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route('/comment').post(async (req, res) => {
    let token = req.body.token
    let id = req.body.id
    let content = req.body.content
    var timestamp = (new Date()).getTime();


    let sql1 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature  FROM user WHERE token = "${token}" `
    let result1 = await query(sql1)
    let sql2 = `INSERT INTO comment (userid,objectid,createtime,nickname,user_head,content) VALUES ("${result1[0].user_id}","${id}","${timestamp}","${result1[0].user_name}","${result1[0].user_header}","${content}")`
    let result2 = await query(sql2)
    if (result2.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route("/getcomment").get(async (req, res) => {
    let token = req.query.token
    let sql1 = `SELECT  user_id FROM user WHERE token = "${token}" `
    let result1 = await query(sql1)
    let sql2 = `SELECT * FROM comment WHERE userid="${result1[0].user_id}"`
    let result2 = await query(sql2)
    var data = formatData({ code: 0, data: result2 })
    res.send(data)
})
Router.route('/deletecommet').get(async (req, res) => {
    let token = req.query.token
    let id = req.query.id
    let sql1 = `SELECT  user_id FROM user WHERE token = "${token}" `
    let result1 = await query(sql1)
    let sql2 = `DELETE FROM comment WHERE id=${id} AND userid="${result1[0].user_id}"`
    let result2 = await query(sql2)
    if (result2.affectedRows == 1) {
        var data = formatData({ code: 1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
})
Router.route('/getattention').get(async (req,res)=>{
 let id=req.query.id
 let sql1=`SELECT * FROM attention WHERE user_id="${id}"`
 let result1=await query(sql1)
 if(result1.length>0){
     for (let key in result1) {
        let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result1[key].follower_id}" `
        let result2 = await query(sql2)
        result1[key].author = result2[0]
     
     }
     var data=formatData({code:1,data:result1})
    }else{
        var data=formatData({code:0})
    }
    res.send(data)
 }),
 Router.route('/getlist').get(async (req,res)=>{
    let id=req.query.id
    let sql = `SELECT * FROM total_post WHERE userid = ${id} ORDER BY pid desc`
    let result1 = await query(sql)
    let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${id}"`
    let result2 = await query(sql2)
    // console.log(result1)
    for (let key in result1) {
        let sql3=`SELECT *FROM comment WHERE objectid="${result1[key].id}"`
        let result3=await query(sql3)
        result1[key].comment_num=result3.length
        
        result1[key].author = result2[0]
        if (result1[key].imgurl != null && result1[key].imgurl != '') {
            result1[key].imgurl = result1[key].imgurl.split(',')
        }

    }
    if (result1.length > 0) {
        var data = formatData({ code: 1, data: result1 })
    } else {
        var data = formatData({ code: 0 })
    }
    res.send(data)
    }),
    Router.route('/getfans').get(async (req,res)=>{
        let id=req.query.id
        let sql1=`SELECT * FROM attention WHERE follower_id="${id}"`
        let result1=await query(sql1)
        if(result1.length>0){
            for (let key in result1) {
               let sql2 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result1[key].user_id}" `
               let result2 = await query(sql2)
               result1[key].author = result2[0]
            
            }
            var data=formatData({code:1,data:result1})
           }else{
               var data=formatData({code:0})
           }
           res.send(data)
})
// function send_sms(uri,apikey,mobile,text){
//     var post_data = { 
//     'apikey': apikey, 
//     'mobile':mobile,
//     'text':text,
//     };//这是需要提交的数据 
//     var content = qs.stringify(post_data); 
//     post(uri,content,sms_host);
//    }
Router.route("/verification").post(async (req,res)=>{

var apikey = '4d32f893f86c33cf477bea2612f96a45';
// 修改为您要发送的手机号码，多个号码用逗号隔开
var mobile = req.body.mobile;
let sno=req.body.sno
// 修改为您要发送的短信内容
var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-4)
var text = '【回忆昔年】您的验证码是'+randomNum+'。如非本人操作，请忽略本短信';
var uri = '/v2/sms/single_send.json';
var host = 'sms.yunpian.com';
// send_sms(send_sms_uri,apikey,mobile,text);
let sql = `SELECT * FROM user WHERE user_id = "${sno}" AND user_phone="${mobile}" `
let result = await query(sql)
if(result.length>0){
    var post_data = { 
    'apikey': apikey, 
    'mobile':mobile,
    'text':text,
    };//这是需要提交的数据 
    var content = qs.stringify(post_data); 
    var options = { 
        hostname: host,
        port: 443, 
        path: uri, 
        method: 'POST', 
        headers: { 
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        } 
       };

       var re = https.request(options, function (re) { 
        // console.log('STATUS: ' + re.statusCode); 
        // console.log('HEADERS: ' + JSON.stringify(re.headers)); 
        re.setEncoding('utf8'); 
        re.on('data',  function (chun) { 
            // console.log(JSON.parse(chun) )
          
            if(JSON.parse(chun).msg='发送成功'){
              var data =formatData({code:1,data:randomNum})
            } else{
             var data =formatData({code:0})
            }
           res.send(data)
        }); 
       }); 
       //console.log(content);
       re.write(content); 
       re.end();
}else{
  let  d=0
    var data =formatData({code:0 ,data:d})
    res.send(data)
}

     
})
Router.route("/findpwd").post(async (req,res)=>{
    let sno=req.body.sno
    let password=req.body.password
    
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    let sql=`UPDATE user SET user_password="${newPas}" WHERE user_id="${sno}"`
    let result=await query(sql)
    // console.log(result)
    if(result.affectedRows==1){
        var data=formatData({code:1})
    }else{
        var data=formatData({code:0})
    }
    res.send(data)
})
Router.route("/bverification").post(async (req,res)=>{

    var apikey = '4d32f893f86c33cf477bea2612f96a45';
    // 修改为您要发送的手机号码，多个号码用逗号隔开
    var mobile = req.body.mobile;
  
    // 修改为您要发送的短信内容
    var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-4)
    var text = '【回忆昔年】您的验证码是'+randomNum+'。如非本人操作，请忽略本短信';
    var uri = '/v2/sms/single_send.json';
    var host = 'sms.yunpian.com';
  
        var post_data = { 
        'apikey': apikey, 
        'mobile':mobile,
        'text':text,
        };//这是需要提交的数据 
        var content = qs.stringify(post_data); 
        var options = { 
            hostname: host,
            port: 443, 
            path: uri, 
            method: 'POST', 
            headers: { 
             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            } 
           };
    
           var re = https.request(options, function (re) { 
            // console.log('STATUS: ' + re.statusCode); 
            // console.log('HEADERS: ' + JSON.stringify(re.headers)); 
            re.setEncoding('utf8'); 
            re.on('data',  function (chun) { 
                // console.log(JSON.parse(chun) )
              
                if(JSON.parse(chun).msg='发送成功'){
                  var data =formatData({code:1,data:randomNum})
                } else{
                 var data =formatData({code:0})
                }
               res.send(data)
            }); 
           }); 
           //console.log(content);
           re.write(content); 
           re.end();
    
         
 })
 Router.route("/banner").get(async(req,res)=>{
     let sql=`SELECT * FROM notice WHERE stutas=1`
     let result=await query(sql)
     var data= formatData({code:1,data:result})
     res.send(data)
 })
 Router.route("/date").get(async(req,res)=>{
     let token=req.query.token
     let date=req.query.date
     let sql1 = `SELECT  user_id FROM user WHERE token = "${token}" `
     let result1 = await query(sql1)
   
     if(result1.length>0){
        var user_id=result1[0].user_id
         let sql2=`SELECT * FROM user_date WHERE user_id="${user_id}"`
         let result2=await query(sql2)
         if(result2.length>0){
             let sql3=`UPDATE user_date SET date=${date} WHERE user_id="${user_id}"`
             let result3=await query(sql3)
             var data=formatData({code:1,data:result3})
         }else{
             let sql3 =`INSERT INTO user_date (user_id,date) VALUES ("${user_id}","${date}")`
             let result3=await query(sql3)
             var data=formatData({code:1,data:result3})
         }  

     }else{
         var data=formatData({
             code:0
         })
     }
     res.send(data)
 })
 Router.route("/inform").get(async(req,res)=>{
    let token=req.query.token
    let sql1 = `SELECT  user_id FROM user WHERE token = "${token}" `
    let result1 = await query(sql1)
    if(result1.length>0){
        let user_id=result1[0].user_id
        let sql2=`SELECT * FROM user_date WHERE user_id="${user_id}"`
        let result2=await query(sql2)
        let date=result2[0].date
        let sql3 = `SELECT * FROM comment WHERE userid="${user_id}"`
        let result3 = await query(sql3)
        let m=0
        let n=0
        if(result3.length>0){
              for (let  key in result3) {
         if(result3[key].status==0){
             n++
         }
        //  if(result3[key].createtime*1-date*1>0&&result3[key].status==0){
        //      m++
        //  }
        }
        }
      
        var data=formatData({code:1,data:{
            m,n
        }})
    }else{
        var data=formatData({code:0})
    }
    
    res.send(data)
 })
 Router.route("/message").get(async (req,res)=>{
     let token=req.query.token
     let sql1 = `SELECT  user_id FROM user WHERE token = "${token}" `
     let result1 = await query(sql1)
     let user_id=result1[0].user_id
     let sql2=`SELECT * FROM total_post WHERE userid="${user_id}"`
     let result2=await query(sql2)
     let arr=[]
     for (let key in result2) {
         let sql3=`SELECT * FROM comment WHERE objectid="${result2[key].id}" ORDER BY id desc`
         let result3=await query(sql3)
         if(result3.length>0){
              let obj={}
         obj.title=result2[key].title
         obj.id=result2[key].id
         obj.comment=result3
         arr.push(obj)
         }
        
     }
     var data =formatData({code:1,data:arr})
     res.send(data)
 })
 Router.route("/read").get(async (req,res)=>{
     let id=req.query.id
     let sql=`UPDATE comment SET status=1 WHERE objectid="${id}"`
     let result=await query(sql)
     var data=formatData({code:1,data:result})
     res.send(data)
 })
 Router.route("/download/*").get( function (req, res, next) {
    var name = 'xiaoshe.apk';
    var path = './' + name;
    var size = fs.statSync(path).size;
    var f = fs.createReadStream(path);
    res.writeHead(200, {
      'Content-Type': 'application/force-download',
      'Content-Disposition': 'attachment; filename=' + name,
      'Content-Length': size
    });
    f.pipe(res); });
//  app.get('/download/*', function (req, res, next) {
//     var name = 'app-debug.apk';
//     var path = './' + name;
//     var size = fs.statSync(path).size;
//     var f = fs.createReadStream(path);
//     res.writeHead(200, {
//       'Content-Type': 'application/force-download',
//       'Content-Disposition': 'attachment; filename=' + name,
//       'Content-Length': size
//     });
//     f.pipe(res);
//   });
  

module.exports = Router;