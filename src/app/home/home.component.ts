import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  /**
  GOOGLE ANALYTICS API METHODS
  */
  // Replace with your client ID from the developer console.
  var CLIENT_ID = '134171856754-1ahd1eqko7gnu8vu2k9rkb7hp6ser4il.apps.googleusercontent.com';

  // Set authorized scope.
  var SCOPES = ['https://www.googleapis.com/auth/analytics.manage.users',
                'https://www.googleapis.com/auth/tagmanager.manage.users',];


  function authorize(event) {
    // Handles the authorization flow.
    // `immediate` should be false when invoked from the button click.
    var useImmdiate = event ? false : true;
    var authData = {
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: useImmdiate
    };

    gapi.auth.authorize(authData, function(response) {
      var authButton = document.getElementById('ga-auth-button');
      if (response.error) {
        authButton.hidden = false;
      }
      else {
        authButton.hidden = true;
        queryAccounts();
      }
    });
  }


function queryAccounts() {
  // Load the Google Analytics client library.
  gapi.client.load('analytics', 'v3').then(function() {

    // Get a list of all Google Analytics accounts for this user
    gapi.client.analytics.management.accounts.list().then(handleAccounts);
  });
}


function handleAccounts(response) {
  // Handles the response from the accounts list method.
  if (response.result.items && response.result.items.length) {
    // Get the first Google Analytics account.
    var firstAccountId = response.result.items[0].id;

    // Query for properties.
    queryProperties(firstAccountId);
  } else {
    console.log('No accounts found for this user.');
  }
}


function queryProperties(accountId) {
  // Get a list of all the properties for the account.
  gapi.client.analytics.management.webproperties.list(
      {'accountId': accountId})
    .then(handleProperties)
    .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProperties(response) {
  // Handles the response from the webproperties list method.
  if (response.result.items && response.result.items.length) {

    // Get the first Google Analytics account
    var firstAccountId = response.result.items[0].accountId;

    // Get the first property ID
    var firstPropertyId = response.result.items[0].id;

    // Query for Views (Profiles).
    queryProfiles(firstAccountId, firstPropertyId);
  } else {
    console.log('No properties found for this user.');
  }
}


function queryProfiles(accountId, propertyId) {
  // Get a list of all Views (Profiles) for the first property
  // of the first Account.
  gapi.client.analytics.management.profiles.list({
      'accountId': accountId,
      'webPropertyId': propertyId
  })
  .then(handleProfiles)
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}


function handleProfiles(response) {
  // Handles the response from the profiles list method.
  if (response.result.items && response.result.items.length) {
    // Get the first View (Profile) ID.
    var firstProfileId = response.result.items[0].id;

    // Query the Core Reporting API.
    queryCoreReportingApi(firstProfileId);
  } else {
    console.log('No views (profiles) found for this user.');
  }
}


function queryCoreReportingApi(profileId) {
  // Query the Core Reporting API for the number sessions for
  // the past seven days.
  gapi.client.analytics.data.ga.get({
    'ids': 'ga:' + profileId,
    'start-date': '7daysAgo',
    'end-date': 'today',
    'metrics': 'ga:sessions'
  })
  .then(function(response) {
    var formattedJson = JSON.stringify(response.result, null, 2);
    document.getElementById('query-output').value = formattedJson;
  })
  .then(null, function(err) {
      // Log any errors.
      console.log(err);
  });
}

  // Add an event listener to the 'auth-button'.
  document.getElementById('auth-button').addEventListener('click', authorize);


  /**
  GOOGLE TAG MANAGER API METHODS
  */

    // Parameter values used by the script
    ACCOUNT_PATH = TODO; // such as: 'accounts/555555';
    CONTAINER_NAME = 'Greetings';
    WORKSPACE_NAME = 'Example workspace';

    /**
     * Check if current user has authorization for this application.
     *
     * @param {bool} immediate Whether login should use the "immediate mode", which
     *     causes the security token to be refreshed behind the scenes with no UI.
     */
    function checkAuth(immediate) {
      var authorizeCheckPromise = new Promise((resolve) => {
        gapi.auth.authorize(
          { client_id: CLIENT_ID, scope: SCOPES.join(' '), immediate: immediate },
          resolve);
      });
      authorizeCheckPromise
          .then(handleAuthResult)
          .then(loadTagManagerApi)
          .then(runTagManagerExample)
          .catch(() => {
            console.log('You must authorize any access to the api.');
          });
    }

    /**
     * Check if current user has authorization for this application.
     */
    function checkAuth() {
      checkAuth(true);
    }

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     * @return {boolean} Returns false.
     */
    function handleAuthClick(event) {
      checkAuth();
      return false;
    }

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     * @return {Promise} A promise to call resolve if authorize or redirect to a
     *   login flow.
     */
    function handleAuthResult(authResult) {
      return new Promise((resolve, reject) => {
        var authorizeDiv = document.getElementById('gtm-auth-button');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          resolve();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
          reject();
        }
      });
    }

    /**
     * Load Tag Manager API client library.
     *
     * @return {Promise} A promise the load the Tag Manager API library.
     */
    function loadTagManagerApi() {
      return new Promise((resolve, reject) => {
        console.log('Load Tag Manager api');
        gapi.client.load('tagmanager', 'v2', resolve);
      });
    }

    /**
     * Interacts with the tagmanager api v2 to create a container, workspace,
     * trigger, and tag.
     *
     * @return {Promise} A promise to run the Tag Manager example.
     */
    function runTagManagerExample() {
      return new Promise((resolve, reject) => {
        console.log('Running Tag Manager Example.');
        resolve();
      });
    }

    /**
     * Logs an error message to the console.
     *
     * @param {string|Object} error The error to log to the console.
     */
    function handleError(error) {
      console.log('Error when interacting with GTM API');
      console.log(error);
    }

    /**
     * Wraps an API request into a promise.
     *
     * @param {Object} a request to the API.
     * @return {Promise} A promise to execute the API request.
     */
    function requestPromise(request) {
      return new Promise((resolve, reject) => {
        request.execute((response) => {
          if (response.code) {
            reject(response);
          }
          resolve(response);
        });
      });
    }



  }

}
