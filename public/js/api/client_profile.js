angular.module('tipti.client_profile', []).factory('ClientProfile', ['Config', '$rootScope', 'User', '$q', '$http', '$localForage', function(Config, $rootScope, User, $q, $http, $localForage, $ionicPopup, $ionicScrollDelegate) {

    var self = {};

    self.client = {
        get: function() {

        }
    };

    self.profile = {
        list: function(page) {
            var url = Config.serverUrl() + "/client_profile/";

            var deferred = $q.defer();

            $http.get(url).then(function(response) {
                console.group("Profile");
                console.info(response.data);
                console.groupEnd();
                deferred.resolve(response.data);
                $rootScope.client_profile = response.data;
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        edit: function(phone, email, first_name, last_name, password,old_password) {
            var url = Config.serverUrl() + "/client_profile/";

            var deferred = $q.defer();

            var editprofile = {
                user: {
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "old_password": old_password,
                    "password": password,

                },
                "phone": phone
            };

            $http.put(url, editprofile).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        edit_sector: function(sector_name) {
            var url = Config.serverUrl() + "/client_profile/";

            var deferred = $q.defer();

            var editprofile = {
                "user": {
                },
                "current_sector": {
                    "name":sector_name
                }
            };

            $http.put(url, editprofile).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        complete: function(first_name, last_name, email, password, phone) {
            var url = Config.serverUrl() + "/client_profile/";

            var deferred = $q.defer();

            var completeprofile = {
                user: {
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "password": password,

                },
                "phone": phone
            };

            $http.post(url, completeprofile).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        send_mail: function(email) {
            var url = Config.serverUrl() + "/password_reset_email/";

            var deferred = $q.defer();

            var sendm = {
                "email": email
            };

            $http.post(url, sendm).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        send_code: function(token) {
            var url = Config.serverUrl() + "/password_reset_confirm/";

            var deferred = $q.defer();

            var sendm = {
                "user_token": token
            };

            $http.post(url, sendm).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        resetpass: function(token,password) {
            var url = Config.serverUrl() + "/password_reset/";

            var deferred = $q.defer();

            var sendm = {
                "user_token": token,
                "password":password
            };

            $http.post(url, sendm).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }



    };

    self.address = {

        list: function(page) {
            var url = Config.serverUrl() + "/client_profile/address/all";

            var deferred = $q.defer();

            $http.get(url).then(function(response) {
                console.group("Addresses");
                console.info(response.data);
                console.groupEnd();
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        /*{
            "name": "Casa",
            "position": "-0.2,-7",
            "default": true,
            "address_line1": "asdasd",
            "address_line2": "asdasd",
            "comment": ""
        }*/
        add: function(nombre, latitude, longitude, is_default, address_line1, address_line2,reference, comment,city,sector) {
            var url = Config.serverUrl() + "/client_profile/address";

            var deferred = $q.defer();

            var newaddress = {
                "name": nombre,
                "position": latitude + "," + longitude,
                "default": is_default,
                "address_line1": address_line1,
                "address_line2": address_line2,
                "reference": reference,
                "comment": comment,
                "city":city,
                "city_gps": {"name": city},
                "sector": {"name": sector}
            };

            $http.post(url, newaddress).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                console.log(newaddress);
                deferred.reject(error);
            });

            return deferred.promise;
        },
        delete: function(id_address) {
            var url = Config.serverUrl() + "/client_profile/address/" + id_address + "/";

            var deferred = $q.defer();

            $http.delete(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },                          
        edit: function(id_address, nombre, latitude, longitude, is_default, address_line1, address_line2,reference, comment,city,sector) {
            var url = Config.serverUrl() + "/client_profile/address/" + id_address + "/";

            var deferred = $q.defer();

            var newaddress = {
                "name": nombre,
                "position": latitude + "," + longitude,
                "default": is_default,
                "address_line1": address_line1,
                "address_line2": address_line2,
                "reference": reference,
                "comment": comment,
                "city":city,
                "city_gps": {"name": city},
                "sector": {"name": sector}
            };

            $http.put(url, newaddress).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };


    self.billinginfo = {

        list: function(page) {
            var url = Config.serverUrl() + "/client_profile/billinginfo/all";

            var deferred = $q.defer();

            $http.get(url).then(function(response) {
                console.log("Billing info");
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        add: function(nombre, is_default, address_line1, identifier, phone, email) {
            var url = Config.serverUrl() + "/client_profile/billinginfo";

            var deferred = $q.defer();

            var newbillinginfo = {
                "name": nombre,
                "default": is_default,
                "address_line1": address_line1,
                "identifier": identifier,
                "phone": phone,
                "email": email
            };

            $http.post(url, newbillinginfo).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        delete: function(id_billing) {
            var url = Config.serverUrl() + "/client_profile/billinginfo/" + id_billing + "/";

            var deferred = $q.defer();

            $http.delete(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        edit: function(id, nombre, is_default, address_line1, identifier, phone, email) {
            var url = Config.serverUrl() + "/client_profile/billinginfo/" + id + "/";

            var deferred = $q.defer();

            var newbillinginfo = {
                "name": nombre,
                "default": is_default,
                "address_line1": address_line1,
                "identifier": identifier,
                "phone": phone,
                "email": email
            };

            $http.put(url, newbillinginfo).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };

    self.list = {
        list: function() {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/list/all";

            $http.get(url).then(function(response) {
                console.group("Lista de Compras");
                console.info(response.data);
                console.groupEnd();

                deferred.resolve(response.data);


            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        list_detail: function(id_list) {
            var deferred = $q.defer();
            if (id_list === null) id_list = 1;

            var url = Config.serverUrl() + "/client_profile/list/" + id_list + "/";


            $http.get(url).then(function(response) {
                console.log("Lista de Compras");
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        create: function(list_name) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/list";
            var data = {
                'name': list_name
            };

            $http.post(url, data).then(function(responseData) {
                deferred.resolve(responseData.data);
                console.log("Se creo lista ok");
            }, function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Ya existe lista con ese nombre'
                });
            });

            return deferred.promise;
        },
        updateitems: function(id_list, stockitem_id, quantity) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/list/" + id_list + "/items/";
            var data = {
                'listitems': [{
                    'stockitem_id': stockitem_id,
                    'quantity': quantity
                }]
            };

            $http.post(url, data).then(function(responseData) {
                console.log(responseData);
                console.log("Se añadio producto a la lista");

            }, function(error) {
                console.log(
                    'Ya existe el producto en la lista'
                );
            });

            return deferred.promise;
        },
        delete: function(id_list) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/list/" + id_list + "/";

            $http.delete(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        flag_product: function(id_product, flag_type) {
            var url = Config.serverUrl() + "/flag_product/";

            var deferred = $q.defer();

            var producto_erroneo = {
                "stockitem_id": id_product,
                "flag_types": flag_type,
            };

            $http.put(url, producto_erroneo).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        feedback: function(message, feedback_type,context) {
            var url = Config.serverUrl() + "/client_profile/feedback/";

            var deferred = $q.defer();

            var data = {
                "message": message,
                "feedback_type": feedback_type,
                "context":context
            };

            $http.post(url, data).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        delete_prod: function(id_list_p) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/list/" + id_list_p + "/items/";

            $http.delete(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    };
    self.order = {
        create: function(address_id, billinginfo_id, payment_id, delivery, id_time, price_time, express, cash_amount) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/order";


            var data = {
                'address_id': address_id,
                'billing_info_id': billinginfo_id,
                'payment_method_id': payment_id,
                'delivery_date': delivery,
                'delivery_hour_price_id': id_time,
                'express_shipping': express,
                'shipping_cost': price_time,
                'cash_amount':cash_amount

            };

            $http.post(url, data).then(function(responseData) {
                console.log(responseData.data);
                deferred.resolve(responseData.data);
                console.log("Se añadio order");
            }, function(error) {
                deferred.reject(error);
                console.log(error);
            });
            return deferred.promise;
        },
        list_detail: function(id_order) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/order/" + id_order + "/";

            $http.get(url).then(function(response) {
                console.group("Order Detail");
                console.info(response.data);
                console.groupEnd();

                deferred.resolve(response.data);


            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        current: function() {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/orders/current";

            $http.get(url).then(function(response) {


                deferred.resolve(response.data);


            }, function(error) {
                console.error(error);
                deferred.reject(error);
            });

            return deferred.promise;
        },
        list: function(page) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/order/all?page="+page;

            $http.get(url).then(function(response) {
                console.group("Order All List");
                console.info(response.data);
                console.groupEnd();

                deferred.resolve(response.data);


            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        list_times: function(id_order) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/order_times/";

            $http.get(url).then(function(response) {
                console.group("Order times");
                console.info(response.data);
                console.groupEnd();

                deferred.resolve(response.data);


            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        change_status: function(id_order, status) {
            var url = Config.serverUrl() + "/client_profile/order/" + id_order + "/state";

            var deferred = $q.defer();

            var data = {
                'state': status
            };

            $http.put(url, data).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        rate_shopper: function(id_order, rate, comment) {
            var url = Config.serverUrl() + "/client_profile/order/" + id_order + "/rate";

            var deferred = $q.defer();

            var data = {
                'value': rate,
                'comment': comment
            };

            $http.put(url, data).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }


    };
    self.payment = {
        add: function(name, is_default, number, nombre, date, cvc) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/payment_method";

            var data = {
                'payment_type': "credit_card",
                'name': name,
                'default': is_default,
                'data': {
                    'number': number,
                    'nombre': nombre,
                    'date': date,
                    'cvc': cvc
                }
            };
            $http.post(url, data).then(function(responseData) {
                console.log(responseData);
                console.log("Se añadio payment method");
                deferred.resolve(responseData.data);
            }, function(error) {
                deferred.reject(error);
                console.log(error);
            });
            return deferred.promise;
        },
        add_payphone: function(phone) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/payment_method";

            var data = {
                'payment_type': 3,
                'name': phone,
                'default': false,
                'data': {
                    'phone': phone
                }
            };
            $http.post(url, data).then(function(responseData) {
                console.log(responseData);
                console.log("Se añadio payment method");
                deferred.resolve(responseData.data);
            }, function(error) {
                deferred.reject(error);
                console.log(error);
            });
            return deferred.promise;
        },
        list: function() {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/payment_method/all";

            $http.get(url).then(function(response) {
                console.group("Payment Method");
                console.info(response.data);
                console.groupEnd();

                deferred.resolve(response.data);


            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },

        delete: function(id_payment) {
            var deferred = $q.defer();

            var url = Config.serverUrl() + "/client_profile/payment_method/" + id_payment + "/";

            $http.delete(url).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        edit: function(id, name, number, nombre, date, cvc) {
            var url = Config.serverUrl() + "/client_profile/payment_method/" + id + "/";

            var deferred = $q.defer();

            var data = {
                'payment_type': "credit_card",
                'name': name,
                'default': "false",
                'data': {
                    'number': number,
                    'nombre': nombre,
                    'date': date,
                    'cvc': cvc
                }
            };

            $http.put(url, data).then(function(response) {
                console.log(response.data);
                deferred.resolve(response.data);

            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    };

    return self;
}]);
