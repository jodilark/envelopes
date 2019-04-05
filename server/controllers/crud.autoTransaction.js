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

}
exports.createDebit = (req, res) => {
    req.app.get('db').autoDebitCreate(req)
}
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
