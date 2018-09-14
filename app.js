//load our app server using express
const express = require('express');
var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('dbconfig');
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
/*
var doConnect = function(cb) {
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    cb);
};*/

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'));


app.post('/user_create', (req, res) => {

  //console.log("Name: "+ req.body.create_name) // com o nome do elemento o bodyParser traz o conteúdo do input
  const Name = req.body.create_name
  const City = req.body.create_city

  const queryString = "INSERT INTO users_victorNode ()"

  res.end()
})



var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

app.use(morgan('short'))

app.get("/", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from rooot")
})

app.get("/users", (req, res) => {
  var user1 = {firstName: "Stephen", lastName: "Curry"}
  const user2 = {firstName: "Kevin", lastName: "Durant"}
  res.json([user1,user2])

  //res.send("Nodemon autoupdates!")
})

app.get("/users/:id", (req, res) => {
  console.log("Fetching user with id: " + req.params.id)
  queryString = 'SELECT * FROM users_victorNode WHERE USER_ID=:id';
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    function(err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      connection.execute(queryString,[req.params.id],function(err, result) {
          if (err) {
            console.error(err.message);
            dorelease(connection);
            return;
          }
          //console.log(result.metaData);
          //console.log(result.rows);     
          const users = result.rows.map((row) => {
            return {userName: row[1]}
          })

          res.json(users);
          dorelease(connection);
        });
    });
  
})


// localhost:3003
app.listen(3003, () =>{
  console.log("Servidor conectado na porta 3003...")
})
