angular.module('billbo').component('makePurchaseModal', {
    templateUrl: '../js/components/purchase/makePurchaseModal.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances, store){
        var from;
        envelopeFactory.getEnvelopes().then(function(res){
            if(!res.amountValue){
                res.amountValue = '0.00';
            } else if(res.amountValue === '0.00') {
                res.amountValue = Number(res.amountValue);
            }
            
            if(res[0].titleValue !== 'Master Balance'){
                res.unshift({ titleValue: 'Master Balance', amountValue: balances.getBalance()});
            } else {
                res[0].amountValue = balances.getBalance();
            }
            $scope.envelopes = res.filter(function(e, i){
                if(e.amountValue){
                    return e;
                }
            });
            from = res;
        });
   
        // html template condensing code
        $scope.formId = 'purchTransfer';
        $scope[$scope.formId] = {fromEnvelope:null, value:{from:null}, history:null};
        $scope.fromEnvelope = $scope[$scope.formId].fromEnvelope;
        $scope.fromFValue = $scope[$scope.formId].value.from;
        $scope.info = $scope[$scope.formId].history;
        // end

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'makePurchase');
        }
  
        $scope.submit = function(){
            // html template condensing code
            $scope[$scope.formId].value = {from: $scope.fromFValue};
            $scope[$scope.formId].fromEnvelope = $scope.fromEnvelope;
            $scope[$scope.formId].history = $scope.info;
            // stop
            let lineId = store.data.uniqueId++;
            let dateString = new Date();
            store.data.history.push({
                "Line": lineId,
                "Description": $scope.info,
                "Amount": $scope.fromFValue,
                "From": $scope.fromEnvelope.titleValue,
                "Date": dateString.toString()
            });
            $scope.$root.$broadcast('updateStore');
            envelopeFactory.updateEnvelope($scope[$scope.formId]);
            envelopeFactory.getEnvelopes().then(function(res){
                $scope.envelopes = res;
                $scope.toEnvelopes = res;
                $scope.closeModal();
            })
        }
    }
})