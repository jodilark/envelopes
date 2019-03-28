angular.module('billbo').factory('envelopeFactory', envelopeFactory);
function envelopeFactory($q, balances, store, $http, notification){
    var envelopes = store.data.envelopes, $scope, $rootScope;

    class Envelope{
        constructor(envObj){
            this.titleValue = envObj.title;
            this.amountValue = 0.00;
            this.visible = true;
            this.color = {
                r: Math.floor(Math.random() * Math.floor(255)),
                g: Math.floor(Math.random() * Math.floor(255)),
                b: Math.floor(Math.random() * Math.floor(255))
            };
            this.creditRecursionId = null;
            this.debitRecursionId = null;
        }

        formData(){
            return this;
        }
    }

    function createEnvelope(data, form){
        document.getElementById(form).reset();
        return $http({
            url: '/api/createEnvelope'
            , method: 'POST'
            , data: new Envelope(data)
        }).then(response => {
            // console.log("success from server: ", response.data);
            let context = {
                notifyType: 'success',
                notifyText: `${response.data} successfully.`
            };
            notification.resolveNotificationType(context);
            return store.getEnvelopes();
        });
    }

    function updateEnvelope(data){
        var originalMasterBalance,
        valueFrom = Number(data.value.from),
        fromEnvelopeIndex = _.indexOf(envelopes, data.fromEnvelope),
        toEnvelopeIndex = _.indexOf(envelopes, data.toEnvelope),
        newFromBalance = envelopes[fromEnvelopeIndex].amountValue - valueFrom,
        newToBalance;
        if(toEnvelopeIndex > -1){
            newToBalance = envelopes[toEnvelopeIndex].amountValue + valueFrom;
        }
        if(fromEnvelopeIndex === 0){
            balances.update(valueFrom, 'subtract');
            originalMasterBalance = balances.getBalance();
        }
        if(toEnvelopeIndex === 0){
            balances.update(valueFrom, 'add');
            originalMasterBalance = balances.getBalance();
        }
        envelopes[fromEnvelopeIndex].amountValue = newFromBalance;
        if(toEnvelopeIndex > -1){
            envelopes[toEnvelopeIndex].amountValue = newToBalance;
        }
    }
    
    function deleteEnvelope(data){
        function deleteIt(){
            store.getEnvelopes().then(res => {
                var envelopeToDelete = _.find(res.data, function(e){
                    if(e.title_value === data.title_value){
                        return e;
                    }
                });
                if(data.title_value !== 'Master Balance' && res.data.length >= 1){
                    balances.update(envelopeToDelete.amount_value, 'add');
                }
                $http.delete('/api/deleteEnvelope' + '?id=' + envelopeToDelete.id).then(response => {
                    $rootScope.$broadcast('updateEnvelopes');
                    setTimeout(function(){
                        window.location.reload();
                    }, 500)
                });
            });
        }
        let context = {
            notifyType: 'ays',
            notifyText: `Do you really want to delete this envelope?`,
            buttons: [
                {
                    text: 'YES',
                    action: deleteIt
                },
                {
                    text: 'No',
                    action: () => {return}
                }
            ]   
        }
        notification.resolveNotificationType(context);
    }

    function passScope(obj){
        $scope = obj;
        $rootScope = $scope.$root;
    }

    return {
        createEnvelope:createEnvelope,
        updateEnvelope:updateEnvelope,
        deleteEnvelope: deleteEnvelope,
        passScope: passScope
    }

}