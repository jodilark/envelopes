angular.module('billbo').component('history', {
    templateUrl:'../js/components/history/history.html',
    controller: function($scope, store, _, $filter, $timeout){
        function updateHistory(){
            $scope.disableDelete = true;
            store.getHistory().then(response => {
                $scope.history = response.data;
                _.forEach($scope.history, function(e, i){
                    e.date = $filter('date')(e.date, 'mediumDate');
                });
                refresh();
            });
        }
        updateHistory();

        $scope.$on('updateHistory', updateHistory);

        $scope.deleteItem = function(id){
            $scope.disableDelete = true;
            $scope.deleteId = null;
            $scope.selectedHistoryRow = null;
            store.deleteHistory(id).then(response => updateHistory());
        };
        $scope.selectedHistoryRow;
        $scope.toggleSelect = function(id){
            let selectedRow = document.querySelector('#row_'+id);
            let elements = document.querySelector('.select');
            if(!elements){
                selectedRow.classList.add('select');
                $scope.selectedHistoryRow = id;
                $scope.disableDelete = false;
            } else {
                elements.classList.remove('select');
                if($scope.selectedHistoryRow === id){
                    $scope.selectedHistoryRow = null;
                    $scope.disableDelete = true;
                } else {
                    selectedRow.classList.add('select');
                    $scope.selectedHistoryRow = id;
                    $scope.disableDelete = false;
                }
            }
        }

        function refresh() {
            $scope.refresh = true;
            $timeout(function() {
              $scope.refresh = false;
            }, 0);
        };
    }
})