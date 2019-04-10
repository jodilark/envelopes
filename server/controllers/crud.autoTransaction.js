const request = require('request');
const _ = require('lodash');
const config = require('../../config');
const port = config.appPort;

///////////////////////////////
// CREDIT SETUP AND MANAGEMENT
exports.createCredit = (req, res) => {
    let rb = req.body
    var payload = [rb.envelopeid, rb.amount, rb.dayofmonth, rb.description, rb.fromEnvelopeid];
    req.app.get('db').autoCreditCreate(payload).then(response => {
        res.status(200).send(response);
    });
}
exports.credits = (req, res) => {
    req.app.get('db').autoCreditGetAll().then(response => {
        res.status(200).send(response);
    });
}
exports.deleteCredit = (req, res) => {
    let id = req.query.id;
    req.app.get('db').autoCreditDelete(id).then(remainingCredits => {
        res.status(200).send(remainingCredits);
    });
}

exports.getCreditsByEnvId = (req, res) => {
    let id = req.query.id;
    req.app.get('db').autoCreditGetByEnvId(id).then(credits => {
        res.status(200).send(credits);
    });
};

///////////////////////////////
// DEBIT SETUP AND MANAGEMENT
exports.createDebit = (req, res) => {
    let rb = req.body
    var payload = [rb.envelopeid, rb.amount, rb.dayofmonth, rb.description];
    req.app.get('db').autoDebitCreate(payload).then(response => {
        res.status(200).send(response);
    });
};
exports.getDebitsByEnvId = (req, res) => {
    let id = req.query.id;
    req.app.get('db').autoDebitGetByEnvId(id).then(debits => {
        res.status(200).send(debits);
    });
};
exports.debits = (req, res) => {
    req.app.get('db').autoDebitGetAll().then(response => {
        res.status(200).send(response);
    });
};
exports.deleteDebit = (req, res) => {
    let id = req.query.id;
    req.app.get('db').autoDebitDelete(id).then(remainingDebits => {
        res.status(200).send(remainingDebits);
    });
}

////////////////////////////
// auto transaction methods
exports.setTodayOnEnvelopes = (req, res) => { //external
    console.log('setting today on envelopes');
    let today = new Date().getDate();
    req.app.get('db').setTodayOnEnvelopes(today).then(response => {
      res.status(200).send(response)
    })
}
exports.intSetTodayOnEnvelopes = (req, res) => { //internal
    request({
        method: 'PUT',
        url: 'http://localhost:' + port + '/api/setTodayOnEnvelopes'
    });
}

//////////////////////////////////////////////
// auto credit transaction related methods
exports.todaysCredits = (req, res) => {
    req.app.get('db').autoCreditEnvelopeJoin().then(credits => {
        res.status(200).send(credits);
    });
}
exports.updateEnvelopeCreditDay = (req, res) => {
    let today = new Date().getDate();
    req.app.get('db').updateEnvelopeCredited(req.query.id, today).then(updated => {
      console.log('envelope updated: ', updated);
      res.status(200).send(updated);
    });
}

exports.checkEnvelopesForCredits = () => {
    let today = new Date().getDate();

    function checkForPendingCredit(envelopeList){
        envelopeList.forEach(envelope => {
            // purpose for lastcreditday is to check if we have already applied the credit for this month.
            if(envelope.lastcreditday !== today && envelope.title_value !== 'Master Balance'){
                console.log('checking pending credit for: ', envelope.title_value);
                request.get({
                    url: 'http://localhost:' + port + '/api/todaysCredits'
                    }, function(error, response, body){
                        let rb = JSON.parse(response.body);
                        if(rb.length >= 1){
                            checkTodaysCredits(envelope, rb);
                        } else console.log('no credit found for: ', envelope.title_value)
                    }
                );
            }
        });
    }

    function checkTodaysCredits(envelope, creditsList){
        creditsList.forEach(credit => {
            if(envelope.id === credit.envid && envelope.title_value !== 'Master Balance'){
                // payload should be: [FromAccountId, ToAccountId, Amount]
                let payload = [credit.fromenvelopeid, credit.envid, credit.amount];
                request(
                    {
                        method: 'GET',
                        url: 'http://localhost:' + port + '/api/creditTransfer/?payload=' + payload.toString()
                    }, function(error, response, body){
                        console.log('credited: ', envelope.title_value);
                        //now set last credited day on envelope with todays date
                        setLastCreditedDay(credit.envid);
                        
                    }
                );
            } else console.log('no credit found for: ', envelope.title_value)
        });
    }

    function setLastCreditedDay(envelopeId){
        request.get(
            {
                method: 'GET',
                url: 'http://localhost:' + port + '/api/updateEnvelopeCreditDay/?id=' + envelopeId
            }
        );
    }

    request({
        method: 'GET',
        url: 'http://localhost:' + port + '/api/getEnvelopes'
        }, function(error, response, body){
            let rb = JSON.parse(response.body);
            checkForPendingCredit(rb);
        }
    );

}

