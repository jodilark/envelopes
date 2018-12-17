angular.module('billbo').component('combinedModal', {
    bindings: {
        originEnvelope: '<'
    },
    templateUrl: '../js/components/combined/combined.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances, store){
        var from;
        $('form').attr('autocomplete', 'off');
        store.getEnvelopes().then(function(res){
            $scope.toEnvelopes = res.data.filter(function(e, i, arr){
                if(e.title_value !== $scope.vm.originEnvelope.title_value && e.id !== 1){
                    return e
                }
            });
            $scope.toEnvelopes.push({title_value: '-- ', amount_value: 'Purchase Something : --'})
        });

         // html template condensing code
         $scope.formId = 'combinedModal';
         // end

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'combinedModal');
        }

        // html template condensing code
        $scope.setTo = function(toEnvelope){
            let isPurchase = toEnvelope.amount_value.substring(0, 8);
            if(isPurchase === "Purchase"){
                $scope.purchase = true;
            }
            $scope[$scope.formId].toEnvelope = toEnvelope;
        }
        // end

        $scope.submit = function(){
            debugger
            let from = $scope.vm.originEnvelope.id, 
            to = $scope[$scope.formId].toEnvelope.id, 
            amount = Number($scope[$scope.formId].amount.$viewValue);
            // [FromAccountId, ToAccountId, Amount]
            if(to){
                store.transferBalance(from, to, amount).then(response => $scope.closeModal());
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
})