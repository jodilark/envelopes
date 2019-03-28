exports.createCredit = (req, res) => {
    let rb = req.body
    var thing = [rb.envelopeid, rb.amount, rb.dayofmonth, rb.description];
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
