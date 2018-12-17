angular.module('billbo').component('envelope', {
    bindings:{
        env: '<'
    },
    templateUrl:'../js/components/envelope/envelope.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory){
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
        this.$doCheck = function(){
            updateEnvelopes();
        };
        $scope.$on('updateEnvelopes', updateEnvelopes);
    }
})