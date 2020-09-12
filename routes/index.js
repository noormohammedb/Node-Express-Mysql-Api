var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const dbCredentials = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'expresslogin'
};
const dbConnection = mysql.createConnection(dbCredentials);
dbConnection.connect((error)=>{
  if(error) throw error;
    console.log('db connection sucess');
});


/* GET data */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });
});

module.exports = router;