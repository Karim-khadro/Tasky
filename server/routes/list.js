const express = require('express');
const router = express.Router();
const util = require('../util');
const logger = require('../logger');

// * DONE
// Get all the lists of a user
// Used to load all the list of a specific user
// Params: userid 
// Return: all the list of the user
//         Throw error if not
router.get('/load', (req, res) => {
   logger.info(`list/load `);
   var userid = req.auth.userid;
   var response = {};
   var sql = "SELECT name FROM lists WHERE user_id = ?";

   util.con.query(sql, [userid], function (err, result) {
      if (err) {
         logger.error(`/list/load ${err}`);
         throw err;
      }
      if (!result.length) {
         response = {}
         res.end(JSON.stringify(response));
      }
      else {
         response = { lists: result }
         res.end(JSON.stringify(response));
      }
   });
})

// * DONE
// Get tasks of a list 
// Used to load all the tasks of a specific list
// Params: listname & userid 
// Return: all the tasks of the list
//         Throw error if not
router.get('/tasks', async (req, res) => {
   logger.info(`list/tasks `);
   var listname = req.query.list;
   var userid = req.auth.userid;
   var response = {}
   var sql = "SELECT id,name,status,date FROM tasks WHERE list_id = ? ORDER BY date";
   var listId = await util.getListId(listname, userid);
   listId = await listId.id;

   util.con.query(sql, [listId], function (err, result) {
      if (err) {
         logger.error(`/list/tasks ${err}`);
         throw err;
      }
      // Date formating
      for (var i = 0; i < result.length; i++) {
         var dateFormat = result[i].date;
         dateFormat = new Date(result[i].date).toDateString();
         result[i].date = dateFormat;
      }
      response.items = result;
      res.end(JSON.stringify(response));
   });
})

// * DONE
// Delete existing list 
// Used to delete a list
// Params: listname & userid 
// Return: true if the list is deleted
//         Throw error if not
router.post('/delete', (req, res) => {
   logger.info(`/list/delete `);
   var listname = req.body.list;
   var userid = req.auth.userid;
   var sql_q = "DELETE FROM lists WHERE user_id = ? AND name = ? ";

   util.con.query(sql_q, [userid, listname], function (err, result) {
      if (err) {
         logger.error(`/list/delet ${err}`);
         throw err;
      }
      logger.info(`/list/delete ${res.affectedRows} record updated`);
      res.end(JSON.stringify(true));
   });


})

// * DONE
// Edit existing list's name
// Used to change the name of a list
// Params: listname & newlistname & userid 
// Return: true if the name is changed
//         Throw error if not
router.post('/edit', (req, res) => {
   logger.info(`/list/edit `);
   var listname = req.body.list;
   var newlistname = req.body.newlist;
   var userid = req.auth.userid;
   var modifAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
   var sql_q = "UPDATE lists SET name = ?,modified_at=? WHERE user_id = ? AND name = ? ";

   util.con.query(sql_q, [newlistname, modifAt, userid, listname], function (err, result) {
      if (err) {
         logger.error(`/list/edit ${err}`);
         throw err;
      }
      logger.info(`/list/edit ${res.affectedRows} record updated`);
      res.end(JSON.stringify(true));
   });
})

// * DONE
// Create new list
// Used to add new list to the DB
// Params: listname & userid 
// Return: true if a new list is added to the DB
//         Throw error if not
router.post('/create', (req, res) => {
   logger.info(`/list/create `);
   var listname = req.body.list;
   var userid = req.auth.userid;
   var createdAt = new Date();
   createdAt = createdAt.toISOString().slice(0, 19).replace('T', ' ');
   var response = {};

   var sql = "SELECT name FROM lists WHERE name = ? AND user_id = ?";
   util.con.query(sql, [listname, userid], function (err, result) {
      if (err) {
         logger.error(`/list/create at SELECT ${err}`);
         throw err;
      }
      if (result.length > 0) {
         response = { error: "A list wiht the same name already exists" }
         res.end(JSON.stringify(response));
      }
      else {
         sql = "INSERT INTO lists (name,created_at,user_id) VALUES ?";
         var values = [[listname, createdAt, userid]];
         util.con.query(sql, [values], function (err, result) {
            if (err) {
               logger.error(`/list/create at INSERT ${err}`);
               throw err;
            }
            else {
               res.end(JSON.stringify(true));
            }
         });
      }
   });
})

module.exports = router; 