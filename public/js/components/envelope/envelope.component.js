angular.module('billbo').component('envelope', {
    bindings:{
        env: '<'
    },
    templateUrl:'../js/components/envelope/envelope.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory, features, config){
        $scope.delete = envelopeFactory.deleteEnvelope;
        function updateEnvelopes(){
            if($scope.vm.env){
                $scope.id = $scope.vm.env.id
            }
            if(document.getElementById($scope.id)){
                var el = document.getElementById($scope.id);
                el.setAttribute('style', 'background: rgba(' + $scope.vm.env.color_r + ',' + $scope.vm.env.color_g + ',' + $scope.vm.env.color_b + ',0.3);');
            }
        }
        $scope.showCombined = function(envelope){
            $scope.$root.$broadcast('combinedModal', envelope);
        }
        this.$doCheck = function(){
            updateEnvelopes();
        };
        $scope.$on('updateEnvelopes', updateEnvelopes);
    }
})