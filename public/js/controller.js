angular.module('billbo').controller('main', function($scope, balances, _, envelopeFactory, store){
    $('form').attr('autocomplete', 'off');
    $scope.navVisible = false;
    envelopeFactory.passScope($scope);
    $scope.$on('updateDom', function(){
        let master = _.find(store.data.envelopes, {id:1});
        $scope.balance = Number(master.amount_value);
        $scope.envelopes = store.data.envelopes;
    });

    $scope.toggleNav = function(){
        $scope.navVisible = !$scope.navVisible;
    }
    
    $scope.showModal = function(visibility, modal){
        $scope.toggleNav();
        $scope[modal] = visibility;
    }
    $scope.$on('closeModal', function(context, modal){
        $scope[modal] = false;
    });

    $scope.reset = function(){
        $scope.toggleNav();
        $scope.envelopes = null;
        $scope.balance = null;
        store.resetAll();
    };

    $scope.createEnvelope = function(){
        $scope.toggleNav();
        envelopeFactory.createEnvelope($scope.fdata, 'fdata').then(function(res){
            $scope.envelopes = res.data;
        });
    };
});