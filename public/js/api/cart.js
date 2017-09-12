angular.module('tipti.cart', []).service('Cart', ['$q', 'Config', '$localForage', '$rootScope', '$http', function($q, Config, $localForage, $rootScope, $http) {

    var cartitem = {
        stockitem: {},
        quantity: 0
    };

    $rootScope.cart = {
        content: {
            items: [],
        },
        indexOf: function(item) {
            if(!item) return -1;
            var search_item = angular.copy(item);
            delete search_item.$$hashKey;

            for (var i = 0; i < this.content.items.length; i++) {
                if (this.content.items[i].stockitem.id === search_item.id) {
                    return i;
                }
            }
            return -1;
        },
        count: function(item) {
            if (this.indexOf(item) != -1)
                return this.content.items[this.indexOf(item)].quantity;
            else return 0;
        },
        notaShopper: function(item){
            console.log(this.indexOf(item));
            if (this.indexOf(item) != -1){
                var data_note=this.content.items[this.indexOf(item)].note;
                if(data_note===undefined){
                    return "";
                }else{
                    return data_note;
                }

            }
            else return "";
        },
        contains: function(item) {
            if (this.count(item) > 0)
                return true;
            else
                return false;
        },
        isExpress: function() {

            if (this.content.items.length > 10) {
                return false;
            }

            var cant_items_ex = 0;
            for (var i = 0; i < this.content.items.length; i++) {
                cant_items_ex = cant_items_ex + this.content.items[i].quantity;
                if (cant_items_ex > 10) {
                    return false;
                }
            }

            return true;
        },
        getRetailers: function(){
            var retailers = [];
            var retailers_ids = [];

            for(var i=0; i<this.content.items.length; i++){

                var item = this.content.items[i];

                var retailer = item.stockitem.retailer;

                if(retailers_ids.indexOf(retailer.id) === -1){
                    retailers.push(retailer);
                    retailers_ids.push(retailer.id);
                }

            }
            return retailers;
        },

        getTotal: function() {
            var total = 0;
            for (var i = 0; i < this.content.items.length; i++) {

                total += this.content.items[i].quantity * this.content.items[i].stockitem.price;
            }
            return total;
        },
        getiva12: function() {
            var total = 0;
            for (var i = 0; i < this.content.items.length; i++) {
                if(this.content.items[i].stockitem.product.tax[0].rate==="12.00"){
                    total += this.content.items[i].quantity * this.content.items[i].stockitem.price;
                }
            }
            total=total/1.12;
            return total;
        },
        getiva0: function() {
            var total = 0;
            for (var i = 0; i < this.content.items.length; i++) {
                if(this.content.items[i].stockitem.product.tax[0].rate==="0.00"){
                    total += this.content.items[i].quantity * this.content.items[i].stockitem.price;
                }
            }
            return total;
        }

    };

    var self = {
        /* get obtiene el carrito de localstorage y lo graba en rootScope */
        get: function() {
            var deferred = $q.defer();
            $localForage.getItem('cart_content').then(function(cart_content) {

                if (cart_content === null) {
                    cart_content = {
                        items: []
                    };
                }

                $rootScope.cart.content = cart_content;
                console.info("Cart.get()", $rootScope.cart.content);

                deferred.resolve($rootScope.cart);

            }, function(error) {
                console.error(error);
            });
            return deferred.promise;
        },

        /* graba el carrito en localstorage y lo pone en rootScope */
        put: function(cart) {
            var deferred = $q.defer();

            $localForage.setItem('cart_content', cart.content).then(function(saved_content) {
                $rootScope.cart.content = saved_content;
                deferred.resolve($rootScope.cart);
            }, function(error) {
                console.error(error);
            });
            return deferred.promise;
        },


        /* add un iten en el carrito, lo graba en localstorage y actualiza rootScope*/
        set: function(stockitem, quantity, note) {

            var deferred = $q.defer();

            self.get().then(function(cart) {
                var item;
                var index = cart.indexOf(stockitem);
                if (index !== -1)
                    item = cart.content.items[index];

                if (!item && quantity > 0) {
                    //anadir un item
                    var newItem = angular.copy(cartitem);
                    newItem.stockitem = stockitem;
                    newItem.quantity = quantity;
                    newItem.note = note;
                    cart.content.items.push(newItem);

                } else if (item && quantity > 0) {
                    //item ya existe, actualizar la cantidad
                    item.quantity = quantity;
                    item.note = note;
                    cart.content.items[index] = item;
                } else if (item && quantity === 0) {
                    //remover un iten?
                    cart.content.items.splice(index, 1);
                } else if (!item && quantity === 0) {
                    //remover un iten que no existe?
                    deferred.reject("Item no existe");
                }


                self.put(cart).then(function(cart) {

                    console.log(cart);
                    var url = Config.serverUrl() + "/client_profile/cart/items";
                    console.log(cart);
                    $http.put(url, cart.content.items).then(function(response) {
                        console.log(cart.content.items);
                        console.group("cart.set");
                        console.info(response.data);
                        console.groupEnd();

                        deferred.resolve(response.data);

                    }, function(error) {
                        deferred.reject(error);
                    });

                    deferred.resolve($rootScope.cart);
                });
            });

            return deferred.promise;
        },

        remove: function(stockitem, quantity) {

            var deferred = $q.defer();

            self.get().then(function(cart) {


                for (var i = 0; i < cart.content.items.length; i++) {
                    if (cart.content.items[i].id == stockitem.id) {
                        cart.content.items.splice(i, 1);
                        break;
                    }
                }


                self.put(cart).then(function(cart) {
                    deferred.resolve($rootScope.cart);
                });
            });

            return deferred.promise;
        },

        /* obtiene el carrito del backend, lo graba en localstorage y actualiza rootScope*/
        fetch: function() {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/cart";
            self.get().then(function(cart) {
                $http.get(url).then(function(response) {

                    console.info("Cart.fetch()", response.data);

                    cart.content = response.data;
                    self.put(cart).then(function(saved_cart) {
                        deferred.resolve(saved_cart);
                    });

                }, function(error) {
                    deferred.reject(error);
                });
            });


            return deferred.promise;
        }

    };

    return self;
}]);
