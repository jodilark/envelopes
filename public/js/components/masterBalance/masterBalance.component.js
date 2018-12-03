angular.module('billbo').component('masterBalanceModal', {
    templateUrl: '../js/components/masterBalance/masterBalance.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, _, balances){
       $scope.submit = function(){
           var amount = this.mbTransfer.value;
           balances.update(amount, 'add');
           $scope.$root.$broadcast('closeModal', 'masterBalanceModal');
       };

    $scope.closeModal = function(){
        document.getElementById('mbTransfer').reset();
        $scope.$root.$broadcast('closeModal', 'masterBalanceModal');
    }
    }
})