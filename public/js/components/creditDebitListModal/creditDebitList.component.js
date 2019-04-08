angular.module('billbo').component('showCreditDebitModal', {
    bindings: {
        creditList: '<',
        type: '<'
    },
    templateUrl: '../js/components/creditDebitListModal/creditDebitList.html',
    controller: function($scope, notification, store, $q){
        $scope.disableDelete = true;
        function wordifyDates(list){
            _.forEach(list, item => {
                let day = item.dayofmonth.toString().split('').pop();
                switch(true){
                    case(day == 1):
                    item.dayofmonthword = item.dayofmonth + 'st';
                    break;
                    case(day == 2):
                    item.dayofmonthword = item.dayofmonth + 'nd';
                    break;
                    case(day == 3):
                    item.dayofmonthword = item.dayofmonth + 'rd';
                    break;
                    default:
                    item.dayofmonthword = item.dayofmonth + 'th';
                    break;
                }
            });
        }

        
        function listSetup(){
            wordifyDates($scope.cdm.creditList);
            setTimeout(function(){
                $scope.$apply();
            });
        }
        setTimeout(function() {
            if($scope.cdm.type === 'credit'){
                $scope.header_title_value = 'credit list';
            }
            listSetup();
        });

        function updateCreditList(deletedValue){
            return store.getCreditsByEnvId(deletedValue.data[0].envelopeid).then(newList => {
                $scope.cdm.creditList = newList.data;
                listSetup();
                return $q.resolve();
            })
        }

        $scope.closeModal = function(){
            $scope.$root.$broadcast('closeModal', 'showCreditOrDebit');
        };

        $scope.toggleSelect = function(id){
            let selectedRow = document.querySelector('#cdm_row_'+id);
            let elements = document.querySelector('.select');
            if(!elements){
                selectedRow.classList.add('select');
                $scope.selectedCdRow = id;
                $scope.disableDelete = false;
            } else {
                elements.classList.remove('select');
                if($scope.selectedCdRow === id){ 
                    $scope.selectedCdRow = null;
                    $scope.disableDelete = true;
                } else {
                    selectedRow.classList.add('select');
                    $scope.selectedCdRow = id;
                    $scope.disableDelete = false;
                }
            }
        };

        $scope.delete = function(deleteId){
            function deleteIt(){
                store.getCredits().then(res => {
                    let creditToDelete = _.find(res.data, function(e){
                        if(e.id === deleteId){
                            return e;
                        }
                    });
                    store.deleteCreditById(creditToDelete.id).then(updateCreditList)
                    .then(() => {
                        let context = {
                            notifyType: 'success',
                            notifyText: `Credit has been deleted successfully.`
                        }
                        notification.resolveNotificationType(context);
                    });
                });
            }
            let context = {
                notifyType: 'ays',
                notifyText: `Do you really want to delete this credit?`,
                buttons: [
                    {
                        text: 'YES',
                        action: deleteIt
                    },
                    {
                        text: 'No',
                        action: () => {return}
                    }
                ]   
            }
            notification.resolveNotificationType(context);
        };
    },
    controllerAs: 'cdm'
});