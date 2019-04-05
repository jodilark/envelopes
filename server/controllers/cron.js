const request = require('request');
// const _ = require('_');
exports.schedule = (val, measument, fn) => {
    switch(measument){
        case 's':
        val *= 1000;
        break;
        case 'm':
        val *= 60000;
        break;
        default:
        val = null;
        console.log('s, m, h, d, mo cannot equal null')
        break;
    }
    
    this.count = 0;
    // fn();
    this.interve = setInterval(fn,val);
}

// this should be cleaned up and moved to its own controller
exports.doThing = () => {
    let today = new Date().getDate();
    this.count ++;
    request({
        method: 'GET',
        url: 'http://localhost:3000/api/getEnvelopes'
        }, function(error, response, body){
            let rb = JSON.parse(response.body);
            rb.forEach(envelope => {
                if(envelope.lastcreditday !== today){
                    console.log('checking pending credit for: ', envelope.title_value);
                    request.get({
                        url: 'http://localhost:3000/api/todaysCredits'
                        }, function(error, response, body){
                            let rb = JSON.parse(response.body);
                            rb.forEach(credit => {
                                if(envelope.id === credit.envid){
                                    // [FromAccountId, ToAccountId, Amount]
                                    let payload = [credit.fromenvelopeid, credit.envid, credit.amount];
                                    request(
                                        {
                                            method: 'GET',
                                            url: 'http://localhost:3000/api/creditTransfer/?payload=' + payload.toString()
                                        }, function(error, response, body){
                                            console.log('credited: ', envelope.title_value);
                                            //now set last credited day on envelope with todays date
                                            request.get(
                                                {
                                                    method: 'GET',
                                                    url: 'http://localhost:3000/api/updateEnvelopeCreditDay/?id=' + credit.envid
                                                }
                                            );
                                        }
                                    );
                                } else console.log('no credit found for: ', envelope.title_value)
                            });
                        }
                    );
                }
            });
        }
    );

}

exports.justLog = () => {
    console.log('just logging');
}

exports.stop = (scheduleToStop) => {
    this.count = 0;
    clearInterval(this[scheduleToStop]);
    console.log('stopped ', scheduleToStop);
}