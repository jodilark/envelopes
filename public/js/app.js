angular.module('billbo', ['appConfig', 'suboption']).config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);