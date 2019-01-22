angular.module('services', [])
  .service('API', ['$http', 'lyer', function($http, lyer) {
    var get = function(action, params) {
      // 检查参数balabala
      var params = angular.fromJson(params);
      return $http.get(requestURL + action, {
          params: params,
          timeout: 5000
        })
        .error(function(res) {
          lyer.msg('网络异常，请稍后重试！');
          return false;
        });
    }
    var post = function(action, params) {
      // 检查参数balabala
      var params = angular.fromJson(params);
      return $http.post(requestURL + action, params, {
          timeout: 5000
        })
        .error(function(res) {
          lyer.msg('网络异常，请稍后重试！');
          return false;
        });
    }
    var del = function(fileId) {
      //var params = angular.fromJson(params);
      return $http.delete(fileURL + "/delFile?fileId=" + fileId);
    }

    return {
      get: get,
      post: post,
      del: del
    }
  }])
  .factory('lyer', [function() {
    // return function(msg){

    var msg = function(msg, callback) {
      layer.open({
        content: msg,
        btn: ['确认'],
        yes: function(index) {
          layer.close(index);
          if (callback) {
            callback(index);
          }
        }

      });
    }

    var confirm = function(msg, yesCallback, noCallback, yesTitle, noTitle) {
      layer.open({
        title: '温馨提示',
        content: msg,
        btn: [yesTitle || '确认', noTitle || '取消'],
        yes: function(index) {
          if (yesCallback) {
            yesCallback()
          }
          layer.close(index);
        },
        no: function(index) {
          if (noCallback) {
            noCallback();
          }
          layer.close(index);
        }
      })
    }

    return {
      msg: msg,
      confirm: confirm
    }
    // };
  }])
  .factory('util', [function() {
    var getUserInfo = function(callback) {
      var res = localStorage.getItem('userinfo');
      if (res && angular.isDefined(res)) {
        if (callback && typeof(callback) == 'function') {
          res = angular.fromJson(res);
          callback(res);
        }
      } else {
        location.href = "#/login?backUrl=" + encodeURIComponent(location.href);
      }
    };

    // 日期格式化 yyyy-MM-dd
    var formatDate = function(date) {
      date = new Date(date);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      return [year, month, day].map(formatNumber).join('-') + ' ';
    };

    // 时间格式化yyyy/MM/dd HH:mm:ss；
    var formatDateFull = function(date) {
      date = new Date(date);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    };
    // 时间格式化 HH:mm:ss
    var formatTime = function(date) {
      date = new Date(date);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      return [hour, minute, second].map(formatNumber).join(':')
    };
    // 时间格式化 HH:mm
    var formatTimeHm = function(date) {
      date = new Date(date);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      return [hour, minute].map(formatNumber).join(':')
    };
    // json转query
    var json2Form = function(json) {
      var str = [];
      for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
      }
      return str.join("&");
    };

    return {
      getUserInfo: getUserInfo,
      formatDate: formatDate,
      formatDateFull: formatDateFull,
      formatTime: formatTime,
      formatTimeHm: formatTimeHm,
      json2Form: json2Form,
    }
  }])
  .service('browser', [function() {
      var u = navigator.userAgent.toLowerCase();
      navigator.appVersion.toLowerCase();
      return {
        txt: u,
        version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        msie: /msie/.test(u) && !/opera/.test(u),
        mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u),
        safari: /safari/.test(u) && !/chrome/.test(u),
        chrome: /chrome/.test(u),
        opera: /opera/.test(u),
        presto: u.indexOf("presto/") > -1,
        webKit: u.indexOf("applewebkit/") > -1,
        gecko: u.indexOf("gecko/") > -1 && u.indexOf("khtml") == -1,
        mobile: !!u.match(/applewebkit.*mobile.*/),
        ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        android: u.indexOf("android") > -1,
        iPhone: u.indexOf("iphone") > -1,
        iPad: u.indexOf("ipad") > -1,
        weixin: /micromessenger/.test(u),
        QQBrowse: u.indexOf(" QQ") > -1 || u.indexOf(" qq") > -1,
        webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf("safari/") == -1
      }
  }])
.factory('Chats', [function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'images/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'images/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'images/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'images/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'images/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
}])
.factory('sessionInterceptor', ['$q','$injector','lyer','$rootScope', 
  function($q,$injector,lyer,$rootScope){
    return {
        request: function(config) {
            return config
        },
        requestError: function(rejection) {
            return $q.reject(rejection)
        },
        response: function(response) {
            return $rootScope.$broadcast("unlogin", response),
            response
        }
    }
}])