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
               // console.log(res.affectedRows + " record updated after login");
            });

            // User's token
            const tokeninfo = { userid: result[0].id, username: result[0].name }
            const token = util.generateAccessToken(tokeninfo);
            const refresh_token = util.generateAccessToken(tokeninfo, true);

            // res.cookie('token', refresh_token, {
            //    expires: new Date(Date.now() + 50000), // time until expiration
            //    secure: false, // set to true if your using https
            //    httpOnly: true,
            // });
            var refTokenAge = process.env.REFRESH_TOKEN_AGE.replace("s", "");
            refTokenAge = Math.floor(parseInt(refTokenAge) - parseInt(refTokenAge) * 0.3)
            response = {
               isauth: true,
               token: token,
               refreshtoken: refresh_token,
               refreshtoken_age: refTokenAge,
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
         response = {
            isauth: true,
            userid: id,
            username: name
         };
         res.end(JSON.stringify(response));
      }
   });
})


router.use((req, res, next) => {
   const token = req.headers.authorization.split(' ')[1]; // Get your token from the request
   const tokenType = req.headers.token;
   if (tokenType == "token") {
      jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
         if (err) {

            throw new Error(err)
         }  // Manage different errors here (Expired, untrusted...)
         req.auth = decoded // If no error, token info is returned in 'decoded'
         next()
      });
   }
   else if (tokenType == "ref_token") {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
         if (err) {
            console.log(err);
            if (err.name != "TokenExpiredError") {
               throw new Error(err)
            }


         }  // Manage different errors here (Expired, untrusted...)
         req.auth = decoded // If no error, token info is returned in 'decoded'
         next()
      });
   }
})

router.get('/newtoken', (req, res) => {
   console.log("New token");
   var authorization = req.headers.authorization.split(' ')[1];
   // console.log("\nauthorization: ");
   // console.log(authorization);
   var decoded;
   var response = {}

   try {
      console.log("\ndecoded:");
      decoded = jwt.verify(authorization, process.env.REFRESH_TOKEN_SECRET);

      console.log(decoded);
      // TODO: make it function
      const tokeninfo = { userid: decoded.userid, username: decoded.username }
      const token = util.generateAccessToken(tokeninfo);
      const refresh_token = util.generateAccessToken(tokeninfo, true);
      var refTokenAge = process.env.REFRESH_TOKEN_AGE.replace("s", "");
      refTokenAge = Math.floor(parseInt(refTokenAge) - parseInt(refTokenAge) * 0.3)

      response = {
         isauth: true,
         token: token,
         refreshtoken: refresh_token,
         refreshtoken_age: refTokenAge,
         userid: decoded.userid,
         username: decoded.username
      };
      res.end(JSON.stringify(response));

      // console.log(decoded);
   } catch (e) {
      response = {
         isauth: false
      };
      res.status(401).send(response);
   }

})

module.exports = router; 