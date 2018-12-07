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
            $scope.toEnvelopes.push({title_value: '-- OR ', amount_value: 'Purchase Something --'})
        });

         // html template condensing code
         $scope.formId = 'combinedModal';
         $scope[$scope.formId] = {toEnvelope:null, value:{from:null}};
         $scope.toEnvelope = $scope[$scope.formId].toEnvelope;
         $scope.fromFValue = $scope[$scope.formId].value.from;
         // end

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'combinedModal');
        }

        // html template condensing code
        $scope.setTo = function(toEnvelope){
            $scope[$scope.formId].toEnvelope = toEnvelope;
        }
        // end

        $scope.submit = function(){
            debugger
            let from = $scope.vm.originEnvelope.id, 
                to = $scope[$scope.formId].toEnvelope.id, 
                amount = Number($scope.fromFValue);
            // [FromAccountId, ToAccountId, Amount]
            store.transferBalance(from, to, amount).then(response => $scope.closeModal());
        }
    }
})