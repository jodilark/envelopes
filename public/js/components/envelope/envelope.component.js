angular.module('billbo').component('envelope', {
    bindings:{
        env: '<'
    },
    templateUrl:'../public/js/components/envelope/envelope.html',
    controllerAs: 'vm',
    controller: function($scope, envelopeFactory){
        $scope.delete = envelopeFactory.deleteEnvelope;
        this.$doCheck = function(){
            if($scope.vm.env){
                $scope.id = $scope.vm.env.id
            }
            if(document.getElementById($scope.id)){
                var el = document.getElementById($scope.id);
                el.setAttribute('style', 'background: rgba(' + $scope.vm.env.color.r + ' ' + $scope.vm.env.color.g + ' ' + $scope.vm.env.color.b + ');');
            }
        };
        $scope.showModal = function(){
            console.log('show modal?')
        }
    }
})