angular.module('billbo').controller('main', function($scope, balances, _, envelopeFactory, store){
    envelopeFactory.passScope($scope);
    $scope.$on('updateDom', function(){
        let master = _.find(store.data.envelopes, {id:1});
        $scope.balance = Number(master.amount_value);
        $scope.envelopes = store.data.envelopes;
    });
    
    $scope.showModal = function(visibility, modal){
        $scope[modal] = visibility;
    }
    $scope.$on('closeModal', function(context, modal){
        $scope[modal] = false;
    });

    $scope.reset = function(){
        $scope.envelopes = null;
        $scope.balance = null;
        store.resetAll();
    };

    $scope.createEnvelope = function(){
        envelopeFactory.createEnvelope($scope.fdata, 'fdata').then(function(res){
            $scope.envelopes = res.data;
        });
    };
});