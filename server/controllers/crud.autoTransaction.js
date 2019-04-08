const request = require('request');

exports.createCredit = (req, res) => {
    let rb = req.body
    var thing = [rb.envelopeid, rb.amount, rb.dayofmonth, rb.description, rb.fromEnvelopeid];
    req.app.get('db').autoCreditCreate(thing).then(response => {
        res.status(200).send(response);
    });
}
exports.credits = (req, res) => {
    req.app.get('db').autoCreditGetAll().then(response => {
        res.status(200).send(response);
    });
}
exports.updateCredit = (req, res) => {

}
exports.deleteCredit = (req, res) => {
    let id = req.query.id;
    req.app.get('db').autoCreditDelete(id).then(remainingCredits => {
        res.status(200).send(remainingCredits);
    });
}
exports.createDebit = (req, res) => {
    req.app.get('db').autoDebitCreate(req)
}

exports.getCreditsByEnvId = (req, res) => {
    let id = req.query.id;
    req.app.get('db').autoCreditGetByEnvId(id).then(credits => {
        res.status(200).send(credits);
    });
};

exports.getDebit = (req, res) => {

}
exports.updateDebit = (req, res) => {

}
exports.deleteDebit = (req, res) => {

}

//////////////////////////////////////////////
// auto credit transaction related methods
exports.setTodayOnEnvelopes = (req, res) => {
    let today = new Date().getDate();
    req.app.get('db').setTodayOnEnvelopes(today).then(response => {
      res.status(200).send(response)
    })
}
exports.todaysCredits = (req, res) => {
    req.app.get('db').autoCreditEnvelopeJoin().then(credits => {
        res.status(200).send(credits);
    });
}
exports.updateEnvelopeCreditDay = (req, res) => {
    let today = new Date().getDate();
    // let today = null;
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
            if(envelope.lastcreditday !== today){
                console.log('checking pending credit for: ', envelope.title_value);
                request.get({
                    url: 'http://localhost:3000/api/todaysCredits'
                    }, function(error, response, body){
                        let rb = JSON.parse(response.body);
                        checkTodaysCredits(envelope, rb);
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
