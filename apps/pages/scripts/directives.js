angular.module('directives', [])
.filter('trust2Html', ['$sce',function($sce) {  
    return function(val) {  
        return $sce.trustAsHtml(val);   
    };  
}])