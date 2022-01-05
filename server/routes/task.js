const express = require('express');
const router = express.Router();
const util = require('../util');
const logger = require('../logger');

// * DONE
// Edit existing task
// Used to change the status, name, date or delete a task
// Params: status & taskid & (newname & date ) for name/date changes
// Return: true if the task is modified/deleted
//         Throw error if not
router.post('/edit', (req, res) => {
   logger.info(`/task/edit`);
   var status = req.body.status;
   var taskid = req.body.taskid;
   var sql = "";
   var values;
   var modifAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

   if (status === "delete") {
      sql = "DELETE FROM tasks WHERE id = ?";
      values = taskid;
      logger.info("DELETE task");
   }
   else if (status === "edit") {
      logger.info("EDIT task name/date");
      var newname = req.body.newname;
      var date = req.body.date;
      sql = "UPDATE tasks SET name = ?, date = ?, modified_at = ? WHERE id = ?";
      values = [newname, date, modifAt, taskid];

   }
   else {
      logger.info("EDIT task status");
      sql = "UPDATE tasks SET status = ?,modified_at=? WHERE id = ?";
      values = [status, modifAt, taskid];
   }
   util.con.query(sql, values, function (err, result) {
      if (err) {
         logger.error(`/task/edit ${err} `);
         throw err;
      }
      res.end(JSON.stringify(true));
   });
})

// * DONE
// Create new taks
// Used to add new taks to a list 
// Params: listname & userid & name & date
// Return: if the task is added => added = true
//                                 taskid
//         Throw error if not
router.post('/create', async (req, res) => {
   logger.info(`/task/create`);
   var listname = req.body.list;
   var userid = req.auth.userid;;
   var name = req.body.name;
   var date = req.body.date;
   date = new Date(date);
   date = date.toISOString().slice(0, 10);
   var createdAt = new Date();
   createdAt = createdAt.toISOString().slice(0, 19).replace('T', ' ');
   var listId = await util.getListId(listname, userid);
   listId = listId.id;

   var sql = "INSERT INTO tasks (name,date,status,created_at,list_id) VALUES ?";
   var values = [[name, date, "progress", createdAt, listId]];

   util.con.query(sql, [values], function (err, result) {
      if (err) {
         logger.error(`/task/create ${err} `);
         throw err;
      }
      else {
         var response = {
            added: true,
            taskid: result.insertId
         };
         res.end(JSON.stringify(response));
      }
   });
})

module.exports = router; 