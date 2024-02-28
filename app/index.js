const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'db', 
    port: '3306', 
    user: 'root',
    password: 'root',
    database: 'appdb'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log('Consultando nomes...');
    connection.query('SELECT name FROM people', (error, results, fields) => {
      if (error) {
          console.error('Erro ao executar a consulta:', error);
          res.status(500).send('Erro ao buscar dados no banco de dados');
          return;
      }

      const names = results.map(result => result.name);
      const listNames = names.map(name => `<li>${name}</li>`).join('')

      const htmlStart = 
        `<html>
          <title>Full Cycle Rocks :: Desafio Docker</title>
          <body>`

        const htmlEnd = 
        ` </body>
        </html>`  

      const bodyTitle = `<h1>Full Cycle Rocks!</h1>`      
      const bodyForm = `
      <form method="post" action="/add">
          <label for="name">Nome:</label>
          <input type="text" id="name" name="name" required>
          <button type="submit">Adicionar</button>
      </form>`
      const bodyListNames = `<h4>Nomes Cadastrados:</h4><i>${listNames}</i>`
      const bodyResponse = `${htmlStart}${bodyTitle}${bodyForm}${bodyListNames}${htmlEnd}`
      
      res.send(bodyResponse);
    });
  
})

app.post('/add', (req, res) => {
  const { name } = req.body;
  
  // Verifica se o nome foi enviado
  if (!name || name.trim() == '') {
      res.status(400).send('Nome não especificado');
      return;
  }

  connection.query('INSERT INTO people (name) VALUES (?)', [name], (error, results, fields) => {
      if (error) {
          console.error('Erro ao inserir o nome no banco de dados:', error);
          res.status(500).send('Erro ao adicionar o nome no banco de dados');
          return;
      }
      console.log('Nome adicionado ao banco de dados:', name);
      res.redirect('/');
  });
});

app.listen(port, () => {
    console.log('Rodando na porta:', port)
})