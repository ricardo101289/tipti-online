angular.module('tipti', ['tipti.retailer']);

angular.module('tipti').controller('SectoresController',['$scope' ,'$rootScope', 'Retailer', SectoresController]);
 function SectoresController($scope ,$rootScope, Retailer) {
    
    $scope.sector_t=false;
    
    Retailer.list_city().then(function(ciudades){
        $rootScope.ciudades=ciudades.results;
    });

    $scope.open_sector=function(city_id){
        console.log(city_id);
        if(city_id!==""){
            $scope.sector_t=true;
            Retailer.list_sector(city_id).then(function(sectores){
                $scope.places=sectores;
            });
            $scope.sector_l=true;
            $scope.city_id=city_id;

        }else{
            $scope.sector_t=false;
            $scope.places="";
            $scope.sector_l=true;
            $scope.sector_b=false;
        }



    };

    /*$stateProvider.state('descargas', {
      templateUrl: 'descargas.html'
    });*/

    $scope.open_continuar=function(sector_id){
        console.log(sector_id);
        if(sector_id!==""){
            console.log("boton activo");
            $scope.sector_b=true;
            $scope.sector_id=sector_id;
        }else{
            console.log("boton inactivo");
            $scope.sector_b=false;
        }



    };

    $scope.selectretailer=function(cobertura){
        console.log("holi", cobertura);
        for (var i = 0; i < $scope.ciudades.length; i++) {
            if ($scope.ciudades[i].id == $scope.city_id) {
                $scope.ciudad=$scope.ciudades[i].name;
            }
        }
        for (var j = 0; j < $scope.places.length; j++) {
            if ($scope.places[j].id == $scope.sector_id) {
                $scope.sector=$scope.places[j].name;
            }
        }

        $rootScope.current_address=$scope.sector+ " , "+ $scope.ciudad;
        $rootScope.sector_profile=$scope.sector;
        window.location.href = 'descargas.html';
    };
   
   $scope.sendSector=function(usuario){
    console.log(usuario)
    window.location.href = 'enviadosector.html';
   };
    
};
