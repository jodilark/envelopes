angular.module('billbo').factory('_', lodashFactory);
function lodashFactory($window){
    if(!$window){

    }
    return $window._;
}