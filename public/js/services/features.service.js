angular.module('billbo').service('features', features);
function features($http, config){
    $http.get('/features').then(res => {
        for(let key in res.data){
            config[key] = res.data[key];
        }
        config.features = vm;
        console.log(config)
    });
    return this
};