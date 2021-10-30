const express = require('express');
const mysql = require('mysql');
const app = express();

//cssを表示
app.use(express.static('public'));


const mysql_setting = {
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b532f54c3bfbd9',
  password: 'e260af2b',
  database: 'heroku_2ecf2fd82b49f90'
}




app.set("view engine", "ejs");

app.get('/', (req, res) => {
  const connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('SELECT * FROM items',
    (error, results) => {
      if (error) throw error;
      res.render('index.ejs', { items: results}); //オブジェクトを渡す
    }
  );

  connection.end();
});

//フォームの値を受け取るために必要な典型文
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//INSERTした後に`/`（一覧画面）にリダイレクトする
app.post('/create', (req, res, next) => {
  var getName = req.body.name;
  var getStock = req.body.stock;
  var getLastDay = req.body.lastDay;

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();  

  connection.query(
    'INSERT INTO items (name, stock, lastDay, aorb) VALUES ("' + getName + '", "' + getStock + '", "' + getLastDay + '","a")',
    (error, results) => {
      res.redirect('/'); //URLを指定してリダイレクトする
      console.log(error);
    }
  );
  connection.end();
});

//caseBに保存する
app.post('/create2', (req, res, next) => {
  var getName = req.body.name;
  var getStock = req.body.stock;
  var getLastDay = req.body.lastDay;

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();

  
  connection.query(
    'INSERT INTO items (name, stock, lastDay, aorb) VALUES ("' + getName + '", "' + getStock + '", "' + getLastDay + '","b")',
    (error, results) => {
      res.redirect('/'); //URLを指定してリダイレクトする
      console.log(error);
    }
    );
    connection.end();
});

app.post('/delete', (req, res, next) => {
  const id = req.body.id;

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();

  
  connection.query('DELETE FROM items WHERE id=?', id, function (error, results, fields) {
    if (error) throw error;
    res.redirect('./');
  });
  connection.end();
});

//localhost:3000/edit
app.get('/edit', function (req, res, next) {

  const id = req.query.id;

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  
  connection.query('SELECT * FROM items WHERE id=?', id, function (error, results, fields) {
    if (error) throw error;
    
    if (!results.length) {
      res.redirect('../');
    } else {
      const data = {
        id: id,
        name: results[0].name,
        stock: results[0].stock,
        lastDay: results[0].lastDay,
        errorMessage: ''
      };
      res.render('edit', {edit: data});
    }
    
  });
  connection.end();
});
 
//localhost:3000/editへのPOST
app.post('/edit', (req, res, next) => {
 
    const id = req.body.id;
    const name = req.body.name;
    const lastDay = req.body.lastDay;
    const stock = req.body.stock;
 
    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
  
    
    connection.query('UPDATE items SET name = ?, lastDay = ?, stock = ? WHERE id = ?', [ name, lastDay, stock, id], function (error, results, fields) {
      if (error) throw error;
      res.redirect('../')
    });
    connection.end();
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on ${port}`)
});