//////////////////////////////////////////////
// auto debit transaction related methods
exports.todaysDebits = (req, res) => {
    req.app.get('db').autoDebitEnvelopeJoin().then(debits => {
        res.status(200).send(debits);
    });
}
exports.updateEnvelopeDebitDay = (req, res) => {
    let today = new Date().getDate();
    req.app.get('db').updateEnvelopeDebited(req.query.id, today).then(updated => {
      console.log('envelope updated: ', updated);
      res.status(200).send(updated);
    });
}
exports.debitPurchase = (req, res) => {
    req.body = JSON.parse(req.query.payload);

    let  historyObj = JSON.stringify({
            "from_title": req.body.env.title_value,
            "description": req.body.dbt.description,
            "amount": req.body.dbt.amount,
            "date": new Date()
        });     

    req.body.env.amountValue = Number(req.body.env.amount_value) - Number(req.body.dbt.amount);
    req.body.env.lastDebitDay = new Date().getDate(); // uncomment when ready to go
    let envData = JSON.stringify(req.body.env);

    return request(
        {
            method: 'POST',
            url: 'http://localhost:' + port + '/api/createHistory/?payload=' + historyObj
        }, function(error, response, body){
            return request(
                {
                    method: 'PUT',
                    url: 'http://localhost:' + port + '/api/updateEnvelope?payload=' + envData
                }, function(error, response, body){
                    return body;
                }
            );
        }
    );
};

exports.checkEnvelopesForDebits = () => {
    let today = new Date().getDate();

    function checkForPendingDebit(envelopeList){
        envelopeList.forEach(envelope => {
            // purpose for lastdebitday is to check if we have already applied the debit for this month.
            if(envelope.lastdebitday !== today && envelope.title_value !== 'Master Balance'){
                console.log('checking pending debit for: ', envelope.title_value);
                return request.get({
                    url: 'http://localhost:' + port + '/api/todaysDebits'
                    }, function(error, response, body){
                        let rb = JSON.parse(response.body);
                        if(rb.length >= 1){
                            return checkTodaysDebits(envelope, rb);
                        } else console.log('no debit found for today: ', envelope.title_value)
                    }
                );
            }
        });
    }

    function checkTodaysDebits(debitEnvelope, debitsList){
        debitsList.forEach(debit => {
            if(debitEnvelope.id === debit.envid){
                let payload = JSON.stringify({
                    env: debitEnvelope,
                    dbt: debit
                });
                return request(
                    {
                        method: 'GET',
                        url: 'http://localhost:' + port + '/api/debitPurchase/?payload=' + payload
                    }, function(error, response, body){
                        console.log('debited: ', debitEnvelope.title_value);
                        return
                    }
                );
            } else {
                if(debitEnvelope.title_value !== 'Master Balance'){
                    return console.log('no debit found: ', debitEnvelope.title_value)
                }
            }
        });
    }

    request({
        method: 'GET',
        url: 'http://localhost:' + port + '/api/getEnvelopes'
        }, function(error, response, body){
            let rb = JSON.parse(response.body);
            checkForPendingDebit(rb);
        }
    );

}
