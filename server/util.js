var mysql = require('mysql');
require('custom-env').env('prod')
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('./logger');


// Configs
dotenv.config()


// DB connection
var con = mysql.createConnection({
   host: process.env.BD_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
});

con.connect(function (err) {
   if (err) {
      console.log(err);
      throw err;
   }
   logger.info("Connected from DB!");
});


// Get a list by name & userid
// Params: listname & userid 
// Return: listId or error
function getListId(listname, userid) {
   logger.info("getListId function");
   var sql = "SELECT id FROM lists WHERE name = ? AND user_id = ?";
   return new Promise((resolve, reject) => {
      con.query(
         sql,
         [listname, userid],
         (err, result) => {
            return err ? reject(err) : resolve(result[0]);
         }
      );
   });
}


function generateAccessToken(data, refresh = false) {
   if (refresh)
      return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_AGE });
   return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_AGE });
}


function getTokens(username, userid) {
   const tokeninfo = { userid: userid, username: username }
   const token = generateAccessToken(tokeninfo);
   const refresh_token = generateAccessToken(tokeninfo, true);

   var refTokenAge = process.env.REFRESH_TOKEN_AGE.replace("s", "");
   refTokenAge = Math.floor(parseInt(refTokenAge) - parseInt(refTokenAge) * 0.2)
   const response = {
      isauth: true,
      token: token,
      refreshtoken: refresh_token,
      refreshtoken_age: refTokenAge,
      username: username
   };
   return response;
}


function hashIt(password) {
   const salt = bcrypt.genSaltSync(6);
   const hashed = bcrypt.hashSync(password, salt);
   return hashed
}

// compare the password user entered with hashed pass.
function compareIt(password, hashedPassword) {
   const validPassword = bcrypt.compareSync(password, hashedPassword);
   return validPassword
}


module.exports.hashIt = hashIt;
module.exports.compareIt = compareIt;
module.exports.getTokens = getTokens;
module.exports.generateAccessToken = generateAccessToken;
module.exports.getListId = getListId;
module.exports.con = con; 