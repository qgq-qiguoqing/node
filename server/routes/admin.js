const express = require('express');
const Router = express.Router();
const { formatData, token,uncodeUtf16,getLocalTime } = require('../utils')
// const create = token.create()
const { mysql: query } = require('../db');
Router.route("/user").post(async (req, res) => {
    // console.log(req.query)
    let { userAdmin, password } = req.body
    let sql = `SELECT * FROM adminUser WHERE userAdmin="${userAdmin}" and password="${password}"
`
    let result = await query(sql);
    
    if (result) {
 
        let tok = token.create(result[0].adminUser)
        let inst = `UPDATE adminUser SET token = '${tok}' WHERE userAdmin = "${userAdmin}" `
 await query(inst);
        var data = formatData({ code: 1, data: tok })
    } else {
        var data = formatData({ code: 0 })
    }

    res.send(data);
})
Router.route("/index").get(async (req,res)=>{
    let sql1 =`SELECT * FROM user`
    let result1 =await query(sql1)
    let sql2=`SELECT * FROM total_post`
    let result2=await query(sql2)
    // console.log(result2)
    let result={
        user_nb:result1.length,
        post_nb:result2.length
    }
    var data =formatData({code:1,data:result})
    res.send(data)
})
Router.route('/token').get(async (req,res)=>{
    let token =req.query.token
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result=await query(sql1)
    if(result.length){
        var data=formatData({code:1})
    }else{
        var data=formatData({code:0})
    }
    res.send(data)
})
Router.route("/guser").get(async (req,res)=>{
    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
    let token =req.query.token
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    if(result1.length){
        
        let sql2 =`SELECT user_name, user_header,status, follow_num, user_id, followed_num, signature FROM user  ORDER BY pid desc limit ${rev},${nex}`
        let result2=await query(sql2)
        let sql3=`SELECT user_name, user_header,status, follow_num, user_id, followed_num, signature FROM user`
        let result3=await query(sql3)

        for ( let i in result2) {
           if(result2[i].status==1){
            
            // let key="status"+i
            
            // result2[i][key]='true'
            result2[i].status='true'
            
           }else{
            // let key="status"+i
            // result2[i][key]='false'
            result2[i].status='false'
           }
        }
      
        var data=formatData({code:1,data:result2})
        data.total=result3.length
    }else{
        var data=formatData({code:0})
    }
    res.send(data)
})
Router.route('/change').post(async (req,res)=>{
    let status=req.body.status
    let user_id=req.body.id
    let token=req.body.token
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    if(result1.length){
        let sql2=`UPDATE user SET status=${status} WHERE user_id="${user_id}"`
        let result2=await query(sql2)
        var data=formatData({code:1,data:result2})
    }else{
        var data=formatData({code:0})
    }
    res.send(data)
})
Router.route('/post').get(async (req,res)=>{
    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
    let token =req.query.token
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    if(result1.length){
        let sql2 = `SELECT * FROM total_post WHERE status=1  ORDER BY pid desc limit ${rev},${nex} `
        let result2=await query(sql2)
        let sql3=`SELECT * FROM total_post WHERE status=1 `
        let result3= await query(sql3)
        for (let key in result2) {
            let sql3=`SELECT *FROM comment WHERE objectid="${result2[key].id}"`
        let result3=await query(sql3)
        result2[key].comment_num=result3.length
        result2[key].content=uncodeUtf16(result2[key].content)
            let sql4 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result2[key].userid}" `
            let result4 = await query(sql4)
           let sql5=`SELECT * FROM section WHERE gid=${result2[key].gid}`
           let result5=await query(sql5)
           result2[key].gname=result5[0].section
            result2[key].author = result4[0]
            if (result2[key].imgurl) {
                result2[key].imgurl = result2[key].imgurl.split(',')
                // let arr = []
                // for (let i in result[key].imgurl) {
                //     if (result[key].imgurl[i] != "") {
                //         arr.push(result[key].imgurl[i])
                //     }
                // }
                // result[key].imgurl = arr
            }


        }
        var data = formatData({ code: 1, data: result2 })
        data.total=result3.length
    }else{
        var data =formatData({code:0})
    }
    res.send(data)
})
Router.route("/search").get(async (req,res)=>{
    let token =req.query.token
    let s=req.query.s//帖子和用户区别
    let d=req.query.d
    let conten=req.query.cnt
    let status=req.query.status
    let page=req.query.page
    var rev=(page*1-1)*10
    var nex=page*10
    let gid=req.query.gid
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    if(result1.length){
         if(s==1){
                 let sql2 =`SELECT user_name, user_header,status, follow_num, user_id, followed_num, signature FROM user where user_id like "%${conten}%" ORDER BY pid desc limit ${rev},${nex} `
                 let result2=await query(sql2)
                            
        for ( let i in result2) {
            result2[i].content=uncodeUtf16(result2[i].content)
            if(result2[i].status==1){
             result2[i].status='true'
            }else{
             result2[i].status='false'
            }
         }
                 let sql3 =`SELECT user_name, user_header,status, follow_num, user_id, followed_num, signature FROM user where user_id like "%${conten}%" `
                 let result3=await query(sql3)
                 var data=formatData({code:1,data:result2})
                 data.total=result3.length
     }else{
         if(d==0){
             if(status==1){
                  var sql2 = `SELECT * FROM total_post WHERE status=1 AND userid LIKE "%${conten}%" ORDER BY pid desc limit ${rev},${nex} `
                  var sql3=`SELECT * FROM total_post WHERE status=1 AND userid LIKE "%${conten}%"`
             }else{
                var sql2 = `SELECT * FROM total_post WHERE userid LIKE "%${conten}%" AND gid=${gid} ORDER BY pid desc limit ${rev},${nex} `
                var sql3=`SELECT * FROM total_post WHERE userid LIKE "%${conten}%" AND gid=${gid}`
             }
           
            let result2=await query(sql2)
           
            let result3= await query(sql3)
            for (let key in result2) {
                result2[key].content=uncodeUtf16(result2[key].content)
                let sql3=`SELECT *FROM comment WHERE objectid="${result2[key].id}"`
            let result3=await query(sql3)
            result2[key].comment_num=result3.length
              
                let sql4 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result2[key].userid}" `
                let result4 = await query(sql4)
               let sql5=`SELECT * FROM section WHERE gid=${result2[key].gid}`
               let result5=await query(sql5)
               result2[key].gname=result5[0].section
                result2[key].author = result4[0]
                if (result2[key].imgurl) {
                    result2[key].imgurl = result2[key].imgurl.split(',')
                   
                }
    
    
            }
            var data = formatData({ code: 1, data: result2 })
            data.total=result3.length
         }else if(d==1){
             if(status==1){
                var sql2 = `SELECT * FROM total_post WHERE status=1 AND id LIKE "%${conten}%" ORDER BY pid desc limit ${rev},${nex} `
                var sql3=`SELECT * FROM total_post WHERE status=1 AND id LIKE "%${conten}%"`
             }else{
                var sql2 = `SELECT * FROM total_post WHERE  id LIKE "%${conten}%" AND gid=${gid} ORDER BY pid desc limit ${rev},${nex} `
                var sql3=`SELECT * FROM total_post WHERE  id LIKE "%${conten}%" AND gid=${gid}`
             }
           
            let result2=await query(sql2)
     
            let result3= await query(sql3)
            for (let key in result2) {
                result2[key].content=uncodeUtf16(result2[key].content)
                let sql3=`SELECT *FROM comment WHERE objectid="${result2[key].id}"`
            let result3=await query(sql3)
            result2[key].comment_num=result3.length
              
                let sql4 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result2[key].userid}" `
                let result4 = await query(sql4)
               let sql5=`SELECT * FROM section WHERE gid=${result2[key].gid}`
               let result5=await query(sql5)
               result2[key].gname=result5[0].section
                result2[key].author = result4[0]
                if (result2[key].imgurl) {
                    result2[key].imgurl = result2[key].imgurl.split(',')
                   
                }
    
    
            }
            var data = formatData({ code: 1, data: result2 })
            data.total=result3.length

         }else{
             if(status==1){
                var sql2 = `SELECT * FROM total_post WHERE status=1 AND title LIKE "%${conten}%" ORDER BY pid desc limit ${rev},${nex} `
                var sql3=`SELECT * FROM total_post WHERE status=1 AND title LIKE "%${conten}%"`
             }else{
                var sql2 = `SELECT * FROM total_post WHERE title LIKE "%${conten}%" AND gid=${gid} ORDER BY pid desc limit ${rev},${nex} `
                var sql3=`SELECT * FROM total_post WHERE title LIKE "%${conten}%" AND gid=${gid}`
             }
          
            let result2=await query(sql2)
            
            let result3= await query(sql3)
            for (let key in result2) {
                result2[key].content=uncodeUtf16(result2[key].content)
                let sql3=`SELECT *FROM comment WHERE objectid="${result2[key].id}"`
            let result3=await query(sql3)
            result2[key].comment_num=result3.length
              
                let sql4 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result2[key].userid}" `
                let result4 = await query(sql4)
              
                result2[key].author = result4[0]
                if (result2[key].imgurl) {
                    result2[key].imgurl = result2[key].imgurl.split(',')
                   
                }
    
    
            }
            var data = formatData({ code: 1, data: result2 })
            data.total=result3.length
         }
     }
            
         
    }else{
        var data =formatData({code:0})
    }
    res.send(data)
})
Router.route("/remove").post(async (req,res)=>{
    let token = req.body.token
    let id=req.body.id
    let status=req.body.status
    let d=req.body.d
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    if(result1.length){
        if(d==1){
              let sql2=`UPDATE total_post  SET  status=${status} WHERE id= "${id}"`
        var result2=await query(sql2)
        }else{
            let sql2=`DELETE FROM total_post WHERE id= "${id}"`
            var result2=await query(sql2)
        }
      
        var data=formatData({code:1,data:result2})
    }else{
        var data=formatData({code:0})
    }
    res.send(data)

}),
Router.route('/gpost').get(async (req,res)=>{
    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
    let token =req.query.token
    let gid=req.query.gid
    let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    let result1=await query(sql1)
    if(result1.length){
        let sql2 = `SELECT * FROM total_post WHERE gid=${gid}  ORDER BY pid desc limit ${rev},${nex} `
        let result2=await query(sql2)
        let sql3=`SELECT * FROM total_post WHERE gid=${gid}`
        let result3= await query(sql3)
        for (let key in result2) {
            result2[key].content=uncodeUtf16(result2[key].content)
            let sql3=`SELECT *FROM comment WHERE objectid="${result2[key].id}"`
        let result3=await query(sql3)
        result2[key].comment_num=result3.length
          
            let sql4 = `SELECT user_name, user_header, follow_num, user_id, followed_num, signature FROM user WHERE user_id = "${result2[key].userid}" `
            let result4 = await query(sql4)
        //    let sql5=`SELECT * FROM section WHERE gid=${result2[key].gid}`
        //    let result5=await query(sql5)
        //    result2[key].gname=result5[0].section
            result2[key].author = result4[0]
            if (result2[key].imgurl) {
                result2[key].imgurl = result2[key].imgurl.split(',')
                // let arr = []
                // for (let i in result[key].imgurl) {
                //     if (result[key].imgurl[i] != "") {
                //         arr.push(result[key].imgurl[i])
                //     }
                // }
                // result[key].imgurl = arr
            }


        }
        var data = formatData({ code: 1, data: result2 })
        data.total=result3.length
    }else{
        var data =formatData({code:0})
    }
    res.send(data)
})
Router.route('/notice').get(async (req,res)=>{
    // let token=req.query.token
    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
   // let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    // let result1=await query(sql1)
    // if(result1.length){
        let sql1=`SELECT * FROM notice  `
        let result1= await query(sql1)
        let sql2=`SELECT * FROM notice  ORDER BY id desc limit ${rev},${nex}`
        let result2= await query(sql2)
        var data=formatData({code:1,data:{
            data:result2,
            total:result1.length
        }})
    // }else{
        // var data=formatData({code:0})
    // }
    res.send(data)
})
Router.route('/add').post(async (req,res)=>{
    let token=req.body.token
    let img=req.body.img
    let content=req.body.content
    let id = (Math.random() * 10000000).toString(16).substr(0, 4) + (new Date()).getTime() + Math.random().toString().substr(2, 5);
    // let sql1=`SELECT userAdmin FROM adminuser WHERE token ="${token}"`
    // let result1=await query(sql1)
    // if(result1.length){
         let sql2=`INSERT INTO notice (content,img,nid) VALUES ("${content}","${img}","${id}")`
        let result2= await query(sql2)
   
        var data=formatData({code:1,data:result2})
    // }else{
        // var data=formatData({code:0})
    // }
    res.send(data)
})
Router.route('/nchange').post(async (req,res)=>{
  let  nid=req.body.nid
  let stutas=req.body.status
  let sql=`UPDATE notice SET stutas=${stutas} WHERE nid="${nid}"`
  let result=await query(sql)
  var data=formatData({code:1,data:result})
  res.send(data)
})
Router.route('/ndelete').post(async (req,res)=>{
    let  nid=req.body.nid
    let sql=`DELETE FROM  notice WHERE  nid="${nid}"`
    let result=await query(sql)
    var data=formatData({code:1,data:result})
    res.send(data)
  })
  Router.route("/nupdate").post(async(req,res)=>{
      let nid=req.body.nid
      let content=req.body.content
      let img=req.body.img
      let sql=`UPDATE notice SET img="${img}" ,content="${content}" WHERE nid="${nid}"`
      let result=await query(sql)
      let data=formatData({code:1,data:result})
      res.send(data)
  })
  Router.route("/nsearch").get(async(req,res)=>{
    let nid=req.query.nid
    let content=req.query.content
    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
    
    if(nid){

           var sql=`SELECT * FROM notice WHERE nid LIKE "%${nid}%" ORDER BY id desc limit ${rev},${nex}`
    }else{
        var sql=`SELECT * FROM notice WHERE content LIKE "%${content}%" ORDER BY id desc limit ${rev},${nex}`
    }
    
    let result=await query(sql)
    let data=formatData({code:1,data:result})
    res.send(data)
})
Router.route("/addindex").post(async(req,res)=>{
    let id=req.body.id
    let sql=`UPDATE total_post  SET  status=1 WHERE id= "${id}"`
    let result=await query(sql)
    var data=formatData({code:1,data:result})
    res.send(data)
})
Router.route("/comment").get(async (req,res)=>{

    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
    let sql=`SELECT * FROM comment ORDER BY id desc limit ${rev},${nex}`
    
    let result=await query(sql)
    for (let i in result) {
        result[i].content=uncodeUtf16(result[i].content)
        // console.log(Date.parse(result[i].createtime))
        result[i].createtime = getLocalTime(Number(result[i].createtime))

    }
    var data =formatData ({code:1,data:result})
    res.send(data)
})
Router.route('/dcomment').post(async (req,res)=>{
    let id=req.body.id
    let sql=`DELETE FROM comment WHERE id=${id}`
    let result=await query(sql)
  
    var data =formatData({code:1,data:result})
    res.send(data)
})
Router.route("/scomment").get(async (req,res)=>{
    let content=req.query.content
    let d=req.query.d
    let page=req.query.page
    let rev=(page*1-1)*10
    let nex=page*10
    if(d==1){
        var sql=`SELECT * FROM comment WHERE userid LIKE "%${content}%" ORDER BY id desc limit ${rev},${nex}`
    }else{
        var sql=`SELECT * FROM comment WHERE objectid LIKE "%${content}%" ORDER BY id desc limit ${rev},${nex}`

    }
    let result=await query(sql) 
    for (let i in result) {
        result[i].content=uncodeUtf16(result[i].content)
        // console.log(Date.parse(result[i].createtime))
        result[i].createtime = getLocalTime(Number(result[i].createtime))

    }
    var data=formatData({code:1,data:result})
    res.send(data)
})
module.exports = Router;