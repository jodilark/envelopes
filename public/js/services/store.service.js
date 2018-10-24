angular.module('billbo').service('store', store);
function store($q, $http){
    var data = {history:[], envelopes:[], masterBalance: 2000, uniqueId: 1};
    function resetAll(){
        data.history.length = 0;
        data.envelopes.length = 0;
        data.masterBalance = 2000;
        data.uniqueId = 1;
        return $q.resolve();
    }

    function createData(data){
        return $http.post('/api/createData', data);
    }
    return {
        data: data,
        resetAll:resetAll,
        createData:createData
    }
}