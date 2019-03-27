angular.module('suboption', []).directive('optionSelector', function(subOptions, $compile){
    return {
        restrict: 'AE',
        scope: {},
        link: function($scope, element, attr){
            var bool;
            $scope.showOptions = false;
            $scope.option = JSON.parse(attr.optionSelector);

            //////////////////////////
            // Get specific buttons
            switch($scope.option.type){
                case 'envelope':
                $scope.buttons = subOptions.getButtons().envelope;
                break;
                case 'master':
                $scope.buttons = subOptions.getButtons().master;
                $(element[0]).addClass('master_buttons');
                break;
            }

            //////////
            // Render
            $('document').ready(() => render(element[0]));
            function render(el){
                var optionsHtml = '<ng-include src="' + "'js/components/subOptions/sub_option.html'" + '"></ng-include>',
                compiled = $compile(optionsHtml)($scope);
                $(el).append(compiled);
            }
            
            /////////////////
            // Event Handlers
            $(element).click(function(el){ 
                $scope.showOptions = !$scope.showOptions;
                _.forEach($scope.buttons, (button) => {
                    $('.' + button.id).css('background', button.background);
                });
                $scope.$apply();
                return $scope.showOptions ? setListener() : hideLinks();
            });

        
            function setListener(){
                bool = true;
                document.addEventListener("click", hideLinks);
            }

            function hideLinks(){
                if(bool) return bool = false;
                $scope.showOptions = false;
                setTimeout($scope.$apply());
                document.removeEventListener("click", hideLinks);
            }
        }
    }
});