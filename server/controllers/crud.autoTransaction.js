const request = require('request');

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

//////////////////////////////////////////////
// auto credit transaction related methods
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
        url: 'http://localhost:3000/api/setTodayOnEnvelopes'
    });
}
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
    this.count ++;

    function checkForPendingCredit(envelopeList){
        envelopeList.forEach(envelope => {
            // purpose for lastcreditday is to check if we have already applied the credit for this month.
            if(envelope.lastcreditday !== today){
                console.log('checking pending credit for: ', envelope.title_value);
                request.get({
                    url: 'http://localhost:3000/api/todaysCredits'
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
            if(envelope.id === credit.envid){
                // payload should be: [FromAccountId, ToAccountId, Amount]
                let payload = [credit.fromenvelopeid, credit.envid, credit.amount];
                request(
                    {
                        method: 'GET',
                        url: 'http://localhost:3000/api/creditTransfer/?payload=' + payload.toString()
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
                url: 'http://localhost:3000/api/updateEnvelopeCreditDay/?id=' + envelopeId
            }
        );
    }

    request({
        method: 'GET',
        url: 'http://localhost:3000/api/getEnvelopes'
        }, function(error, response, body){
            let rb = JSON.parse(response.body);
            checkForPendingCredit(rb);
        }
    );

}
