angular.module('billbo').component('transferModal', {
    templateUrl: '../public/js/components/transfer/transferModal.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances){
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
         $scope.formId = 'fTransfer';
         $scope[$scope.formId] = {fromEnvelope:null, toEnvelope:null, value:{from:null}};
         $scope.fromEnvelope = $scope[$scope.formId].fromEnvelope;
         $scope.toEnvelope = $scope[$scope.formId].toEnvelope;
         $scope.fromFValue = $scope[$scope.formId].value.from;
         // end

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'transferModal');
        }
        $scope.onChange = function(){
            $scope.toEnvelopes = from.filter(function(e, i, arr){
                if(e.titleValue !== $scope.fromEnvelope.titleValue){
                    return e
                }
            })
        };
        // html template condensing code
        $scope.setTo = function(toEnvelope){
            $scope[$scope.formId].toEnvelope = toEnvelope;
        }
        // end

        $scope.submit = function(){
            // html template condensing code
            $scope[$scope.formId].value = {from: $scope.fromFValue};
            $scope[$scope.formId].fromEnvelope = $scope.fromEnvelope;
            // end
            envelopeFactory.updateEnvelope($scope[$scope.formId]);
            envelopeFactory.getEnvelopes().then(function(res){
                $scope.envelopes = res;
                $scope.toEnvelopes = res;
                $scope.closeModal();
            })
        }
    }
})