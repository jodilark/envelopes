angular.module('billbo').component('autoActions', {
    bindings: {
        originEnvelope: '<',
        type: '<'
    },
    templateUrl: '../js/components/autoActionsModal/autoActions.html',
    controllerAs: 'aa',
    controller: function($scope, store){
        setTimeout(function(){
            if($scope.aa.type === 'start credit'){
                $scope.formId = 'autoCredit';
            } else if ($scope.aa.type === 'start debit'){
                $scope.formId = 'autoDebit';
            }
        }, 100);

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'autoActionModal');
        }
        $scope.submit = function(){
            //update envelope
            if($scope.autoCredit){
                //create transaction
                var transPayload = {
                    "envelopeid": $scope.aa.originEnvelope.id,
                    "amount": $scope.amount,
                    "dayofmonth": $scope.dayOfMonth,
                    "description": $scope.transDescription
                }
                store.createCredit(transPayload, $scope.aa.originEnvelope).then($scope.closeModal())
            } else if($scope.autoDebit){
                // $scope.aa.originEnvelope.debitrecursionid
            }
        }
    }
});