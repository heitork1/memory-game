const express = require("express");
const bodyParser = require("body-parser")
const mysql = require("mysql2");
const session = require("express-session");
const fs = require("fs");
const ejs = require("ejs");
const moment = require("moment"); // Biblioteca para manipulação de datas e horários

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static('css'))
app.use("/img", express.static("img"));
app.use("/js", express.static("js"));
app.set("view engine", "ejs"); // Configuração do mecanismo de visualização EJS
const path = require("path"); // Módulo para lidar com caminhos de diretórios


const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "memorygame",
});

app.use(
  session({
    secret: "JNUVID45KNJ88", // Chave secreta utilizada para assinar as sessões
    resave: true, //Salva a sessão mesmo que não tenha sido modificada durante a requisição
    saveUninitialized: true, // Salva a sessão mesmo que ela não tenha sido inicializada
  })
);

connection.connect(function (err) {
  if (!err) {
    console.log("Conexão como o Banco realizada com sucesso!!!");
    connection.query('Select * from usuario', function (err, usuario) {
      console.log(usuario)
    })
  } else {
    console.log("Erro: Conexão NÃO realizada", err);
  }
});

app.post('/', (req, res) => {
  const nome = req.body.nome;
  const senha = req.body.senha;

  connection.query("SELECT * FROM usuario WHERE nome = ?", [nome], (err, results) => {
    if (err) {
      console.log("Erro ao verificar o nome no banco de dados", err);
      res.status(500).send("Erro ao verificar o nome no banco de dados");
      return;
    }

    if (results.length === 0) {
      const query = `INSERT INTO usuario (nome, senha) VALUES (?, ?)`;
      connection.query(query, [nome, senha], (err, result) => {
        if (err) {
          console.log("Erro ao inserir o nome no banco de dados", err);
          res.status(500).send("Erro ao inserir o nome no banco de dados");
          return;
        }

        req.session.nome = nome;
        req.session.userID = result.insertId;
        req.session.senha = senha;

        console.log("Nome inserido no banco de dados!");
        res.redirect('/pages/game.html');
      });
    } else if (results[0].senha === senha) {
      req.session.nome = results[0].nome;
      req.session.userID = results[0].idusuario;
      req.session.senha = results[0].senha;

      console.log("usuário já cadastrado");
      res.redirect('/pages/game.html');
    } else {
      res.send("<script> window.location.href = '/'; alert('Senha incorreta!')</script>");
    }
  });
});

app.get('/pages/game.html', (req, res) => {
  console.log("get")
  res.sendFile(__dirname + "/pages/game.html")
})
app.post('/cadastrar-tempo', (req, res) => {
  const tempo = req.body.tempo;
  console.log(req.session.nome)
  const query = 'INSERT INTO tempo (segundos, id_usuario) VALUES (?, ?)';
  connection.query(query, [tempo, req.session.userID], (err, result) => {
    if (!err) {
      console.log('Tempo cadastrado no banco de dados!');
      res.sendStatus(200); // Resposta de sucesso para o cliente
    } else {
      console.error('Erro ao cadastrar tempo no banco de dados:', err);
      res.sendStatus(500); // Resposta de erro para o cliente
    }
  });
});

app.get('/pages/recordes-pessoais', (req, res) => {
  connection.query(`SELECT nome, segundos, data FROM usuario INNER JOIN tempo ON usuario.idusuario = tempo.id_usuario WHERE usuario.idusuario = ${req.session.userID} ORDER BY segundos`,
    function (err, rows) {
      if (!err) {

        for (let i = 0; i < rows.length; i++) {
          const dataPedido = moment(rows[i].data).format(
            "DD/MM/YYYY HH:mm:ss"
          );
          rows[i].data = dataPedido;
        }

        const filePath = path.join(__dirname, "pages", "recordes-pessoais.ejs");
        const html = fs.readFileSync(filePath, "utf8");
        const renderedHtml = ejs.render(html, {
          dados: rows,
        })
        res.send(renderedHtml)
      } else {
        console.log(err)
      }
    })
})

app.get("/pages/ranking-geral", (req, res) =>{
  const filePath = path.join(__dirname, "pages", "ranking-geral.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  
  
  res.send(ejs.render(html))
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(3002, () => {
  console.log("Servidor rodando na porta 3002!");
});