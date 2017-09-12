angular.module('tipti.codepush', [])
    .service('CodePush', function ($q, $rootScope, $ionicLoading) {

        var self = {

            onDownloadProgress: function (downloadProgress) {
                $rootScope.downloadProgress = downloadProgress;
                if (downloadProgress) {
                    console.log("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress);
                }
            },

            onError: function (error) {
                console.log("An error occurred. " + error);
            },

            onSyncStatusChange: function (status) {
                console.group("CodePush");
                console.log(status);
                switch (status) {
                case SyncStatus.CHECKING_FOR_UPDATE:
                    // Show "Checking for update" notification
                    console.log('checking for update');
                    //alert('checking for update');
                    break;
                case SyncStatus.AWAITING_USER_ACTION:
                    // Show "Checking for update" notification
                    console.log('AWAITING_USER_ACTION');
                    //alert('AWAITING_USER_ACTION');
                    break;
                case SyncStatus.DOWNLOADING_PACKAGE:
                    
                    break;
                case SyncStatus.INSTALLING_UPDATE:

                    break;
                case SyncStatus.ERROR:
                    console.log('Oops! An error occurred. Don\'t worry, the app will be updated later.');
                    alert('Oops! An error occurred. Don\'t worry, the app will be updated later.');
                    break;
                case SyncStatus.UPDATE_INSTALLED:


                    break;
                case SyncStatus.UPDATE_IGNORED:
                    break;
                }

                console.groupEnd();
            },

            sync: function () {
                window.codePush.sync();
            }

        };

        return self;
    });
