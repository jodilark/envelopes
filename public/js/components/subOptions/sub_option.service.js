angular.module('suboption').service('subOptions', subOptions);
function subOptions($rootScope, envelopeFactory){
    var buttons;
    if(!buttons){
        buttons = [
            {
                text: 'Purchase',
                id: 'option_one',
                background: 'blue',
                action: function(env){
                    $rootScope.$broadcast('envActionModal', env, 'purchase');
                }
            },
            {
                text: 'Add Funds',
                id: 'option_two',
                background: 'green',
                action: function(env){
                    $rootScope.$broadcast('envActionModal', env, 'addFunds');
                }
            },
            {
                text: 'delete',
                id: 'option_three',
                background: 'red',
                action: function(env){
                    envelopeFactory.deleteEnvelope(env)
                }
            }
        ];
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