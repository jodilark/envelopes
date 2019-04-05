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
            }
            $scope.$apply();
        }, 100);

        $scope.closeModal = function(){
            document.getElementById($scope.formId).reset();
            $scope.$root.$broadcast('closeModal', 'autoActionModal');
        }
        $scope.submit = function(){
            //update envelope
            if($scope.autoCredit){
                //create transaction
                var transPayload = {
                    "envelopeid": $scope.aa.originEnvelope.id,
                    "amount": $scope.amount,
                    "dayofmonth": $scope.dayOfMonth,
                    "description": $scope.transDescription,
                    "fromEnvelopeid": $scope.fromEnvelope.id
                }
                store.createCredit(transPayload, $scope.aa.originEnvelope).then($scope.closeModal())
            } else if($scope.autoDebit){
                // $scope.aa.originEnvelope.debitrecursionid
            }
        }
    }
});