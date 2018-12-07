angular.module('billbo').component('history', {
    templateUrl:'../js/components/history/history.html',
    controller: function($scope, store, _, $filter, $timeout){
        function updateHistory(){
            $scope.disableDelete = true;
            store.getHistory().then(response => {
                $scope.history = response.data;
                _.forEach($scope.history, function(e, i){
                    e.date = $filter('date')(e.date, 'medium');
                });
                $scope.gridOptions = {
                    enableRowSelection: true
                    , enableRowHeaderSelection: false
                    , multiSelect: false
                    , enableSelectAll: false
                    , enableGridMenu: true
                    , enableFiltering: true
                    , infiniteScrollRowsFromEnd: 25
                    , infiniteScrollUp: true
                    , infiniteScrollDown: true
                    , columnDefs: [
                        { name:'id', width:50, enableFiltering: false},
                        { name:'description', width:100, filter:{placeholder:'filter'} },
                        { name:'amount', width:100, filter:{placeholder:'filter'} },
                        { name:'from_title', width:100, filter:{placeholder:'filter'}, displayName: 'From' },
                        { name:'date', minWidth:200, maxWidth:200, filter:{placeholder:'filter'} }
                    ], onRegisterApi: gridApi => {
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {     
                            $scope.selected = row.isSelected;
                            $scope.rowId = row.uid;
                            $scope.rowObj = row.entity;
                            $scope.deleteId = row.entity.id;
                            $scope.selected === true ? $scope.disableDelete = false : $scope.disableDelete = true;
                            return;
                        });
                    }
                };
                $scope.gridOptions.data = $scope.history
                refresh();
            });
        }
        updateHistory();

        $scope.$on('updateHistory', updateHistory);

        $scope.deleteItem = function(id){
            $scope.disableDelete = true;
            $scope.deleteId = null;
            store.deleteHistory(id).then(response => updateHistory());
        };
        function refresh() {
            $scope.refresh = true;
            $timeout(function() {
              $scope.refresh = false;
            }, 0);
        };
    }
})