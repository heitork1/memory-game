const express = require("express");
const bodyParser = require("body-parser")
const mysql = require("mysql2");
const session = require("express-session");
const fs = require("fs");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static('css'))
app.use("/img", express.static("img")); 
app.use("/js", express.static("js"));

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "memorygame",
  });

  connection.connect(function (err) {
    if (!err) {
      console.log("Conexão como o Banco realizada com sucesso!!!");
      connection.query('Select * from usuario', function(err, usuario){
        console.log(usuario)
      })
    } else {
      console.log("Erro: Conexão NÃO realizada", err);
    }
  });


app.post('/pages/game.html',(req, res) =>{
  let nome = req.body.nome
  console.log(nome)
})

app.get('/pages/game.html',(req, res) =>{
  res.sendFile(__dirname + "/pages/game.html")
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(3002, () => {
    console.log("Servidor rodando na porta 3002!");
});