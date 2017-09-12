angular.module('tipti.config', []).service('Config', ['$q', '$rootScope', '$http', '$localForage', function($q, $rootScope, $http, $localForage) {
    var ENVS = {
        'LOCAL': 2,
        'STAGING': 1,
        'PRODUCTION': 0
    };


    //var ENV = ENVS.STAGING;
    var ENV = ENVS.PRODUCTION;


    $http.defaults.headers.common.Accept = $http.defaults.headers.common.Accept+"; version=1.0";

    var self = {

        serverUrl: function() {
            if (ENV == ENVS.LOCAL) return 'http://localhost:8000/misuper';
            if (ENV == ENVS.STAGING) return 'https://misuper-staging.herokuapp.com/misuper';
            return 'https://tipti.ec/misuper';
        },

        inBeta: function(){
            return true;
        },


        reset: function() {
            $localForage.reset();
        }
    };

    return self;
}]);
