angular.module('billbo').component('autoActions', {
    bindings: {
        originEnvelope: '<',
        type: '<'
    },
    templateUrl: '../js/components/autoActionsModal/autoActions.html',
    controllerAs: 'aa',
    controller: function($scope, store, notification){
        setTimeout(function(){
            if($scope.aa.type === 'start credit'){
                $scope.formId = 'autoCredit';
                $scope.transType = 'credit'
                store.getEnvelopes().then(res => {
                    let envelopes = res.data;
                    $scope.list = _.filter(envelopes, envelope => {
                        if(envelope.id !== $scope.aa.originEnvelope.id){
                            return envelope;
                        }
                    });
                });
            } else if ($scope.aa.type === 'start debit'){
                $scope.formId = 'autoDebit';
                $scope.transType = 'debit';
            }
            $scope.$apply();
        }, 100);

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'autoActionModal');
            let context = {
                notifyType: 'success',
                notifyText: `${$scope.transType} has been created.`
            }
        }
        
        $scope.onChange = function(fromEnvelope){
            $scope.fromEnvelope = fromEnvelope;
        }
        
        $scope.submit = function(){
            //update envelope
            if($scope.autoCredit){
                //create credit transaction
                var transPayload = {
                    "envelopeid": $scope.aa.originEnvelope.id,
                    "amount": $scope.amount,
                    "dayofmonth": $scope.dayOfMonth,
                    "description": $scope.transDescription,
                    "fromEnvelopeid": $scope.fromEnvelope.id
                }
                store.createCredit(transPayload, $scope.aa.originEnvelope).then($scope.closeModal);
            } else if($scope.autoDebit){
                //create debit transaction
                var transPayload = {
                    "envelopeid": $scope.aa.originEnvelope.id,
                    "amount": $scope.amount,
                    "dayofmonth": $scope.dayOfMonth,
                    "description": $scope.transDescription
                }
                store.createDebit(transPayload, $scope.aa.originEnvelope).then($scope.closeModal);
                notification.resolveNotificationType(context);
            }
        }
    }
});