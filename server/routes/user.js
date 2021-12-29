const express = require('express');
const router = express.Router();
const {
   v1: uuidv1,
} = require('uuid');
const util = require('../util');

// * DONE
// Get user info 
// Used to check if the user account exists and log in the user
// Params: email & password
// Return: isauth: true if the info are correct, false if the infos are incorrect
//         errormsg: when no user is found a message is returned
//         userid
//         username
router.post('/login', (req, res) => {
   console.log("User info");
   var email = req.body.email.toLowerCase();
   var password = req.body.password;

   var sql = "SELECT id,name FROM users WHERE email = ? AND password = ?";
   var response = {}

   util.con.query(sql, [email, password], function (err, result) {
      console.log(result[0]);
      if (err) {
         throw err;
      }
      else {
         if (!result.length) {
            console.log("User dosen't exist");
            response = {
               isauth: false,
               errormsg: "User dosen't exist"
            }
         }
         else {
            // Update last login date
            var loggedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            var sql_q = "UPDATE users SET last_login = ? WHERE id = ? ";
            util.con.query(sql_q, [loggedAt, result[0].id], function (err, result) {
               if (err) {
                  console.log(err);
                  throw err;
               }
               console.log(res.affectedRows + " record updated after login");
            });

            response = {
               isauth: true,
               userid: result[0].id,
               username: result[0].name
            };
         }
         res.end(JSON.stringify(response));
      }
   });
})

// * DONE
// Register new user
// Used to add new user to the DB
// Params: name & email & password
// Return: isauth: true if the info are correct (the email is never used before), false if the infos are incorrect
//         errormsg: when same email address is found
//         userid
//         username
router.post('/signup', (req, res) => {
   console.log("Register new user");
   var name = req.body.name.toLowerCase();
   var email = req.body.email.toLowerCase();
   var password = req.body.password;
   var createdAt = new Date();
   createdAt = createdAt.toISOString().slice(0, 19).replace('T', ' ');
   var id = uuidv1();

   var sql = "INSERT INTO users (id,name,email,password,last_login,created_at) VALUES ?";
   var values = [[id, name, email, password, createdAt, createdAt]];
   var response = {}

   util.con.query(sql, [values], function (err, result) {
      if (err) {
         console.log(err);
         if (err.code == "ER_DUP_ENTRY") {
            response = {
               isauth: false,
               errormsg: "Account already exists"
            };
            res.end(JSON.stringify(response));
         }
         else
            throw err;
      }
      else {
         response = {
            isauth: true,
            userid: id,
            username: name
         };
         res.end(JSON.stringify(response));
      }
   });
})

module.exports = router; 