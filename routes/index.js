var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const mysql = require('mysql');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtPassword = 'hellopass'
const dbCredentials = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'expresslogin'
};
const dbConnection = mysql.createConnection(dbCredentials);
dbConnection.connect((error) => {
  if (error) throw error;
  console.log('db connection sucess');
});

let jsonparser = bodyParser.json();
let urlparser = bodyParser.urlencoded({ extended: false });

function varifyToken(req, res, next) {
  // console.log(req.headers.authorization);
  // let tokenhead = req.headers.authorization;
  console.log(req.cookies.authorization + "<= cookie authorization");
  let tokenhead = req.cookies.authorization;
  if (tokenhead) {
    // console.log('token true');
    console.log(tokenhead + "  <= token head");
    let token = tokenhead.split(' ').pop();
    console.log(token + "<= pure token");
    jwt.verify(token, jwtPassword, (error, decode) => {
      if (error) {
        console.log('token varification failed');
        let hbsObject = {
          title: 'Login Failed',
          status: 'auth failed \n token invalid'
        }
        res.status(403).render('jwt', hbsObject);
      }
      else {
        console.log('token decoded : ', decode);
        // res.send(decode)
        next();
      }
    });
  }
  else {
    let hbsObject = {
      title: 'Auth error',
      status: 'token not exist'
    };
    res.status(401).render('jwt', hbsObject);
  }
}

router.get('/login', (req, res, next) => {
  res.render('user', { title: 'login' });
})

/* LOGIN For AUTH */
router.post('/login', (req, res, next) => {
  console.log(req.body);
  let { email, password } = req.body;
  console.log(email, password);
  let dbQuery = 'SELECT username,id FROM login WHERE email = ? AND password = ?';
  dbConnection.query(dbQuery, [email, password], (error, results, fields) => {
    if (error) throw error;
    else if (results[0] == undefined) {
      console.log(results, fields);
      console.log('empty');
      res.send("AUTHENDICATION FAILED");
    }
    else {
      console.log('sucess');
      console.log(results[0]);
      encodeData = {
        user: results[0].username,
        id: results[0].id
      }
      jwt.sign(encodeData, jwtPassword, { expiresIn: '1h' }, (error, token) => {
        res.cookie('authorization', `token ${token}`, { expires: new Date(Date.now() + 3600000), httpOnly: true, encode: String });
        res.status(200).send({ results, token });
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
router.get('/signup', (req, res, next) => {
  res.render('user', { title: 'login', signup: true });
})

/* POST data*/
router.post('/', jsonparser, urlparser, (req, res, next) => {
  var dbQuery = 'INSERT INTO login(username,email,password) VALUES(?,?,?)';
  console.log(req.body);
  let { username, email, password } = req.body;
  console.log(username, email, password);
  dbConnection.query(dbQuery, [username, email, password], (error, resuls, fields) => {
    if (error) throw error
    console.log("inserting sucess");
    hbsObject = {
      title: 'signup',
      status: 'signup sucess please login'
    }
    res.render("jwt", hbsObject);
  });
});

/* PATCH data */
router.patch('/', (req, res, next) => {
  var dbQuery = 'UPDATE login SET username = ?, password = ? WHERE email = ?';
  console.log(req.body);
  let { username, email, password } = req.body;
  dbConnection.query(dbQuery, [username, password, email], (error, results, fields) => {
    if (error) throw error;
    console.log('updation sucess');
    console.log(results);
    res.send('updation sucess');
  });
});

/* DELETE data */
router.delete('/', (req, res, next) => {
  console.log(req.body);
  var dbQuery = 'DELETE FROM login WHERE email = ?';
  let { id, email } = req.body;
  dbConnection.query(dbQuery, [email], (error, resuls, fields) => {
    if (error) throw error;
    console.log('deleting sucess');
    console.log(resuls);
    console.log(fields);
    res.send('delete sucess');
  });
});

module.exports = router;