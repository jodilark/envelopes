const request = require('request');
// const _ = require('_');
exports.schedule = (val, measument, fn) => {
    switch(measument){
        case 's':
        val *= 1000;
        break;
        default:
        break;
    }
    
    this.count = 0;
    // fn();
    // this.interve = setInterval(fn,val);
}

exports.doThing = () => {
    // let today = new Date().getDate();
    let today = 13;
    this.count ++;
    request.get({
        url: 'http://localhost:3000/api/getEnvelopes'
        }, function(error, response, body){
            let rb = JSON.parse(response.body);
            // console.log('response', rb[0]);
            
        }
    )
}

exports.justLog = () => {
    console.log('just logging');
}

exports.stop = (scheduleToStop) => {
    this.count = 0;
    clearInterval(this[scheduleToStop]);
    console.log('stopped ', scheduleToStop);
}