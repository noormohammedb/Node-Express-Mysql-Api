var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const mysql = require('mysql');
const { json } = require('body-parser');
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

let jsonparser = bodyParser.json();
let urlparser = bodyParser.urlencoded({extended:false});

/* GET data */
router.get('/', function (req, res, next) {
  var dbQuery = 'SELECT * FROM login';
  dbConnection.query(dbQuery, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0]);
    res.send(results);
    // res.render('index', { title: 'Express' });
  });
});

/* POST data*/
router.post('/',jsonparser,urlparser,(req,res,next)=>{
  var dbQuery = 'INSERT INTO login(username,email,password) VALUES(?,?,?)';
  console.log(req.body);
  let {username, email, password} = req.body;
  console.log(username, email, password);
  dbConnection.query(dbQuery,[username, email, password],(error, resuls, fields)=> {
    if(error) throw error
    console.log("inserting sucess");
    // console.log(resuls);
    res.send("i am developing");
  });
});

/* PATCH data */
router.patch('/',(req,res,next)=>{
  var dbQuery = 'UPDATE login SET username = ?, password = ? WHERE email = ?';
  console.log(req.body);
  let {username, email, password} = req.body;
  dbConnection.query(dbQuery,[username, password, email],(error, results, fields)=>{
    if(error) throw error;
    console.log('updation sucess');
    console.log(results);
    res.send('updation sucess');
  });
});

module.exports = router;