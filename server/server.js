var express = require('express');
var app = express();
const cors = require("cors");
const logger = require('./logger');
const jwt = require('jsonwebtoken');
var favicon = require('serve-favicon');


require('custom-env').env('dev')
const corsOptions = {
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200,
}
const dotenv = require("dotenv");
process.on('unhandledRejection', function (reason, promise) {
   logger.error(`unhandledRejection: promis: ${promise} -- reason ${reason}:`);
});

// Configs
dotenv.config()
app.use(cors(corsOptions))
app.use(express.json())
// Checking the JWT 
app.use((req, res, next) => {
   if (req.headers.authorization) {
      if (req.originalUrl != "\/user\/login" && req.originalUrl != "\/user\/signup" && req.originalUrl != "\/logo192.png" && req.originalUrl != "\/favicon.ico") {
         const token = req.headers.authorization.split(' ')[1]; // Get token from the request
         const tokenType = req.headers.token;
         let secret;

         logger.info(`Toekn type ${tokenType}`);

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
   }
   else
      next()
})
app.use(favicon(__dirname+'/images/favicon.ico'));

// app.get("/favicon.ico",favicon('/images/favicon.ico'));
app.get("/", function (req, res) {
   res.send("<h1>Hello World!</h1>")
})


// Importing routes
const user = require('./routes/user');
const list = require('./routes/list');
const task = require('./routes/task');

// Use user route when url matches /api/user/
app.use('/user', user);
app.use('/list', list);
app.use('/task', task);

const host = process.env.SERVER_HOST
const port = process.env.SERVER_PORT
app.listen(process.env.PORT || port, () => logger.info(`app listening at ${host}:${port}`));
