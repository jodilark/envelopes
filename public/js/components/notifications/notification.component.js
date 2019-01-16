angular.module('billbo').component('notificationContainer', {
    bindings: {
        type: '<'
    },
    templateUrl: '../js/components/notifications/notification.html',
    controller: function($scope, notification){
        this.$onInit = function(){
            angular.extend($scope, $scope.notify.type);
        }
        $('document').ready(() => $('.button_listener').click(() => notification.hideIt()))
    },
    controllerAs: 'notify'
});