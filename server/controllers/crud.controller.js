
exports.reset = (req, res) => req.app.get('db').initDb().then((response) => res.send('db has been reset'));
// CREATE
exports.create = (req, res) => {
    let rb = req.body;
    req.app.get('db').envelopeGetAll().then(response => {
        let exists = response.filter((e, i) => {
            if(e.title_value === rb.titleValue) return e;
        });
        if(exists.length > 0){
            res.status(400).send('envelope already exists');
        } else {
            let env = [
                rb.titleValue, 
                rb.amountValue, 
                rb.visible,
                rb.color.r,
                rb.color.g,
                rb.color.b
            ];
            if(rb.color.r > 255 || rb.color.g > 255 || rb.color.b > 255){
                res.status(400).send('color value cannot be greater than 255');
            } else req.app.get('db').envelopeCreate(env).then(envelope => {
                res.status(200).send(`${env[0]} was created`)
            }).catch(err => res.status(400).send('there was an error creating the envelope'));
        }
    }).catch(err => res.status(400).send('there was an error getting the envelope list'));
};
// READ
exports.envelope = (req, res) => {
    let rq = req.query;
    req.app.get('db').envelopeGet(rq.id).then(response => res.status(200).send(response[0])).catch(err => res.status(400).send('there was an error getting this envelope'));
}
exports.getEnvelopes = (req, res) => req.app.get('db').envelopeGetAll().then(response => res.status(200).send(response)).catch(err => res.status(400).send('there was an error getting the envelope list'));
// UPDATE
exports.updateEnvelope = (req, res) => {
    let rq = req.query, rb = req.body;
    req.app.get('db').envelopeGet(rq.id).then(response => {
        let env = response[0],
        upEnv = [
            rq.id,
            titleValue = (rb.titleValue === env.title_value || !rb.titleValue ? env.title_value : rb.titleValue), 
            amountValue = (rb.amountValue === env.amount_value || !rb.amountValue ? env.amount_value: rb.amountValue),
            visibility = (rb.visibility === env.visible || !rb.visibility ? env.visible: rb.visibility),
            color_r = (rb.color_r === env.color_r || !rb.color_r ? env.color_r: rb.color_r),
            color_g = (rb.color_g === env.color_g || !rb.color_g ? env.color_g: rb.color_g),
            color_b = (rb.color_b === env.color_b || !rb.color_b ? env.color_b: rb.color_b) 
        ];
        if(rb.color_r > 255 || rb.color_g > 255 || rb.color_b > 255){
            res.status(400).send('color_r value cannot be greater than 255');
        } else req.app.get('db').envelopeUpdate(upEnv).then(response => res.status(200).send(`Envelope ${upEnv[1]} was updated successfully`)).catch(err => res.status(400).send(`there was an error updating ${env[0]}: ${env[1]}, ${err}`));
    }).catch(err => res.status(400).send(`there was an error getting this envelope ${err}`));
};
// DELETE
exports.deleteEnvelope = (req, res) => {
    if(!req.query.id) return res.status(404).send(`you didn't specify an id of the envelope to delete.`);
    req.app.get('db').envelopeDelete(req.query.id).then(response => res.status(200).send(`Envelope ${req.query.id} was deleted.`)).catch(err => res.status(400).send(`Failed to delete envelope ${req.query.id}`));
};