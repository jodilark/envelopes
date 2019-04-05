exports.schedule = (val, measument, fn, jobName) => {
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
    
    // See if job already exists. If it doesn't, start it after 5 seconds.
    if(!this[jobName]){
        setTimeout(function(){
            fn();
        }, 5000);
    }

    this[jobName] = setInterval(fn,val);
}

exports.justLog = () => {
    console.log('just logging');
}

exports.stop = (scheduleToStop) => {
    this.count = 0;
    clearInterval(this[scheduleToStop]);
    console.log('stopped ', scheduleToStop);
}