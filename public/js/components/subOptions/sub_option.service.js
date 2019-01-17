angular.module('suboption').service('subOptions', subOptions);
function subOptions(){
    var buttons;
    if(!buttons){
        buttons = [
            {
                text: 'foo',
                id: 'option_one',
                background: 'blue',
                action: function(){
                    console.log('foo!')
                }
            },
            {
                text: 'bar',
                id: 'option_two',
                background: 'green',
                action: function(){
                    console.log('bar!')
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