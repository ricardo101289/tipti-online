angular.module('tipti.stocklist', []).service('StockList', ['$q', '$rootScope', '$http', '$localForage', 'Config', function($q, $rootScope, $http, $localForage, Config, $ionicScrollDelegate) {
    var DEBUG = false;

    var self = {

        list: function(retailer_id, page) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/stocklist?retailer_id=" + retailer_id + "&page=" + page;

            $http.get(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_classic: function(retailer_id, query, page, order_by){
            if (page === undefined) page = 1;
            if (order_by === undefined) order_by = "alpha_asc";

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/stocklist?retailer_id=" + retailer_id + "&search=" + query + "&page=" + page + "&order_by=" + order_by;

            $http.get(url).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_elastic: function(retailer_id, query, page, order_by) {
            if (page === undefined) page = 1;
            if (order_by === undefined) order_by = "alpha_asc";

            var deferred = $q.defer();
            console.log(order_by);
            var url = Config.serverUrl() + "/search/?retailer_id=" + retailer_id + "&query=" + query + "&page=" + page + "&order_by=" + order_by;

            $http.get(url).then(function(response) {

                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search: function(retailer_id, query, page, order_by) {
            var deferred = $q.defer();

            self.search_elastic(retailer_id, query, page, order_by).then(function(response){
                deferred.resolve(response.data);
            }).catch(function(elastic_error){

                if(elastic_error.status === 404){
                    console.error(elastic_error);
                    deferred.reject(elastic_error);
                }else{
                    console.error(elastic_error);
                    self.search_classic(retailer_id, query, page, order_by).then(function(response){
                        deferred.resolve(response.data);
                    }, function(classic_error){
                        deferred.reject(classic_error);
                    });
                }

            });

            return deferred.promise;
        },
        put: function(listas) {
            var deferred = $q.defer();

            $localForage.setItem('listas', listas).then(function(listas) {
                $rootScope.listas_compras = listas;
                deferred.resolve($rootScope.listas_compras);
            });
            return deferred.promise;
        },
        search_category_elastic: function(page, retailer_id,category_id) {

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/search/?page="+page+"&retailer_id=" + retailer_id +"&category_id=" + category_id;

            $http.get(url).then(function(response) {
                console.log("Search category", "Page "+page, "Retailer "+retailer_id, "Category "+category_id, response);
                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_category_classic: function( page, retailer_id, category_id) {

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/stocklist?page="+page+"&retailer_id=" + retailer_id+"&category_id=" + category_id;

            $http.get(url).then(function(response) {
                console.log(response);
                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_category: function( page, retailer_id,category_id) {
            var deferred = $q.defer();

            self.search_category_elastic(page, retailer_id,category_id).then(function(response){
                deferred.resolve(response.data);
            }).catch(function(elastic_error){

                if(elastic_error.status === 404){
                    console.error(elastic_error);
                    deferred.reject(elastic_error);
                }else{
                    console.error(elastic_error);
                    self.search_category_classic(page, retailer_id,category_id).then(function(response){
                        deferred.resolve(response.data);
                    }, function(classic_error){
                        deferred.reject(classic_error);
                    });
                }

            });

            return deferred.promise;
        },
        search_subcategory_elastic: function(page, retailer_id,category_id,subcategory_id) {

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/search/?page="+page+"&retailer_id=" + retailer_id +"&category_id=" + category_id+"&subcategory_id=" + subcategory_id;

            $http.get(url).then(function(response) {
                console.log("Search subcategory", "Page "+page, "Retailer "+retailer_id, "Category "+category_id, "SubCategory "+subcategory_id, response);
                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_subcategory_classic: function( page, retailer_id, category_id,subcategory_id) {

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/stocklist?page="+page+"&retailer_id=" + retailer_id+"&category_id=" + category_id+"&subcategory_id=" + subcategory_id;

            $http.get(url).then(function(response) {
                console.log(response);
                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_subcategory: function( page, retailer_id,category_id,subcategory_id) {
            var deferred = $q.defer();

            self.search_subcategory_elastic(page, retailer_id,category_id,subcategory_id).then(function(response){
                deferred.resolve(response.data);
            }).catch(function(elastic_error){

                if(elastic_error.status === 404){
                    console.error(elastic_error);
                    deferred.reject(elastic_error);
                }else{
                    console.error(elastic_error);
                    self.search_subcategory_classic(page, retailer_id,category_id,subcategory_id).then(function(response){
                        deferred.resolve(response.data);
                    }, function(classic_error){
                        deferred.reject(classic_error);
                    });
                }

            });

            return deferred.promise;
        },
        search_prod_category_elastic: function(page, retailer_id,category_id,query) {

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/search/?page="+page+"&retailer_id=" + retailer_id +"&category_id=" + category_id+"&query=" + query;

            $http.get(url).then(function(response) {
                console.log("busqueda categoria");
                console.log(response);
                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_prod_subcategory_elastic: function(page, retailer_id,category_id,subcategory_id,query) {

            var deferred = $q.defer();

            var url = Config.serverUrl() + "/search/?page="+page+"&retailer_id=" + retailer_id +"&category_id=" + category_id+"&query=" + query+"&subcategory_id=" + subcategory_id;

            $http.get(url).then(function(response) {
                console.log("busqueda categoria");
                console.log(response);
                deferred.resolve(response);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        search_promises: function(promises){
          var deferred = $q.defer();
          $q.all(promises).then(function(allOk){
            deferred.resolve(allOk);
          }, function(error){
            deferred.reject(error);
          });

          return deferred.promise;

        }
    };

    return self;
}]);
