angular.module('billbo').controller('main', function($scope, balances, _, envelopeFactory, store){
    envelopeFactory.passScope($scope);
    $scope.balance = balances.getBalance();

    $scope.showModal = function(visibility, modal){
        $scope[modal] = visibility;
    }
    $scope.$on('closeModal', function(context, modal){
        $scope.balance = balances.getBalance();
        $scope[modal] = false;
    });

    $scope.reset = function(){
        envelopeFactory.getEnvelopes().then(function(res){
            _.forEach(res, function(e){
                envelopeFactory.deleteEnvelope(e);
            })
            store.resetAll().then(function(){
                $scope.envelopes = null;
                $scope.balance = store.data.masterBalance;
                $scope.$root.$broadcast('updateStore');
            });
        });
    };

    $scope.test = function(){
        store.createData(store.data).then(function(res){
            console.log(res);
        })
    }

    $scope.createEnvelope = function(){
        envelopeFactory.createEnvelope($scope.fdata, 'fdata').then(function(res){
            $scope.envelopes = res;
        });
    };
});