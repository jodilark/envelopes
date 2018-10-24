angular.module('billbo').component('balanceAdjustmentModal', {
    bindings: {
        type: '<'
    },
    controllerAs: 'vm',
    controller: function($scope, balances){
        $scope.submitBalance = function(amount){
            balances.update(amount, 'add');
            $scope.closeModal();
        }
        $scope.closeModal = function(){
            document.getElementById('faddBalance').reset();
            $scope.$root.$broadcast('closeModal');
        }
    },
    templateUrl: './balanceAdjustment.html'
})