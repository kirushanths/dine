/**
 * CONTROLLER
 */

var app = angular.module('dine', []);

app.config(function($routeProvider) {

    var template = 'landing.html';
    var sURL = window.document.URL.toString();
    if (sURL.indexOf("?preview") > 0)
    {
        template = 'preview.html';
    } 

    $routeProvider.
      when('/', {controller: mainController, templateUrl:template}).   
      when('/dashboard', {controller: mainController, templateUrl: 'dashboard.html'}).
      when('/preview', {controller: mainController, templateUrl: 'thinksimple/index.html'}).
      otherwise({redirectTo:'/'});
  });

var g_currentView = 0; 

function mainController($scope, $location) {

  $scope.enterDashboard = function()
  {  
      $location.path('/dashboard');
  }

  $scope.preview = function()
  {
      window.open('thinksimple/index.html?preview','_blank');
      //$location.path('/preview');

  }

  $scope.data = function(key) {  
      var data = getData(key); 
      return $("<div/>").html(getData(key)).text();
  }      

  $scope.changeView = function(viewId)
  {  
      g_lastView = g_currentView;
      g_currentView = viewId;      
  }
  $scope.getView = function()
  { 
    return "thinksimple/index.html";
    /*
    if (g_currentView == 0)
      return "home.html";
    else if (g_currentView == 1)
      return "location.html";
    */
  }
}    