angular.module('billbo').service('notification', notification);

function notification($rootScope){
    var show = false;

    function sendBroadcast(context){
        $rootScope.$broadcast('updateNotification', context);
    }

    function resolveNotificationType(scope){
        show = true;
        switch(scope.notifyType){
            case 'success':
            var context = {
                styles: {},
                timeout: 3,
                showNotify: show,
                blocker: false
            };
            angular.extend(context, scope);
            sendBroadcast(context);
            break;
            case 'ays':
            var context = {
                styles: {},
                showNotify: show,
                blocker: true
            };
            angular.extend(context, scope);
            sendBroadcast(context);
            break;
            case 'error':
            var context = {
                styles: {},
                showNotify: show,
                blocker: true
            };
            angular.extend(context, scope);
            sendBroadcast(context);
            break;
            default:
            break;
        }
    }

    function hideIt(){
        show = false;
        var context = {showNotify: show}
        sendBroadcast(context);
    }

    return {
        resolveNotificationType:resolveNotificationType,
        hideIt: hideIt,
        show: show
    }
}
