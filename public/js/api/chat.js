angular.module('tipti.chat', [])
    .service('Chat', ['$q', '$rootScope', '$http', '$localForage', 'Config',
        function ($q, $rootScope, $http, $localForage, Config) {

            var chats = {};

            var self = {

                get: function(order_id){
                    if(chats[order_id] === undefined)
                        return [];
                    else
                        return chats[order_id];
                },

                fetch: function (order_id) {
                    /*var deferred = $q.defer();

                    var url = Config.serverUrl() + "/client_profile/order/"+order_id+"/messages";

                    $http.get(url).then(function (response) {
                        console.group("Chat fetch order "+order_id);
                        console.log(response.data);
                        console.groupEnd();

                        if(chats[order_id] === undefined){
                            chats[order_id] = [];
                        }

                        chats[order_id] = response.data.results;

                        deferred.resolve(chats[order_id]);

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;*/
                    return "desactivado";
                },

                send_message: function (order_id, message) {
                    /*var deferred = $q.defer();

                    var url = Config.serverUrl() + "/client_profile/order/"+order_id+"/messages";

                    var data = {
                        "content": message
                    };

                    $http.post(url, data).then(function (response) {
                        console.group("Chat post en "+order_id);
                        console.log(response.data);
                        console.groupEnd();
                        chats[order_id].push(response.data);
                        deferred.resolve(response.data);

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;*/
                    return "desactivado";
                }

            };

            $rootScope.$on('chat-message-received', function(ev, data){
                //chats[order_id].append(data);
                $rootScope.$broadcast('chat-updated');
            });

            return self;
        }
    ]);
