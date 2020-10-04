const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
//dealing with mysql issue
//https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server

//basics
//https://www.youtube.com/watch?v=HPIjjFGYSJ4

//pooled
//https://medium.com/@carloscuba014/building-a-react-app-that-connects-to-mysql-via-nodejs-using-docker-a8acbb0e9788

const port = 3007;
const app = express();
// call cors
app.use(cors()); //attempting disable for caddy 



//original connection test (just to test connection since pool has no method)------------------------------
// var con = mysql.createConnection({
//     host: "probobo.cgac79lt7rx0.us-east-2.rds.amazonaws.com",
//     user: "admin",
//     password: "greenappl3",
//     database : "proBono",
//     insecureAuth : true
//   });

//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
//----------------------------------------------------------

//connection for database
const pool = mysql.createPool({
    host: "probobo.cgac79lt7rx0.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "greenappl3",
    database : "geohut_sport",
    insecureAuth : true
  });

//test generic serve access
app.get('/', (req, res) => res.send('I hope we make it through coronavirus . . . '))


//testing
// app.get('/test',  function(req,res){
//     var plate = req.params.plate;

//     var sql = "SELECT * FROM geohut_sport.test";
//     pool.query(sql, plate, function(err, results) {
//         if(err) {
//             return res.send(err)
//         } else {
        
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });

//request all construction sites
app.get('/sites',  function(req,res){
    var sql = "SELECT * FROM geohut_sport.volleyball_playground_sites;";
    pool.query(sql, function(err, results) {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    });
});



//request all checkins (temp)
app.get('/players/:playgroundId',  function(req,res){
    var playgroundId = req.params.playgroundId;
    var sql = "SELECT * FROM geohut_sport.check_ins where site_id = '"+playgroundId+"';";
    pool.query(sql, function(err, results) {
        if(err) {
            console.log(res.send(err))
            return res.send(err)

        } else {
            return res.json({
                data: results
            })
        }
    });
});


app.get('/pre_checks/:playgroundId',  function(req,res){
    var playgroundId = req.params.playgroundId;
    var sql = "SELECT * FROM geohut_sport.pre_check_ins where site_id = '"+playgroundId+"';";
    pool.query(sql, function(err, results) {
        if(err) {
            console.log(res.send(err))
            return res.send(err)

        } else {
            return res.json({
                data: results
            })
        }
    });
});

//validate registree can sign up by looking them up match on email/phone
//  app.get('/validate/:email',  cors(),function(req,res){
//      var email = req.params.email;
//      console.log(email)
//      var sql = "SELECT * FROM proBono.allowed_users WHERE id like '"+email+"'";
//      pool.query(sql, email, function(err, results) {
//          if(err) {

//              return res.send(err)
//          } else {
             
//              return res.json({
//                  data: results
//              })
//          }
//      });
//  });

 //pull historical checkins in profile by user id
//  app.get('/historycheckins/:uid',  cors(),function(req,res){
//     var uid = req.params.uid;
    
//     var sql = "SELECT site_id, checkin_date_time FROM proBono.check_ins WHERE user_id = '"+uid+"' ORDER BY checkin_date_time DESC LIMIT 10";
//     pool.query(sql, uid, function(err, results) {
//         if(err) {

//             return res.send(err)
//         } else {
           
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });



//CHECKIN CHECK

 //pull historical checkins in profile by user id
 app.get('/checkincheck/:uid',  cors(),function(req,res){
    var uid = req.params.uid;
    console.log(uid)
    var sql = "SELECT site_id, checkin_datetime FROM geohut_sport.check_ins WHERE user_id = '"+uid+"' ORDER BY checkin_datetime DESC LIMIT 10";
    pool.query(sql, uid, function(err, results) {
        if(err) {

            return res.send(err)
        } else {
         
            return res.json({
                data: results
            })
        }
    });
});



////PRECHECK CHECK

 //pull historical checkins in profile by user id
