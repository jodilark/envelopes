angular.module('billbo').component('autoActions', {
    bindings: {
        originEnvelope: '<',
        type: '<'
    },
    templateUrl: '../js/components/autoActionsModal/autoActions.html',
    controllerAs: 'aa',
    controller: function($scope){
        $scope.formId = 'autoAction';

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.closeModal = function(){
                document.getElementById($scope.formId).reset();
                $scope.$root.$broadcast('closeModal', 'autoActionModal');
            }
        }
        $scope.submit = function(){
            var amount = $scope.amount;
            var day = $scope.dayOfMonth;
            var today = new Date()
            debugger

        }
    }
});