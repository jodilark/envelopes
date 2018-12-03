angular.module('billbo').component('makePurchaseModal', {
    templateUrl: '../js/components/purchase/makePurchaseModal.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances, store){
        store.getEnvelopes().then(function(res){
            $scope.envelopes = res.data.filter(function(e, i){
                if(Number(e.amount_value) > 0){
                    if(typeof e.amount_value !== 'number'){
                        e.amount_value = Number(e.amount_value);
                    }
                    return e;
                }
            });
            
            // html template condensing code
            $scope.formId = 'makePurchase';
            $scope[$scope.formId] = {fromEnvelope:null, value:{from:null}};
            $scope.fromEnvelope = $scope[$scope.formId].fromEnvelope;
            $scope.fromFValue = $scope[$scope.formId].value.from;
            // end
        });

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'makePurchase');
        }
        
        $scope.submit = function(){
            let historyObj = {
                "from_title": $scope.fromEnvelope.title_value,
                "description": $scope.description,
                "amount": Number($scope.fromFValue),
                "date": new Date()
            };     
            store.createHistory(historyObj).then(response => {
                store.updateEnvelope($scope.fromEnvelope.id, {amountValue: ($scope.fromEnvelope.amount_value - $scope.fromFValue)}).then(() => {
                    $scope.$root.$broadcast('updateHistory');
                    $scope.closeModal();
                });
            });
        }
    }
})