//  app.get('/precheckcheck/:uid',  cors(),function(req,res){
//     var uid = req.params.uid;
    
//     var sql = "SELECT site_id, checkin_date_time FROM proBono.check_ins WHERE checkin_type = 1 and user_id = '"+uid+"' ORDER BY checkin_date_time DESC LIMIT 10";
//     pool.query(sql, uid, function(err, results) {
//         if(err) {

//             return res.send(err)
//         } else {
           
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });













//  app.get('/checkins/:uid',  cors(),function(req,res){
//     var uid = req.params.uid;
    
//     var sql = "SELECT count(*) as total FROM proBono.check_ins WHERE user_id = '"+uid+"'";
//     pool.query(sql, uid, function(err, results) {
//         if(err) {

//             return res.send(err)
//         } else {
           
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });



// app.get('/checkinsWeek/:uid',  cors(),function(req,res){
//     var uid = req.params.uid;
//     console.log(uid)

//     var sql = "SELECT a.count_ins FROM (SELECT count(*) as count_ins,user_id, week(checkin_date_time) as week FROM proBono.check_ins GROUP BY week(checkin_date_time), user_id) a WHERE user_id = '"+uid+"' and week = week(now())";


//     pool.query(sql, uid, function(err, results) {
//         if(err) {
// console.log(err)
//             return res.send(err)
//         } else {
//             console.log(results + 'lala')
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });





//  app.get('/siteinfo/:email',  cors(),function(req,res){
//     var email = req.params.email;
//     console.log(email)
//     var sql = "SELECT allowed_users.user_id, allowed_users.id, construction_sites.site_id,construction_sites.site_name,construction_sites.latitude,construction_sites.longitude,construction_sites.site_address FROM proBono.allowed_users inner join proBono.construction_sites ON proBono.allowed_users.site_id = proBono.construction_sites.site_id WHERE proBono.allowed_users.id like '"+email+"'";
//     pool.query(sql, email, function(err, results) {
//         if(err) {
//             return res.send(err)
//         } else {
//             console.log(results)
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });

// app.get('/usersiteinfo/:id',  cors(),function(req,res){
//     var id = req.params.id;
//     console.log(id)
//     var sql = "SELECT allowed_users.user_id, allowed_users.id, construction_sites.site_id,construction_sites.site_name,construction_sites.latitude,construction_sites.longitude,construction_sites.site_address FROM proBono.allowed_users inner join proBono.construction_sites ON proBono.allowed_users.site_id = proBono.construction_sites.site_id WHERE proBono.allowed_users.user_id like '"+id+"'";
//     pool.query(sql, id, function(err, results) {
//         if(err) {
//             return res.send(err)
//         } else {
//             console.log(results)
//             return res.json({
//                 data: results
//             })
//         }
//     });
// });


//POST TO DATABASE
app.post('/add',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        site_id: req.query.site_id,
        checkin_datetime: req.query.time,
        first_name: req.query.first_name,
        last_name: req.query.last_name,
        user_id: req.query.user_id
       }
       // now the createStudent is an object you can use in your database insert logic.
       pool.query('INSERT INTO geohut_sport.check_ins SET ?', my_data, function (err, results) {
        if(err) {
            console.log(err)
            return res.send(err)
            
        } else {
            console.log(results)
            return res.json({
                data: results
            })
        }
    });
});



app.post('/preCheck',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        site_id: req.query.site_id,
        pre_checkin_datetime: req.query.time,
        first_name: req.query.first_name,
        last_name: req.query.last_name,
        user_id: req.query.user_id
       }
       // now the createStudent is an object you can use in your database insert logic.
       pool.query('INSERT INTO geohut_sport.pre_check_ins SET ?', my_data, function (err, results) {
        if(err) {
            console.log(err)
            return res.send(err)
            
        } else {
            console.log(results)
            return res.json({
                data: results
            })
        }
    });
});




