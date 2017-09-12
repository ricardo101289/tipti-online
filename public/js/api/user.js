angular.module('tipti.user', [])
.service('User',function ($q, $rootScope, $http, $localForage, Config) {
    var DEBUG = false;

    var self = {

        login: function (username, password) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/api-token-auth/";
            var data = {
                'username': username,
                'password': password
            };

            $http.post(url, data).then(function (responseData) {
                console.log(responseData);
                self.getDevice();
                $localForage.setItem('user', responseData.data).then(function (user) {

                    var token = "JWT " + user.token;
                    $rootScope.token = token;
                    $http.defaults.headers.common.Authorization = $rootScope.token;

                    deferred.resolve(user);
                });

            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        client_register: function (username,first_name,last_name,email,password,phone) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_register/";
            var data = {
                'username': username,
                'last_name': last_name,
                'first_name': first_name,
                'email': email,
                'password': password,
                'phone': phone
            };

            $http.post(url, data).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },


        refreshToken: function () {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/api-token-refresh/";

            self.getUser().then(function(user){
                var data = {
                    'token': user.token
                };
                $http.post(url, data).then(function (responseData) {
                    console.log(responseData);

                    $localForage.setItem('user', responseData.data).then(function (user) {

                        var token = "JWT " + user.token;
                        $rootScope.token = token;
                        $http.defaults.headers.common.Authorization = $rootScope.token;

                        deferred.resolve(user);
                    });

                }, function (error) {
                    deferred.reject(error);
                });
            });

            return deferred.promise;
        },

        loginFacebook: function (dataFacebook) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_facebook_register/";
            var data = {
                'token': dataFacebook.token,
                'first_name': dataFacebook.first_name,
                'last_name': dataFacebook.last_name,
                'email': dataFacebook.email,
                'device': dataFacebook.device
            };

            $http.post(url, data).then(function (responseData) {

                $localForage.setItem('user', responseData.data).then(function (user) {

                    var token = "JWT " + user.token;
                    $rootScope.token = token;
                    $http.defaults.headers.common.Authorization = $rootScope.token;

                    deferred.resolve(user);
                });

            }, function (error) {
                deferred.reject(error);
                console.log(error);
            });

            return deferred.promise;
        },

        registerMobile: function (numero) {
            var deferred = $q.defer();
            var url = Config.serverUrl() + "/client_sms_register/";

            self.getDevice().then(function (device) {
                var data = {
                    'phone': numero,
                    'device': device
                };

                console.log(JSON.stringify(data));

                $http.post(url, data).then(function (responseData) {
                    console.log(responseData);

                    deferred.resolve(responseData.data);

                }, function (error) {
                    deferred.reject(error);
                });
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;

        },
        registerMobilePIN: function (numero, pin) {
            var deferred = $q.defer();
            var url = Config.serverUrl() + "/client_sms_register/";
            self.getDevice().then(function (device) {
                var data = {
                    'pin': pin,
                    'phone': numero,
                    'device': device
                };

                console.log(data);

                $http.put(url, data).then(function (responseData) {
                    console.log(responseData);

                    $localForage.setItem('user', responseData.data).then(function (user) {

                        var token = "JWT " + user.token;
                        $rootScope.token = token;
                        $http.defaults.headers.common.Authorization = $rootScope.token;

                        deferred.resolve(user);
                    });

                }, function (error) {
                    deferred.reject(error);
                });

            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        getDevice: function () {
            var deferred = $q.defer();

            if (window.device !== undefined) {

                self.getPushNotificationToken().then(function(push_notification_token){
                    window.device.push_notification_token = push_notification_token;
                    deferred.resolve(window.device);
                });

            } else {
                var ua = navigator.userAgent;
                hash = md5omatic(ua);
                deferred.resolve({
                    "available": true,
                    "platform": "Browser",
                    "version": "0.0.0",
                    "uuid": hash,
                    "cordova": "0.0.0",
                    "model": navigator.userAgent,
                    "manufacturer": "Fullstack",
                    "isVirtual": true,
                    "serial": hash,
                    "push_notification_token": "0000000000000000"
                });
            }
            console.log(deferred.promise);
            return deferred.promise;
        },

        updateDevice: function(){
            var deferred = $q.defer();

            self.getDevice().then(function(device){

                var url = Config.serverUrl() + "/client_profile/device/"+device.uuid+"/";
                $http.post(url, device).then(function (responseData) {
                    console.info("Actualizado device", responseData);
                    deferred.resolve();
                }, function (error) {
                    console.error("Error actualizando device", error);
                    deferred.reject(error);
                });
            });

            return deferred.promise;
        },

        setPushNotificationToken: function(token){
            var deferred = $q.defer();

            $localForage.getItem('push_notification_token').then(function(old_push_notification_token){
                if(old_push_notification_token === null || old_push_notification_token !== token){

                    $localForage.setItem('push_notification_token', token).then(function (push_notification_token) {

                        deferred.resolve(push_notification_token);

                    }, function (error) {
                        deferred.reject(error);
                        console.error(error);
                    });
                }else{
                    deferred.resolve(token);
                }
            });

            return deferred.promise;
        },

        getPushNotificationToken: function(){
            var deferred = $q.defer();

            $localForage.getItem('push_notification_token').then(function (push_notification_token) {
                deferred.resolve(push_notification_token);
            }, function (error) {
                deferred.reject(error);
                console.error(error);
            });

            return deferred.promise;
        },

        getUser: function () {
            var deferred = $q.defer();

            $localForage.getItem('user').then(function (user) {

                if (user === null) {
                    deferred.reject(user);
                    return;
                }

                $rootScope.token = "JWT " + user.token;
                $http.defaults.headers.common.Authorization = $rootScope.token;

                deferred.resolve(user);
            }, function (error) {
                deferred.reject(error);
                console.error(error);
            });

            return deferred.promise;
        },

        reset: function () {
            $localForage.clear();
        },

        getSearchHistory: function () {
            var deferred = $q.defer();

            $localForage.getItem('search_history').then(function (search_history) {

                if (search_history === null) {
                    search_history = [];
                }

                deferred.resolve(search_history);

            }, function (error) {
                deferred.reject(error);
                console.error(error);
            });

            return deferred.promise;
        },

        addSearchHistory: function (query) {
            var deferred = $q.defer();

            self.getSearchHistory().then(function (search_history) {
                search_history.push(query);

                $localForage.setItem('search_history', search_history).then(function (search_history) {
                    deferred.resolve(search_history);
                }, function (error) {
                    deferred.reject(error);
                    console.error(error);
                });
            }, function (error) {
                deferred.reject(error);
                console.error(error);
            });

            return deferred.promise;
        },
        verifyVIPCard: function(qrcode){
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_verify_vipcard/";
            var data = {
                'qrcode': qrcode
            };

            $http.post(url, data).then(function (responseData) {
                deferred.resolve();
            }, function (error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            });

            return deferred.promise;
        },
        activateVIPCard: function(qrcode){
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_activate_vipcard/";
            var data = {
                'qrcode': qrcode
            };

            self.getUser().then(function(user){
                console.info("Activating", data, user);
                $http.post(url, data).then(function (responseData) {
                    deferred.resolve();
                }, function (error) {
                    deferred.reject(error);
                });

            });


            return deferred.promise;
        }
    };

    return self;
});
