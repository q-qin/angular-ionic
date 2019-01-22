angular.module('controllers', [])

.controller('indexCtrl', ['$scope', 'lyer',
  function($scope, lyer, $ionicScrollDelegate) {
    var mySwiper = new Swiper('.swiper-container', {
      autoplay: 5000, //可选选项，自动滑动
      //pagination : '.swiper-pagination',
    })

    $scope.commingSoon = function() {
      lyer.msg("即将开启");
      return;
    }
  }
])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();

  //$scope.chats = [];
  $scope.notice = "";
  var ws = new WebSocket("ws://www.juzi001.com:8001");
  var nickname = "";
  // 发送消息
  $scope.sendMessage = function() {
    if (!$scope.iptVal) {
      lyer.msg('您的输入为空！');
      return;
    }
    if (ws.readyState === WebSocket.OPEN) {
      var item = JSON.stringify({
        type: "message",
        nickName: "wap站",
        avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkA9qaz2lcxe2S9qnYBghDNvC6On7EZIrzGjibhhIWMCAU0thQhUh6jItP4qa3fnkrGbqPkV5bicGA/0",
        message: $scope.iptVal
      });
      ws.send(item);
      $scope.iptVal = '';
    }
  };

  ws.onopen = function(e) {
      console.log('Connection to server opened');
      $scope.notice = "网络连接正常，现在可以聊天了。"
    }
    //收到消息处理
  ws.onmessage = function(e) {
    var data = JSON.parse(e.data);
    nickname = data.nickName;
    console.log("ID: [%s] = %s", data.id, data.message);
    if (data.type == 'message') {
      //$scope.chats.push(data);
      Chats.push(data);
      $scope.chats = Chats.all();
      $scope.$apply();
    }
  }
  ws.onerror = function(e) {
    console.log("Connection closed");
    $scope.notice = "网络连接异常，请稍后重试。"
  };
  ws.onclose = function(e) {
    console.log("Connection closed");
  }

  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', ['$scope', 'util', 'lyer',
  function($scope, util, lyer) {
    util.getUserInfo(function(res) {

    })

    $scope.commingSoon = function() {
      lyer.msg("即将开启");
      return;
    }

    $scope.logout = function() {
      localStorage.removeItem("userinfo"),
        location.href = "#/tabs/index";
    }
  }
])

.controller('loginCtrl', ['$scope', 'lyer', 'API', '$state', '$stateParams',
  function($scope, lyer, API, $state, $stateParams) {
    // 登录submit
    $scope.login = function(form) {
      if (form.username.$error.required || form.pw.$error.required) {
        lyer.msg('用户名或密码不能为空!');
        return false;
      }
      var params = angular.toJson($scope.params);
      API.post('/login', params)
        .success(function(res) {
          if (res.code == -1) {
            lyer.msg(res.msg);
          } else {
            localStorage.setItem('userinfo', angular.toJson(res.data));
            if ($stateParams.backUrl) {
              location.href = decodeURIComponent($stateParams.backUrl);
            } else {
              $state.go('tab.index');
            }
          }
        })
    }
  }
])
// 资讯列表
.controller('newsCtrl', ['$scope','API','lyer', 
  function($scope,API,lyer){
    $scope.getlist = function(){
      API.post('/newslist','{}')
      .success(function(res){
        if(res.code == -1){
          lyer.msg(res.msg);
          return false;
        }else{
          $scope.data = res.data;
        }
      })
    }
    $scope.getlist();
}])
// 资讯详情
.controller('newsdetailCtrl', ['$scope','API','lyer', '$stateParams',
  function($scope,API,lyer,$stateParams){
  $scope.getdetail = function(){
    if(!$stateParams.id){
      lyer.msg('参数异常，请稍后重试！');
      return false;
    }
    API.post('/newsdetail',{id:$stateParams.id})
    .success(function(res){
      if(res.code == -1){
        lyer.msg(res.msg);
        return false;
      }else{
        $scope.data = res.data[0];
      }
    })
  }
  $scope.getdetail();

}])
// 小游戏
.controller('gameCtrl', ['$scope','$timeout', 
  function($scope,$timeout){
  angular.element(document).ready(function () {
     $scope.height = document.querySelector("#game").clientHeight+'px';
  });
}])