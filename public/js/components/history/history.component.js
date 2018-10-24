angular.module('billbo').component('history', {
    templateUrl:'../public/js/components/history/history.html',
    controller: function($scope, store, _){
        $scope.$on('updateStore', function(){
            store.data.history.length === 0 ? $scope.history = null : $scope.history = store.data.history;
        });
        $scope.deleteItem = function(line){
            var idx = _.indexOf(store.data.history, line);
            store.data.history.splice(idx, 1);
            if(store.data.history.length === 0){
                $scope.history = null
            } else {
                $scope.$root.$broadcast('updateStore');
            }
        }
    }
})