angular.module('billbo').component('history', {
    templateUrl:'../js/components/history/history.html',
    controller: function($scope, store, _, $filter){
        function updateHistory(){
            store.getHistory().then(response => {
                $scope.history = response.data;
                _.forEach($scope.history, function(e, i){
                    e.date = $filter('date')(e.date, 'medium');
                });
            });
        }
        updateHistory();

        $scope.$on('updateHistory', updateHistory);

        $scope.deleteItem = function(id){
            store.deleteHistory(id).then(response => updateHistory());
        }
    }
})