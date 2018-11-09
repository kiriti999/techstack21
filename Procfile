web: node server.js

fbLogin() {
            FB.login(function(response) {
                console.log('login response' , response);
                 if (response.authResponse) {
                    // Get and display the user profile data
                    self.getFbUserData();
                } else {
                    alert('User cancelled login or did not fully authorize');
                }
            }, {'scope': 'email,manage_pages,publish_pages', return_scopes: true} );
        }

        getFbUserData() {
            FB.api('/me/accounts', function (response) {
                console.log('page response', response);
            }, {scope:"manage_pages"});
        }