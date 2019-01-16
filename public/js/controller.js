angular.module('billbo').controller('main', function($scope, balances, _, envelopeFactory, store, config, notification){
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
    
    $scope.showModal = function(visibility, modal, envelope){
        if($scope.navVisible){
            $scope.toggleNav();
        }
        if(envelope){
            $scope.originEnvelope = envelope;
        }
        $scope[modal] = visibility;
    };
    $scope.$on('closeModal', function(context, modal){
        $scope[modal] = false;
    });

    $scope.reset = function(){
        $scope.toggleNav();
        $scope.envelopes = null;
        $scope.balance = null;
        store.resetAll();
    };

    $scope.$on('combinedModal', function(referenceScope, envelope){
        $scope.showModal(true, 'combinedModal', envelope);
    });

    $scope.createEnvelope = function(){
        $scope.toggleNav();
        envelopeFactory.createEnvelope($scope.fdata, 'fdata').then(function(res){
            $scope.envelopes = res.data;
        });
    };

    $scope.showNotification = false;
    $scope.$on('updateNotification', function(scopes, notificationContext){
        $scope.showNotification = notificationContext.showNotify;
        $scope.type = notificationContext;
        if(notificationContext.timeout){
            notificationContext.timeout *= 1000;
            setTimeout(function(){
                $scope.showNotification = false;
                $scope.$apply();
            },notificationContext.timeout);
        }
        if(!notificationContext.showNotify){
            setTimeout(() => $scope.$apply())
        }
    });    
});