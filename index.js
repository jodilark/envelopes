const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const app = express();
const config = require('./config')
const port = config.appPort;
const crud = require('./server/controllers/crud.controller');
app.use(express.static('./public'));
app.use(bodyParser.json());

massive({
    host: config.host
    , port: config.dbPort
    , database: config.database
    , user: config.user
    , password: config.password
  }).then(function (db) {
    app.set('db', db),
      console.log('connected to database')
  });

  
app.post('/api/createData', function(req, res){
    res.status(200).send(req.body);
});
app.get('/reset', crud.reset);
app.post('/api/createEnvelope', crud.create);
app.get('/api/envelope', crud.envelope);
app.get('/api/getEnvelopes', crud.getEnvelopes);
app.put('/api/updateEnvelope', crud.updateEnvelope);
app.delete('/api/deleteEnvelope', crud.deleteEnvelope);
  

app.listen(port, function(){
    console.log('listening on port: ', port);
});