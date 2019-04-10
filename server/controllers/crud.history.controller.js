//CREATE
exports.addHistoryRow = (req, res) => {
    if(req.query && req.query.payload){
        req.body = JSON.parse(req.query.payload);
    }

    let lineItem = [
        req.body.from_title,
        req.body.description,
        req.body.amount,
        req.body.date
    ]
    req.app.get('db').historyCreateRow(lineItem).then(() => {
        req.app.get('db').historyGet().then(response => {
            res.status(200).send(response);
        });
    });
};
//READ
exports.getHistory = (req, res) => {
    if(req.query.id){
        req.app.get('db').historyGetById(req.query.id).then(response => res.status(200).send(response));
    } else {
        req.app.get('db').historyGet().then(response => res.status(200).send(response));
    }
};
//DELETE
exports.deleteHistoryById = (req, res) => {
    req.app.get('db').historyDeleteById(req.query.id).then(response => res.status(200).send('event in history was erased'));
};
