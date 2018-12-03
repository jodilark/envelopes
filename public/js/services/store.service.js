angular.module('billbo').provider('store', store);
function store(){
    return {
        $get: function($http, $rootScope){
            var data = {history:[], uniqueId: 1};
            var envSetter = () => getEnvelopes().then(res => {
                data.envelopes = res.data;
                let master = _.find(data.envelopes, {id:1});
                data.masterBalance = Number(master.amount_value);
                $rootScope.$broadcast('updateDom');
            });
            envSetter();

            function resetAll(){
                data.history.length = 0;
                data.envelopes.length = 0;
                data.masterBalance = 2000;
                data.uniqueId = 1;
                return $http.get('/reset');
            }
        
            function getEnvelopes(){
                return $http.get('/api/getEnvelopes');
            }            

            function updateEnvelope(id, newObj){
                return $http({
                    url: '/api/updateEnvelope?id=' + id,
                    method: 'PUT',
                    data: newObj
                }).then(response => envSetter());
            }

            function transferBalance(from, to, amount){
                return $http({
                    url: '/api/TransferBalance',
                    method: 'PUT',
                    data: [from, to, amount]
                }).then(response => envSetter());
            }
        
            function createData(data){
                return $http.post('/api/createData', data);
            }
            return {
                data: data,
                resetAll:resetAll,
                createData:createData,
                getEnvelopes:getEnvelopes,
                updateEnvelope:updateEnvelope,
                transferBalance:transferBalance
            }
        }
    }
}