angular.module('billbo').controller('main', function($scope, balances, _, envelopeFactory, store, config, notification){
    $('form').attr('autocomplete', 'off');
    $scope.navVisible = false;
    envelopeFactory.passScope($scope);
    $scope.$on('updateDom', function(){
        let master = _.find(store.data.envelopes, {id:1});
        $scope.balance = Number(master.amount_value);
        $scope.envelopes = store.data.envelopes;
        $scope.consolidated = 0;
        _.forEach(store.data.envelopes, env => {
            $scope.consolidated += Number(env.amount_value);
        });
    });

    $scope.toggleNav = function(){
        $scope.navVisible = !$scope.navVisible;
    }
    
    $scope.showModal = function(visibility, modal, envelope, type){
        if($scope.navVisible){
            $scope.toggleNav();
        }
        if(envelope){
            $scope.originEnvelope = envelope;
        }
        if(type){
            $scope.type = type;
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

    $scope.$on('envActionModal', function(referenceScope, envelope, type){
        $scope.showModal(true, 'envActionModal', envelope, type);
    });

    $scope.$on('autoActionModal', function(referenceScope, envelope, type){
        $scope.showModal(true, 'autoActionModal', envelope, type);
    });

    $scope.$on('masterBalanceModal', function(referenceScope, envelope, type){
        $scope.showModal(true, 'masterBalanceModal');
    });

    $scope.$on('transferModal', function(referenceScope, envelope, type){
        $scope.showModal(true, 'transferModal');
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