angular.module('billbo').service('features', features);
function features($http){
    var vm = this;
    $http.get('/features').then(res => {
        for(let key in res.data){
            vm[key] = res.data[key];
        }
    });
    // Used to run operations based on features from main controller
    vm.configurator = function(){
        switch(true){
            case(vm.fillUp):
            console.log('fillup is enabled');
            break;
            default:
            break;
        }
    }
    return this
};