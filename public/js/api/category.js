angular.module('tipti.category', []).service('Category', ['$q', '$rootScope', '$http', '$localForage', 'Config', function($q, $rootScope, $http, $localForage, Config) {
    var DEBUG = false;
    
    var self = {

        list: function(retailer_id) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/category/"+retailer_id+"/all";
            if(retailer_id!==undefined){

                $http.get(url).then(function(response) {
                    console.group("Category");
                    console.log(response.data);
                    console.groupEnd();
                    deferred.resolve(response.data);

                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }else{
                console.log("revisar_ id  categorias");
            }
        },

        list_subcategories: function(retailer_id, category_id) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/retailer_subcategories/"+retailer_id+"/"+category_id+"/";

            $http.get(url).then(function(response) {
                console.group("Products Category");
                console.log(response.data);
                console.groupEnd();
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        product_subcategories: function(retailer_id, subcategory_id,page) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/products_subcategories/"+retailer_id+"/"+subcategory_id+"/?page="+page;

            $http.get(url).then(function(response) {
                console.group("Products Category");
                console.log(response.data.results);
                console.groupEnd();
                deferred.resolve(response.data.results);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    };

    return self;
}]);
