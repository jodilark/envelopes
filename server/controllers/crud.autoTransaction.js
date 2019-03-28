exports.createCredit = (req, res) => {
    req.app.get('db').autoCreditCreate(req)
}
exports.getCredit = (req, res) => {

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
