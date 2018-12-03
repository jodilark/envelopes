angular.module('billbo').component('transferModal', {
    templateUrl: '../js/components/transfer/transferModal.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances, store){
        var from;
        store.getEnvelopes().then(function(res){
            $scope.envelopes = res.data.filter(function(e, i){
                if(Number(e.amount_value) > 0){
                    if(typeof e.amount_value !== 'number'){
                        e.amount_value = Number(e.amount_value);
                    }
                    return e;
                }
            });
            from = res.data;
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
                if(e.title_value !== $scope.fromEnvelope.title_value){
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
            let from = $scope.fromEnvelope.id, 
                to = $scope[$scope.formId].toEnvelope.id, 
                amount = Number($scope.fromFValue);
            // [FromAccountId, ToAccountId, Amount]
            store.transferBalance(from, to, amount).then(response => $scope.closeModal());
        }
    }
})