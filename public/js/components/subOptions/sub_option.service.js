angular.module('suboption').service('subOptions', subOptions);
function subOptions($rootScope, envelopeFactory){
    var buttons;
    if(!buttons){
        buttons = {
            envelope: [
                {
                    text: 'Purchase',
                    id: 'option_one',
                    icon: 'fa fa-credit-card',
                    background: 'blue',
                    action: function(env){
                        $rootScope.$broadcast('envActionModal', env.vm, 'purchase');
                    }
                },
                {
                    text: 'Add Funds',
                    id: 'option_two',
                    icon: 'fa fa-plus',
                    background: 'green',
                    action: function(env){
                        $rootScope.$broadcast('envActionModal', env.vm, 'addFunds');
                    }
                },
                {
                    text: 'auto debit',
                    id: 'option_three',
                    icon: 'fa fa-coins',
                    background: 'aqua',
                    action: function(env){
                        console.log('auto debit from master');
                    }
                },
                {
                    text: 'auto credit',
                    id: 'option_four',
                    icon: 'fa fa-donate',
                    background: 'orange',
                    action: function(env){
                        console.log('auto credit from master');
                        $rootScope.$broadcast('autoActionModal', env.vm, 'start credit');
                    }
                },
                {
                    text: 'delete',
                    id: 'option_five',
                    icon: 'fa fa-trash',
                    background: 'red',
                    action: function(env){
                        envelopeFactory.deleteEnvelope(env.vm)
                    }
                }
            ],
            master: [
                {
                    text: 'Add Funds',
                    id: 'master_option_one',
                    icon: 'fa fa-plus',
                    background: 'blue',
                    action: function(env){
                        $rootScope.$broadcast('masterBalanceModal');
                    }
                },
                {
                    text: 'transfer',
                    id: 'master_option_two',
                    icon: 'fa fa-exchange-alt',
                    background: 'red',
                    action: function(env){
                        $rootScope.$broadcast('transferModal');
                    }
                }
            ]
        }
    }
    function getButtons(){
        return buttons;
    }
    function setButtons(context){
        buttons = context;
        return getButtons(buttons);
    }
    return {
        getButtons:getButtons,
        setButtons:setButtons
    }
}