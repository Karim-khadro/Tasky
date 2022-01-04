const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const util = require('../util');
const jwt = require('jsonwebtoken');
require('custom-env').env('dev')
const dotenv = require("dotenv");

// Configs
dotenv.config()

// * DONE
// Get user info 
// Used to check if the user account exists and log in the user
// Params: email & password
// Return: isauth: true if the info are correct, false if the infos are incorrect
//         errormsg: when no user is found a message is returned
//         userid
//         username
// TODO: check password & salt it 
router.post('/login', (req, res) => {
   console.log("User info");
   var email = req.body.email.toLowerCase();
   var password = req.body.password;

   var sql = "SELECT id,name FROM users WHERE email = ?";
   var response = {}

   util.con.query(sql, [email], function (err, result) {
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
            });
            
            response = util.getTokens(username = result[0].name, userid = result[0].id);
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
   var id = uuidv4();

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
         response = util.getTokens(username = name, userid =id );
         res.end(JSON.stringify(response));
      }
   });
})

router.get('/newtoken', (req, res) => {
   console.log("New token");
   var authorization = req.headers.authorization.split(' ')[1];
   console.log("\nauthorization: ");
   console.log(authorization);
   var decoded;
   var response = {}
   try {
      decoded = jwt.verify(authorization, process.env.REFRESH_TOKEN_SECRET);

      response = util.getTokens(username = decoded.username, userid = decoded.userid);
      res.end(JSON.stringify(response));

   } catch (e) {
      response = {
         isauth: false
      };
      res.status(401).send(response);
   }

})

module.exports = router; 