angular.module('suboption', []).component('optionSelector', {
    templateUrl: '../js/components/subOptions/sub_option.html',
    controller: function($scope, subOptions){
        $scope.showOptions = false;
        $scope.buttons = subOptions.getButtons();
        $('document').ready(() => {
            _.forEach($scope.buttons, (e, i) => {
                $('#' + e.id).css('background', e.background);
            })
        });

        var bool;
        $('.subOption_container').click(function(el){   
            $scope.showOptions = !$scope.showOptions;
            setTimeout(function(){
                $scope.$apply()
            })
            return $scope.showOptions ? setListener() : hideLinks();
        });
    
        function setListener(){
            bool = true;
            document.addEventListener("click", hideLinks);
        }

        function hideLinks(){
            if(bool){
                bool = false;
                return;
            }
            $scope.showOptions = false;
            setTimeout(function(){
                $scope.$apply()
            })
            document.removeEventListener("click", hideLinks);
        }
    }
});