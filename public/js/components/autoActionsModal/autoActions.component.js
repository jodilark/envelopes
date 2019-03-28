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
        })

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'autoActionModal');
        }
        $scope.submit = function(){
            //update envelope
            if($scope.autoCredit){
                $scope.aa.originEnvelope.creditrecursionamount = $scope.amount;
                $scope.aa.originEnvelope.creditrecursiondate = $scope.dayOfMonth;
            } else if($scope.autoDebit){
                $scope.aa.originEnvelope.debitrecursionamount = $scope.amount;
                $scope.aa.originEnvelope.debitrecursiondate = $scope.dayOfMonth;
            }
            var today = new Date().getDate();
            store.updateEnvelope($scope.aa.originEnvelope.id, $scope.aa.originEnvelope).then($scope.closeModal());
        }
    }
});