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
                data.uniqueId = 1;
                return $http.get('/reset').then(response => {
                    envSetter();
                }).catch(err => console.log(err));
                    
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

            function createHistory(data){
                return $http.post('/api/createHistory', data);
            }

            function getHistory(id){
                if(id){
                    return $http.get('/api/getHistory?id=' + id);
                } else{
                    return $http.get('/api/getHistory');
                }
            }

            function deleteHistory(id){
                return $http.delete('/api/deleteHistory?id=' + id);
            }

            function createCredit (transPayload, envelope) {
                return $http.post('/api/createCredit', transPayload);
            }

            function createDebit (transPayload, envelope) {
                return $http.post('/api/createDebit', transPayload);
            }

            function getCredits (){
                return $http.get('/api/credits');
            }

            function getDebits (){
                return $http.get('/api/debits');
            }

            function getCreditsByEnvId (id){
                return $http.get('/api/getCreditsByEnvId/?id=' + id);
            }
          
            function getDebitsByEnvId (id){
                return $http.get('/api/getDebitsByEnvId/?id=' + id);
            }

            function deleteCreditById (id) {
                return $http.delete('/api/deleteCredit/?id=' + id);
            }

            function deleteDebitById (id) {
                return $http.delete('/api/deleteDebit/?id=' + id);
            }

            return {
                data: data,
                resetAll:resetAll,
                createData:createData,
                getEnvelopes:getEnvelopes,
                updateEnvelope:updateEnvelope,
                transferBalance:transferBalance,
                createHistory:createHistory,
                getHistory:getHistory,
                deleteHistory:deleteHistory,
                createCredit:createCredit,
                getCredits:getCredits,
                getCreditsByEnvId:getCreditsByEnvId,
                deleteCreditById:deleteCreditById,
                createDebit:createDebit,
                getDebitsByEnvId:getDebitsByEnvId,
                getDebits:getDebits,
                deleteDebitById:deleteDebitById
            }
        }
    }
}