//rest api to update record into mysql database
app.put('/update', cors(), (req, res) => {

    let timestamp = moment().utcOffset('-0500').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0'
    var my_data = {
        site_id: req.query.site_id,

        user_id: req.query.user_id
       }

       var sql = "UPDATE geohut_sport.check_ins SET checkout_datetime= '"+timestamp+"' where site_id = '"+my_data.site_id+"' and user_id = '"+my_data.user_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });





 //POST TO DATABASE
app.post('/addToStorage',  cors(), async (req, res) => {


    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
        var my_data = {
        site_id: req.query.site_id,

        user_id: req.query.user_id
       }
       // now the createStudent is an object you can use in your database insert logic.
       await pool.query("INSERT INTO geohut_sport.check_ins_storage select * from geohut_sport.check_ins where site_id = '"+my_data.site_id+"' and user_id = '"+my_data.user_id+"'", function (err, results) {
        if(err) {
            console.log(err)
            return res.send(err)
            
        } else {
            console.log(results)
            return res.json({
                data: results
            })
        }
    });
});




//Remove records
app.delete('/delete',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';

    var my_data = {
        site_id: req.query.site_id,

        user_id: req.query.user_id
       }
  
       // now the createStudent is an object you can use in your database insert logic.
       var sql = "DELETE FROM geohut_sport.check_ins WHERE site_id = '"+my_data.site_id+"' and user_id = '"+my_data.user_id+"'";
       pool.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});


app.delete('/cancelPreCheck',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';

    var my_data = {
        site_id: req.query.site_id,

        user_id: req.query.user_id
       }
  
       // now the createStudent is an object you can use in your database insert logic.
       var sql = "DELETE FROM geohut_sport.pre_check_ins WHERE site_id = '"+my_data.site_id+"' and user_id = '"+my_data.user_id+"'";
       pool.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});


//request all construction sites
app.get('/tracking',  cors(), function(req,res){
    var sql = "SELECT * FROM geohut_sport.trackingTest ORDER BY date_time LIMIT 10;";
    pool.query(sql, function(err, results) {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    });
});


//Automatic removal 
setInterval(() => {
    console.log(moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0')
    let timestamp = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0'



       pool.query("UPDATE geohut_sport.check_ins SET checkout_datetime= '"+timestamp+"' WHERE DATE_ADD(checkin_datetime, INTERVAL 3 HOUR) < '"+timestamp+"'", function (err, result) {
        console.log('update')
        
        if (err) {throw err}
        else {
            pool.query("INSERT INTO geohut_sport.check_ins_storage select * from geohut_sport.check_ins where DATE_ADD(checkin_datetime, INTERVAL 3 HOUR) < '"+timestamp+"'", function (err, results) {
                console.log('insert')
                
                if (err) {throw err}
                else {
                    pool.query("DELETE FROM geohut_sport.check_ins WHERE DATE_ADD(checkin_datetime, INTERVAL 3 HOUR) < '"+timestamp+"'", function (err, result) {
                        console.log('delete')
                 if (err) throw err;
                 console.log("Number of records deleted: " + result.affectedRows);
                });
                };
            });
        };
        
      });



            pool.query("INSERT INTO geohut_sport.pre_check_ins_storage select * from geohut_sport.pre_check_ins where DATE_ADD(pre_checkin_datetime, INTERVAL 30 MINUTE) < '"+timestamp+"'", function (err, results) {
                console.log('insert pre')
                
                if (err) {throw err}
                else {
                    pool.query("DELETE FROM geohut_sport.pre_check_ins WHERE DATE_ADD(pre_checkin_datetime, INTERVAL 30 MINUTE) < '"+timestamp+"'", function (err, result) {
                        console.log('delete pre')
                 if (err) throw err;
                 console.log("Number of records deleted: " + result.affectedRows);
                });
                };
            });
        
        
     






    


  }, 300000);





  





//set server to listen 
app.listen(port,()=>console.log(`Express Server is Running on port 3007 ${port}`));

