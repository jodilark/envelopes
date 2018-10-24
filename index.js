const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const port = 3000;
const app = express();
const config = require('./config')

app.use(express.static('./public'));
app.use(bodyParser.json());

// massive({
//     host: config.host
//     , port: 5432
//     , database: config.database
//     , user: config.user
//     , password: config.password
//   }).then(function (db) {
//     app.set('db', db),
//       console.log('connected to database')
//   });

app.post('/api/createData', function(req, res){
    res.status(200).send(req.body);
});
  

app.listen(port, function(){
    console.log('listening on port: ', port);
});