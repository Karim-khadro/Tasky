var mysql = require('mysql');
require('custom-env').env('dev')
const dotenv = require("dotenv");

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
   console.log("Connected from DB!");
});


// Get a list by name & userid
// Params: listname & userid 
// Return: listId or error
function getListId(listname, userid) {
   console.log("getListId function");
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

module.exports.getListId = getListId;
module.exports.con = con; 