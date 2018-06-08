var Dreamsup = angular.module('Dreamsup', []); //index.ejs에서 ng-app="Genie"로 썼으니까

Dreamsup.controller('helloants', ['$http','$scope', function($http,$scope){ 
    //ng-controller="helloants"로 썼으니까


var refresh = function() { 

$http.get("/users/upload/image").success(function(response){ // server.js에 접근

$scope.imageList = response;

});

}

refresh(); // ng-controller 가 시작될때 함수 실행

}]);