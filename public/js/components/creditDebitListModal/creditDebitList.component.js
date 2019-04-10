angular.module('billbo').component('showCreditDebitModal', {
    bindings: {
        transList: '<',
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
            wordifyDates($scope.cdm.transList);
            setTimeout(function(){
                $scope.$apply();
            });
        }
        setTimeout(function() {
            if($scope.cdm.type === 'credit'){
                $scope.header_title_value = 'credit list';
            } else if($scope.cdm.type === 'debit'){
                $scope.header_title_value = 'debit list';
            }
            listSetup();
        });

        function updatetransList(deletedValue){
            let endpoint;
            if($scope.header_title_value === 'credit list'){
                endpoint = store.getCreditsByEnvId;
            } else if($scope.header_title_value === 'debit list'){
                endpoint = store.getDebitsByEnvId;
            }
            return endpoint(deletedValue.data[0].envelopeid).then(newList => {
                $scope.cdm.transList = newList.data;
                listSetup();
                return $q.resolve();
            });
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
            let deleteEndpoint, deleteType;
            if($scope.header_title_value === 'credit list'){
                deleteEndpoint = store.deleteCreditById;
                deleteType = 'credit'
            } else if($scope.header_title_value === 'debit list'){
                deleteEndpoint = store.deleteDebitById;
                deleteType = 'debit'
            }
            function deleteIt(){
                deleteEndpoint(deleteId).then(updatetransList)
                .then(() => {
                    let context = {
                        notifyType: 'success',
                        notifyText: `${deleteType} has been deleted.`
                    }
                    notification.resolveNotificationType(context);
                });
            }
            let context = {
                notifyType: 'ays',
                notifyText: `Do you really want to delete this ${deleteType}?`,
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