angular.module('billbo').component('envActionModal', {
    bindings: {
        originEnvelope: '<',
        type: '<'
    },
    templateUrl: '../js/components/dynamicEnvActionModal/env.action.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances, store){
        $scope.formId = 'envActionModal';
        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'envActionModal');
        }
        ////////////////////////////////
        // Need watch to read bindings
        $scope.$watch($scope.vm.type, () => {
            setupModal();
        });

        function setupModal(){
            switch($scope.vm.type){
                case 'addFunds':
                /////////////////////
                // Get Envelope List
                store.getEnvelopes().then(function(res){
                    $scope.fromEnvelopes = res.data.filter(function(e, i, arr){
                        if(e.title_value !== $scope.vm.originEnvelope.title_value){
                            return e
                        }
                    });
                });
                break;
                case 'purchase':
                $scope.purchase = true;
                break;
            }
        }

        $scope.setFrom = function(fromEnvelope){
            $scope[$scope.formId].fromEnvelope = fromEnvelope;
        }

        $scope.submit = function(){
            let from = $scope.vm.originEnvelope.id, 
            to = $scope[$scope.formId].fromEnvelope ? $scope[$scope.formId].fromEnvelope.id : null, 
            amount = Number($scope[$scope.formId].amount.$viewValue);
            
            // [FromAccountId (original), ToAccountId (selected), Amount] backwards from how it was originally used.
            if(to){
                store.transferBalance(to, from, amount).then(response => $scope.closeModal());
            } else {
                let description = $scope[$scope.formId].description.$viewValue,
                    historyObj = {
                        "from_title": $scope.vm.originEnvelope.title_value,
                        "description": description,
                        "amount": amount,
                        "date": new Date()
                    };     
                store.createHistory(historyObj).then(response => {
                    store.updateEnvelope(from, {amountValue: (Number($scope.vm.originEnvelope.amount_value) - amount)}).then(() => {
                        $scope.$root.$broadcast('updateHistory');
                        $scope.closeModal();
                    });
                });
            }
        }
    }
});