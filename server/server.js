var express = require('express');
var app = express();
const cors = require("cors");
var crypto = require('crypto');
require('custom-env').env('dev')
const corsOptions = {
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200,
}
const dotenv = require("dotenv");
process.on('unhandledRejection', function(reason, promise) {
   console.log(promise);
});
const cookieParser = require("cookie-parser");

// Configs
dotenv.config()
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser());
// app.use(bodyparser.json());  


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

