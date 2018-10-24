const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const port = 3000;
const app = express();

app.use(express.static('./public'));

app.use(bodyParser.json());

app.listen(port, function(){
    console.log('listening on port: ', port);
});