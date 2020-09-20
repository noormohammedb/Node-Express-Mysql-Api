var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const mysql = require('mysql');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
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

function varifyToken(req,res,next){
  console.log(req.headers.authorization);
  let tokenhead = req.headers.authorization;
  if(tokenhead)
  {
    console.log('token true');
    let token =tokenhead.split(' ').pop();
    console.log(token);
    jwt.verify(token,'hello',(error,decode)=>{
      if(error){ 
        console.log('token varification failed');
        res.status(403).send('auth failed');
      }
      else{
        console.log('token decoded : ',decode);
        // res.send(decode)
        next();
      }
    });
  }
  else
  res.status(401).send('unauthorized access');
}

router.get('/login',(req,res,next)=>{
    res.render('user', { title: 'login' });
})

/* LOGIN For AUTH */
router.post('/login',(req, res, next)=>{
  console.log(req.body);
  let {email, password} = req.body;
  console.log(email, password);
  let dbQuery = 'SELECT username FROM login WHERE email = ? AND password = ?';
  dbConnection.query(dbQuery,[email, password],(error,results,fields)=>{
    if(error) throw error;
    else if(results[0]==undefined){
      console.log(results, fields);
      console.log('empty');
      res.send("AUTHENDICATION FAILED");
    }
    else{
      console.log('sucess');
      console.log(results[0]);
      jwt.sign({user: results[0].username},'hello',{expiresIn: '1h'},(error,token)=>{
        res.status(200).send({results,token});
        console.log(token);
      });
    }
  });
});

/* GET data */
router.get('/', varifyToken, function (req, res, next) {
  var dbQuery = 'SELECT * FROM login';
  dbConnection.query(dbQuery, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0]);
    res.send(results);
    // res.render('index', { title: 'Express' });
  });
});

/* SIGNUP */
router.get('/signup',(req,res,next)=>{
  res.render('user', { title: 'login', signup: true });
})

/* POST data*/
router.post('/',(req,res,next)=>{
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

/* DELETE data */
router.delete('/',(req, res, next)=>{
  console.log(req.body);
  var dbQuery = 'DELETE FROM login WHERE email = ?';
  let { id, email } = req.body;
  dbConnection.query(dbQuery,[email],(error, resuls, fields)=>{
    if(error) throw error;
    console.log('deleting sucess');
    console.log(resuls);
    console.log(fields);
    res.send('delete sucess');
  });
});

module.exports = router;