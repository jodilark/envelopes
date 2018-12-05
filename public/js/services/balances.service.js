angular.module('billbo').service('balances', balances);
function balances($q, store){
    var modalView;
    
    function getBalance(){
        return store.data.masterBalance;
    }
    function update(value, operation){
        switch(operation){
            case 'add':
            value = Number(value);
            store.data.masterBalance += value;
            store.updateEnvelope(1, {"amountValue": store.data.masterBalance})
            return;
            case 'subtract':
            value = Number(value);
            store.data.masterBalance -= value;
            store.updateEnvelope(1, {"amountValue": store.data.masterBalance})
            default:
            angular.noop();
        }
    }
    function modal(display){
        modalView = display;
        return modalView;
    }
    function getModalView(){
        return modalView;
    }

    return {
        getBalance: getBalance,
        update: update,
        modal:modal,
        getModalView:getModalView
    }
}