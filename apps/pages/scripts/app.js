angular.module('app', ['ionic', 'controllers', 'services','directives'])

.run(function($ionicPlatform, $rootScope, $state, $ionicScrollDelegate, $timeout, $ionicHistory) {
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeSuccess', function() {
    $rootScope.showHome = $state.current.showHome;
    $rootScope.showBack = $state.current.showBack;
    $rootScope.title = $state.current.title;
    $rootScope.goBack = function() {
      $ionicHistory.goBack();
    }

    $rootScope.goTop = function() {
      $ionicScrollDelegate.scrollTop();
    }

    // 控制返回顶端是否显示
    $rootScope.showRock = false;
    // 控制标题栏是否显示
    $rootScope.showTitle = true;

    $rootScope.getScrollPosition = function() {
      // 取滑动TOP值  
      var position = $ionicScrollDelegate.getScrollPosition().top;
      if (position >= 45) //大于等于45像素时隐藏标题  
      {
        $rootScope.showTitle = false;
        $rootScope.showRock = true;
      } else {
        $rootScope.showTitle = true;
        $rootScope.showRock = false;
      }
      $rootScope.$apply();
    }

  })
})

.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider','$httpProvider',
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  //debugger
  $httpProvider.interceptors.push("sessionInterceptor");
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[]';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = subName;
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  $stateProvider
    .state('login', {
      url: '/login?backUrl',
      templateUrl: 'templates/login/login.html',
      title: '用户登录',
      showHome: true,
      showBack: false,
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    // 首页
    .state('app.index', {
      url: '/index',
      views: {
        'tab-index': {
          templateUrl: 'templates/tab-index.html',
          controller: 'indexCtrl'
        }
      },
      title: '桔子精选',
      showBack: false,
    })
    // 婚宴酒店
    .state('app.hotel', {
      url: '/hotel/list/:area-:type-:sort',
      views: {
        'tab-index': {
          templateUrl: 'templates/hotel/list.html',
        }
      },
      title: '婚宴酒店',
      showBack: true,
    })
    // 酒店详情
    .state('app.hotel-detail', {
      url: '/hotel/detail/:hotelid',
      views: {
        'tab-index': {
          templateUrl: 'templates/hotel/detail.html',
          //controller: 'hoteldetailCtrl'
        }
      },
      title: '酒店详情',
      showBack: true,
    })
    // 婚纱摄影
    .state('app.shoot', {
      url: '/shoot/list/:area-:type-:sort',
      views: {
        'tab-index': {
          templateUrl: 'templates/shoot/list.html',
        }
      },
      title: '婚纱摄影',
      showBack: true,
    })
    // 婚纱摄影详情
    .state('app.shoot-detail', {
      url: '/shoot/detail/:shootid',
      views: {
        'tab-index': {
          templateUrl: 'templates/shoot/detail.html',
          //controller: 'hoteldetailCtrl'
        }
      },
      title: '婚纱摄影详情',
      showBack: true,
    })
    // 婚车
    .state('app.car', {
      url: '/car/list/:area-:type-:sort',
      views: {
        'tab-index': {
          templateUrl: 'templates/car/list.html',
        }
      },
      title: '婚车',
      showBack: true,
    })
    // 婚车详情
    .state('app.car-detail', {
      url: '/car/detail/:carid',
      views: {
        'tab-index': {
          templateUrl: 'templates/car/detail.html',
          //controller: 'hoteldetailCtrl'
        }
      },
      title: '婚车详情',
      showBack: true,
    })
    // 发现
    .state('app.find', {
      url: '/find',
      views: {
        'tab-find': {
          templateUrl: 'templates/tab-find.html',
          //controller: 'ChatsCtrl'
        }
      },
      title: '发现新鲜事',
      showBack: false,
    })
    // 资讯公告
    .state('app.find-news', {
      url: '/find/news/',
      views: {
        'tab-find': {
          templateUrl: 'templates/find/news.html',
          controller: 'newsCtrl'
        }
      },
      title: '资讯公告',
      showBack: true,
    })
    // 资讯详情
    .state('app.find-newsdetail', {
      url: '/find/news/:id',
      views: {
        'tab-find': {
          templateUrl: 'templates/find/newsdetail.html',
          controller: 'newsdetailCtrl'
        }
      },
      title: '资讯详情',
      showBack: true,
    })
    // 游戏
    .state('app.find-game', {
      url: '/find/game',
      views: {
        'tab-find': {
          templateUrl: 'templates/find/game.html',
          controller: 'gameCtrl'
        }
      },
      title: '桔子游戏',
      showBack: true,
    })
    // 用户中心
    .state('app.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      },
      title: '用户中心',
      showBack: false,
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/index');

}]);