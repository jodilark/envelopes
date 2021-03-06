const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const app = express();
const config = require('./config');
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
d = days
*/
var currentMinute, dailyCronStarted;
(function startCron () {
  checkForNewDay();
  dailyCronStarted = setInterval(function(){
    currentMinute = new Date().getMinutes();
    // console.log(currentMinute); // for debugging
    setTimeout(function(){
      checkForNewDay();
    }, 10000);
  }, 60000);
})();

function checkForNewDay () {
  let currentHour = new Date().getHours();
  if(currentHour === 1 && currentMinute === 0){
    runDailyCrons();
  }
}

function runDailyCrons () {
  console.log('starting daily crons');
  clearInterval(dailyCronStarted);
  cron.schedule(24, 'h', autoTransaction.intSetTodayOnEnvelopes, 'setEnvelopeDay');
  dailyCronStarted = null;
}

//////////////
// CRON JOBS
setTimeout(function() {
  autoTransaction.intSetTodayOnEnvelopes()
},5000);
setTimeout(function() {
  cron.schedule(1, 'h', autoTransaction.checkEnvelopesForCredits, 'autoCredit');
}, 1000);
setTimeout(function(){
  cron.schedule(1, 'h', autoTransaction.checkEnvelopesForDebits, 'autoDebit');
},2000);

//AUTOTRANSACTION CREDIT
app.post('/api/createCredit', autoTransaction.createCredit);
app.get('/api/credits', autoTransaction.credits);
app.get('/api/todaysCredits', autoTransaction.todaysCredits);
app.get('/api/creditTransfer', crud.transferBalance);
app.get('/api/getCreditsByEnvId', autoTransaction.getCreditsByEnvId);
app.delete('/api/deleteCredit', autoTransaction.deleteCredit);

/////////////////////////////////////////////////////////////////
// this should run every day to update the date on the envelopes
app.put('/api/setTodayOnEnvelopes', autoTransaction.setTodayOnEnvelopes);
app.get('/api/updateEnvelopeCreditDay', autoTransaction.updateEnvelopeCreditDay);
app.get('/api/updateEnvelopeDebitDay', autoTransaction.updateEnvelopeDebitDay);

//AUTOTRANSACTION DEBIT
app.post('/api/createDebit', autoTransaction.createDebit);
app.get('/api/debits', autoTransaction.debits);
app.get('/api/getDebitsByEnvId', autoTransaction.getDebitsByEnvId);
app.delete('/api/deleteDebit', autoTransaction.deleteDebit);
app.get('/api/todaysDebits', autoTransaction.todaysDebits);
app.get('/api/debitPurchase', autoTransaction.debitPurchase);

//temporary
app.get('/api/temporary', autoTransaction.checkEnvelopesForDebits);



app.listen(port, function(){
    console.log('listening on port: ', port);
    return "0.0.0.0";
});