var express = require('express');
var app = express();
const cors = require("cors");
var crypto = require('crypto');
const util = require('./util');
const jwt = require('jsonwebtoken');
require('custom-env').env('dev')
const corsOptions = {
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200,
}
const dotenv = require("dotenv");
process.on('unhandledRejection', function (reason, promise) {
   console.log(promise);
});
const cookieParser = require("cookie-parser");

// Configs
dotenv.config()
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser());
// Checking the JWT 
app.use((req, res, next) => {
   if (req.originalUrl != "\/user\/login" && req.originalUrl != "\/user\/signup" && req.originalUrl != "\/logo192.png" && req.originalUrl != "\/favicon.ico") {
      const token = req.headers.authorization.split(' ')[1]; // Get your token from the request
      const tokenType = req.headers.token;
      let secret;
      if (tokenType == "token")
         secret = process.env.TOKEN_SECRET;
      else if (tokenType == "ref_token")
         secret = process.env.REFRESH_TOKEN_SECRET;

      console.log("tokenType: " + tokenType);

      jwt.verify(token, secret, function (err, decoded) {
         if (err) {
            console.log(err);
            res.status(401).send('Token error');
         }
         req.auth = decoded
         next()
      });
   }
   else
      next()
})


// Importing routes
const user = require('./routes/user');
const list = require('./routes/list');
const task = require('./routes/task');

// Use user route when url matches /api/user/
app.use('/user', user);
app.use('/list', list);
app.use('/task', task);


var server = app.listen(8081, function () {
   var host = process.env.SERVER_HOST
   var port = process.env.SERVER_PORT
   console.log("Example app listening at http://%s:%s", host, port)

})

