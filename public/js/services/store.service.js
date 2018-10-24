angular.module('billbo').service('store', store);
function store($q){
    var data = {history:[], envelopes:[], masterBalance: 2000, uniqueId: 1};
    function resetAll(){
        data.history.length = 0;
        data.envelopes.length = 0;
        data.masterBalance = 2000;
        data.uniqueId = 1;
        return $q.resolve();
    }
    return {
        data: data,
        resetAll:resetAll
    }
}