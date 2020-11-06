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

let timestamp = moment().utc().format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0'
    console.log(timestamp + 'utc')


//     var current_time = moment().format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';

//     console.log(current_time + 'no UTC')

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
    timezone: 'utc',
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

//request app status
app.get('/app_status',  function(req,res){
    var sql = "SELECT * FROM geohut_sport.app_status;";
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



//request all groups
app.get('/get_groups/:playgroundId',  function(req,res){

 
       var site_id = req.params.playgroundId;

      

    var sql = "SELECT * FROM geohut_sport.groups where playground_id = '"+site_id+"';";
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



//get 1 users
app.get('/get_user/:uid',  function(req,res){

 
    var uid = req.params.uid;

    

 var sql = "SELECT * FROM geohut_sport.user_table where uid = '"+uid+"';";
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


//get all users in group
app.get('/get_users/:uids',  function(req,res){

    //JSON.parse(res.data)
    var uids = JSON.parse(req.params.uids);
    
 

    

 var sql = 'SELECT * FROM geohut_sport.user_table where email IN (?);';
 pool.query(sql, [uids], function(err, results) {
     if(err) {
         return res.send(err)
     } else {
         //console.log(results)
         return res.json({
             data: results
         })
     }
 });
});


//request all groups
app.get('/get_group_members/:group_id',  function(req,res){

 
    var group_id = req.params.group_id;

  

 var sql = "SELECT JSON_EXTRACT(members, '$'), JSON_EXTRACT(waiting, '$'), JSON_EXTRACT(invited, '$') FROM geohut_sport.groups where group_id = '"+group_id+"';";
 pool.query(sql, function(err, results) {
     if(err) {
         console.log(err)
     } else {
         console.log(results)
        return res.json({
            data: results
        })
       
     }
 });
});








//request all construction sites
app.get('/potential_sites',  function(req,res){
    var sql = "SELECT * FROM geohut_sport.playgrounds_queue;";
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


app.put('/confirm_potential_sites',  function(req,res){
    

    var my_data = {
        site_id: req.query.site_id
       }

   


       var sql = "UPDATE geohut_sport.playgrounds_queue SET confirms = confirms + 1 where site_id = '"+my_data.site_id+"';";
   
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
          
            return res.send(err)

        } else {
            return res.json({
                data: results
            })
        }
    });
});



//request live court info
app.get('/live_courts_info/:playgroundId',  function(req,res){
    var playgroundId = req.params.playgroundId;

    var sql = "SELECT * FROM geohut_sport.live_courts_info where site_id = '"+playgroundId+"' ORDER BY report_datetime DESC LIMIT 1;";
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






app.get('/pre_checks/:playgroundId',  function(req,res){
    var playgroundId = req.params.playgroundId;
    var sql = "SELECT * FROM geohut_sport.pre_check_ins where site_id = '"+playgroundId+"';";
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
 app.get('/precheckcheck/:uid',  cors(),function(req,res){
    var uid = req.params.uid;
    
    var sql = "SELECT site_id FROM geohut_sport.pre_check_ins WHERE user_id = '"+uid+"'";
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


//add user to database
app.post('/new_user',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        uid: req.query.uid,
        first_name: req.query.first_name,
        last_name: req.query.last_name,
        email: req.query.email,
        datetime_stamp:req.query.datetime_stamp
       }
       // now the createStudent is an object you can use in your database insert logic.
       pool.query('INSERT INTO geohut_sport.user_table SET ?', my_data, function (err, results) {
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
app.delete('/delete_user',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';

    var my_data = {
        
        
        uid: req.query.uid

       }

       console.log(my_data.uid)
  
       // now the createStudent is an object you can use in your database insert logic.
       var sql = "DELETE FROM geohut_sport.user_table WHERE uid = '"+my_data.uid+"'";
       pool.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});


//ADD GROUP
app.post('/addGroup',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        
        
        admin_id: req.query.admin_id,
        playground_id: req.query.playground_id,
        group_name: req.query.group_name,
        status: req.query.status,
        member: req.query.member,
        waiting: req.query.waiting,
        invited: req.query.invited
       }

       // now the createStudent is an object you can use in your database insert logic.
       pool.query("INSERT INTO geohut_sport.groups (group_id,admin_id,playground_id,group_name,status,members,waiting,invited) values (uuid(),'"+my_data.admin_id+"','"+my_data.playground_id+"','"+my_data.group_name+"','"+my_data.status+"','["+JSON.stringify(my_data.member)+"]','["+JSON.stringify(my_data.waiting)+"]','["+JSON.stringify(my_data.invited)+"]')", function (err, results) {
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


//ADD temperarure
app.post('/addTemperature',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        
        
        
        playground_id: req.query.playground_id,
        
        weather: req.query.weather,
        weather_datetime: req.query.weather_datetime
       }

       console.log([my_data.weather])

       // now the createStudent is an object you can use in your database insert logic.
       pool.query("INSERT INTO geohut_sport.live_courts_info (site_id,weather,weather_datetime) values ('"+my_data.playground_id+"','"+my_data.weather+"','"+my_data.weather_datetime+"') ON DUPLICATE KEY UPDATE weather = '"+my_data.weather+"',weather_datetime='"+my_data.weather_datetime+"'", function (err, results) {
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



//Pull temperarure

 app.get('/pullTemperature/:pid',  cors(),function(req,res){
    var pid = req.params.pid;
    
    var sql = "SELECT weather, weather_datetime FROM geohut_sport.live_courts_info WHERE site_id = '"+pid+"'";
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

//Remove records
app.delete('/deleteGroup',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';

    var my_data = {
        
        
        group_id: req.query.group_id

       }
  
       // now the createStudent is an object you can use in your database insert logic.
       var sql = "DELETE FROM geohut_sport.groups WHERE group_id = '"+my_data.group_id+"'";
       pool.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});


//Report number of people
app.post('/live_courts_info',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        site_id: req.query.site_id,
        
        first_name: req.query.first_name,
        last_name: req.query.last_name,
        report_datetime: req.query.time,
        count: req.query.count
       }
       // now the createStudent is an object you can use in your database insert logic.
     
       pool.query("INSERT INTO geohut_sport.live_courts_info (site_id,first_name,last_name,report_datetime,count) values ('"+my_data.site_id+"','"+my_data.first_name+"','"+my_data.last_name+"','"+my_data.report_datetime+"','"+my_data.count+"') ON DUPLICATE KEY UPDATE first_name = '"+my_data.first_name+"',last_name='"+my_data.last_name+"', report_datetime = '"+my_data.report_datetime+"',count='"+my_data.count+"'", function (err, results) {
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


//ADD PLAYGROUND
app.post('/addPlayground',  cors(), (req, res) => {
    //current_time = moment().utcOffset('-0400').format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0';
    var my_data = {
        
        
        name: req.query.name,
        address: req.query.address,
        lat: req.query.latitude,
        lon: req.query.longitude
       }

       // now the createStudent is an object you can use in your database insert logic.
       pool.query("INSERT INTO geohut_sport.playgrounds_queue (site_id,site_name,site_address,latitude,longitude) values (uuid(),'"+my_data.name+"','"+my_data.address+"','"+my_data.lat+"','"+my_data.lon+"')", function (err, results) {
        if(err) {
            console.log(err)
            return res.send(err)
            
        } else {
          
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
            
            return res.json({
                data: results
            })
        }
    });
});




//rest api to update record into mysql database
app.put('/update', cors(), (req, res) => {

    
    
    var my_data = {
        site_id: req.query.site_id,

        user_id: req.query.user_id
       }

       var sql = "UPDATE geohut_sport.check_ins SET checkout_datetime= now() where site_id = '"+my_data.site_id+"' and user_id = '"+my_data.user_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });



 app.put('/update_user_info', cors(), (req, res) => {

    
    
    var my_data = {
        first_name: req.query.first_name,

        last_name: req.query.last_name,
        uid: req.query.uid
        

       }

       var sql = "UPDATE geohut_sport.user_table SET first_name= '"+my_data.first_name+"', last_name= '"+my_data.last_name+"' where uid = '"+my_data.uid+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });



//add group members
 app.put('/add_group_members', cors(), (req, res) => {

    
    
    var my_data = {
        group_id: req.query.group_id,

        user_id: req.query.user_id
       }

       
       var sql = "update geohut_sport.groups set members = json_array_append(members, '$','"+my_data.user_id+"') where group_id = '"+my_data.group_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });


 //add to waitlist
 app.put('/add_to_waitlist', cors(), (req, res) => {

    
    
    var my_data = {
        group_id: req.query.group_id,

        user_id: req.query.user_id
       }

       
       var sql = "update geohut_sport.groups set waiting = json_array_append(waiting, '$','"+my_data.user_id+"') where group_id = '"+my_data.group_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });

 //Invite group members

 app.put('/invite_group_members', cors(), (req, res) => {

    
    
    var my_data = {
        group_id: req.query.group_id,

        user_id: req.query.user_id
       }

       
       var sql = "update geohut_sport.groups set invited = json_array_append(invited, '$','"+my_data.user_id+"') where group_id = '"+my_data.group_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });



 //remove group members
 app.put('/remove_group_members', cors(), (req, res) => {

    
    
    var my_data = {
        group_id: req.query.group_id,

        user_id: req.query.user_id
       }

       var sql = "UPDATE geohut_sport.groups SET members = JSON_REMOVE(members, JSON_UNQUOTE(JSON_SEARCH(members,'one', '"+my_data.user_id+"'))) WHERE JSON_SEARCH(members,'one', '"+my_data.user_id+"') IS NOT NULL and group_id = '"+my_data.group_id+"'"
       
//var sql = "update geohut_sport.groups set members = json_array_append(members, '$','"+my_data.user_id+"') where group_id = '"+my_data.group_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });

  //remove from waitlist
  app.put('/remove_from_waitlist', cors(), (req, res) => {

    
    
    var my_data = {
        group_id: req.query.group_id,

        user_id: req.query.user_id
       }

       var sql = "UPDATE geohut_sport.groups SET waiting = JSON_REMOVE(waiting, JSON_UNQUOTE(JSON_SEARCH(waiting,'one', '"+my_data.user_id+"'))) WHERE JSON_SEARCH(waiting,'one', '"+my_data.user_id+"') IS NOT NULL and group_id = '"+my_data.group_id+"'"
       
//var sql = "update geohut_sport.groups set members = json_array_append(members, '$','"+my_data.user_id+"') where group_id = '"+my_data.group_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });



   //remove from invited
   app.put('/remove_from_invited', cors(), (req, res) => {

    
    
    var my_data = {
        group_id: req.query.group_id,

        user_id: req.query.user_id
       }

       var sql = "UPDATE geohut_sport.groups SET invited = JSON_REMOVE(invited, JSON_UNQUOTE(JSON_SEARCH(invited,'one', '"+my_data.user_id+"'))) WHERE JSON_SEARCH(invited,'one', '"+my_data.user_id+"') IS NOT NULL and group_id = '"+my_data.group_id+"'"
       
//var sql = "update geohut_sport.groups set members = json_array_append(members, '$','"+my_data.user_id+"') where group_id = '"+my_data.group_id+"'";

       pool.query(sql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
 });

 




 //POST TO DATABASE
app.post('/addToStorage',  cors(), async (req, res) => {


  
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


//request all tracking info FOR TEST TABLE
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

//post  all tracking info
app.post('/addGlobal',  cors(), async (req, res) => {
    var my_data = {
        date_time: req.query.datetime,
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        nearest_site: req.query.nearest_site,
        email: req.query.email,
        distance: req.query.distance
       }      
       pool.query('INSERT INTO geohut_sport.trackingGlobal SET ?', my_data, function (err, results) {
        if(err) {
            console.log(err)
            return res.send(err)    
        } else { 
            return res.json({
                data: results
            })
        }
    });
});


//post  all tracking info
app.post('/addTracking',  cors(), async (req, res) => {


    let timestamp = moment().format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0'
    var my_data = {
        date_time: req.query.datetime,
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        nearest_site: req.query.nearest_site,
        email: req.query.email,
        distance: req.query.distance
       }
       
       pool.query('INSERT INTO geohut_sport.trackingTest SET ?', my_data, function (err, results) {
        if(err) {
            console.log(err)
            return res.send(err)
            
        } else {
            
            return res.json({
                data: results
            })
        }
    });
});

//request fencing
app.get('/fencing',  cors(), function(req,res){
    var sql = "SELECT * FROM geohut_sport.fencingTest;";
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

//post fencing
app.post('/addFencing',  cors(), async (req, res) => {


    let timestamp = moment().format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0'
    var my_data = {
        date_time: req.query.datetime,
        region: req.query.region,
        event_type: req.query.eventtype
       }
       
       pool.query('INSERT INTO geohut_sport.fencingTest SET ?', my_data, function (err, results) {
        if(err) {
            console.log(err)
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
    
    // let time_now = moment().format("YYYY-MM-DD HH:mm:ss").substr(0,18)+'0'
    // console.log(time_now + 'test')


       pool.query("UPDATE geohut_sport.check_ins SET checkout_datetime= now() WHERE DATE_ADD(checkin_datetime, INTERVAL 4 HOUR) < now()", function (err, result) {
        console.log('update')
        
        if (err) {throw err}
        else {
            pool.query("INSERT INTO geohut_sport.check_ins_storage select * from geohut_sport.check_ins where DATE_ADD(checkin_datetime, INTERVAL 4 HOUR) < now()", function (err, results) {
                console.log('insert')
                
                if (err) {throw err}
                else {
                    pool.query("DELETE FROM geohut_sport.check_ins WHERE DATE_ADD(checkin_datetime, INTERVAL 4 HOUR) < now()", function (err, result) {
                        console.log('delete')
                 if (err) throw err;
                 console.log("Number of records deleted: " + result.affectedRows);
                });
                };
            });
        };
        
      });



            pool.query("INSERT INTO geohut_sport.pre_check_ins_storage select * from geohut_sport.pre_check_ins where DATE_ADD(pre_checkin_datetime, INTERVAL 30 MINUTE) < now()", function (err, results) {
                console.log('insert pre')
                
                if (err) {throw err}
                else {
                    pool.query("DELETE FROM geohut_sport.pre_check_ins WHERE DATE_ADD(pre_checkin_datetime, INTERVAL 30 MINUTE) < now()", function (err, result) {
                        console.log('delete pre')
                 if (err) throw err;
                 console.log("Number of records deleted: " + result.affectedRows);
                });
                };
            });


            pool.query("INSERT INTO geohut_sport.volleyball_playground_sites select * from geohut_sport.playgrounds_queue where confirms >= 5", 
            function (err, results) {
                console.log('insert pre playground')
                
                if (err) {throw err}
                else {
                    pool.query("Delete FROM geohut_sport.playgrounds_queue WHERE confirms >= 5", function (err, result) {
                        console.log('delete pre playground')
                 if (err) throw err;
                 console.log("Number of records deleted: " + result.affectedRows);
                }); 
                }

            })



            pool.query("Delete FROM geohut_sport.live_courts_info WHERE DATE_ADD(report_datetime, INTERVAL 2 HOUR) < now()", function (err, result) {
                console.log('deleted live courts data')
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
        }); 
        
        
     






    


  }, 600000);





  





//set server to listen 
app.listen(port,()=>console.log(`Express Server is Running on port 3007 ${port}`));

