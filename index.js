const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const app = express();
const config = require('./config')
const port = config.appPort;
const crud = require('./server/controllers/crud.controller');
const history = require('./server/controllers/crud.history.controller');
const features = require('./features');
const autoTransaction = require('./server/controllers/crud.autoTransaction');
const cron = require('./server/controllers/cron');
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

//ENVELOPES
app.get('/reset', crud.reset);
app.post('/api/createEnvelope', crud.create);
app.get('/api/envelope', crud.envelope);
app.get('/api/getEnvelopes', crud.getEnvelopes);
app.put('/api/updateEnvelope', crud.updateEnvelope);
app.put('/api/transferBalance', crud.transferBalance);
app.delete('/api/deleteEnvelope', crud.deleteEnvelope);

//AUTOTRANSACTION CREDIT
app.post('/api/createCredit', autoTransaction.createCredit);
app.get('/api/credits', autoTransaction.credits);

//HISTORY
app.get('/api/getHistory', history.getHistory);
app.post('/api/createHistory', history.addHistoryRow);
app.delete('/api/deleteHistory', history.deleteHistoryById);

//features
app.get('/features', (req, res) => res.status(200).send(features));

//cron
/*
s = seconds,
m = minutes,
h = hours,
d = days,
mo = months,
*/
cron.schedule(10, 's', autoTransaction.checkEnvelopesForCredits, 'autoCredit');
setTimeout(function(){
  cron.stop('autoCredit')
}, 30000);

/////////////////////////////////////////////////////////////////
// this should run every day to update the date on the envelopes
app.put('/api/setTodayOnEnvelopes', autoTransaction.setTodayOnEnvelopes);
app.get('/api/todaysCredits', autoTransaction.todaysCredits);
app.get('/api/creditTransfer', crud.transferBalance);
app.get('/api/updateEnvelopeCreditDay', autoTransaction.updateEnvelopeCreditDay);





app.listen(port, function(){
    console.log('listening on port: ', port);
    return "0.0.0.0";
});