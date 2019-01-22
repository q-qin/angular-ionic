/**
 * App 调用接口
 * @date 2014-12-22
 */
// 获取URL参数
function queryString(name) {
    var search = window.location.search ? window.location.search.substr(1).split("&") : [],
        i = 0, len = search.length,
        params = {}, pos;

    for (; i < len; i++) {
        pos = search[i].indexOf("=");
        if (pos > 0) {
            params[search[i].substring(0, pos)] = decodeURIComponent(search[i].substring(pos + 1));
        }
    }
    return params[name] ? params[name] : undefined;
}

(function () {
    var ua = navigator.userAgent.toLowerCase();
    // 判断系统类型
    isAndroid = ua.indexOf("android") !== -1 ? true : false,
    isIOS = ua.indexOf("mac") !== -1 ? true : false,
    isIPhone = ua.indexOf("iphone") !== -1 ? true : false;

    // iOS支持的接口
    var iOSInterface = [];

    var AppCall = {
        call: function () {
            var arr = [].slice.call(arguments),
                name = arr.shift(),
                callback, data;

            // 提取回调函数
            if (arr[0] && typeof arr[arr.length - 1] === "function") {
                callback = arr.pop();
            } else {
                callback = function (response) { };
            }

            if (isAndroid) {
                if (this.has(name)) {
                    data = NativeCall[name].apply(NativeCall, arr) || null;
                    // 执行回调函数
                    callback && callback(data);
                    return data;
                }
            }
            else if (isIOS) {
                // ios没有判断接口是否存在
                return this.callIOSHandler(name, arr, callback);
            }
            return false;
        },
        has: function (name) {
            if (isAndroid) {
                return window.NativeCall && NativeCall[name] ? true : false;
            }
            else if (isIOS && iOSInterface.join(",").indexOf(name) >= 0) {
                return true;
            }
            return false;
        },
        extend: function (obj) {
            for (var i in obj) {
                this[i] = obj[i];
            }
            return this;
        },
        // 调用ios
        callIOSHandler: function (name, params, callback) {
            var i, obj = {};
            // 生成传参
            for (i = 0; i < params.length; i++) {
                obj['arg' + (i + 1)] = params[i];
            }

            // console.log(name);
            if (isIOS && window.WebViewJavascriptBridge) {
                //log('isIOS && window.WebViewJavascriptBridge');
                WebViewJavascriptBridge.callHandler(name, obj, callback);
                return true;
            }
            return false;
        }
    };

    function init() {
        if (isIOS) {
            AppCall.system = isIPhone ? "iPhone" : "iOS";
            // 如果是ios，初始化Bridge
            // @from  https://github.com/marcuswestin/WebViewJavascriptBridge
            if (!window.WebViewJavascriptBridge) {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    //callback(WebViewJavascriptBridge)
                    //alert('WebViewJavascriptBridgeReady');
                    // 初始化下
                    WebViewJavascriptBridge.init(function (message, responseCallback) {
                        responseCallback();
                    });

                    AppCall.callIOSHandler("getInterface", [], function (data) {
                        // 获取iOS支持的接口 
                        iOSInterface = JSON.parse(data);
                    });
                }, false);
            }else {
                callback(WebViewJavascriptBridge);
            }
        }
        else if (isAndroid) {
            AppCall.system = "Android";
        }
    }

    init();

    window.AppCall = AppCall;
})();

// 信息接口
AppCall.extend({
    // 弹出提示
    alert: function (text) {
        text = typeof text === "object" ?
            JSON.stringify(text) :
            (text + "");
        return this.call("alert", text);
    },
    // 设置回调刷新
    setRefreshOnBack: function (on) {
        setTimeout(function () {
            post(on);
        }, 100);

        function post(on) {
            return AppCall.call("setRefreshOnBack", (on ? true : false));
        }
    },

    close: function () {
        return this.call("close");
    },

    // web支付成功设置标识
    webSuccess: function (on) {
        return this.call("success", (on ? true : false));
    }
});

// 埋点接口
AppCall.extend({
    // 埋点接口
    infocTable: "",
    infocCfg: {},
    // type
    // 0: wifi下上传
    // 1: 都上传
    infocType: 0,
    infoc: function (table, obj) {
        var i, params = [];
        // 如果只传第一个参数，则表名取默认
        if (obj == null) {
            obj = table;
            table = this.infocTable;
        }
        // 加入默认参数
        for (i in this.infocCfg) {
            if (obj[i] == null) {
                obj[i] = this.infocCfg[i];
            }
        }
        // 参数格式化
        for (i in obj) {
            params.push(i + "=" + encodeURIComponent(obj[i]));
        }

        if (this.has("report")) {
            return this.call("report", JSON.stringify({
                table: table,
                type: this.infocType,
                params: params.join("&")
            }));
        }
        else if (window.Infoc) {
            // 兼容旧版本
            return Infoc.report(JSON.stringify({
                table: table,
                params: params.join("&")
            }));
        }
    }
});

// 信息接口
AppCall.extend({
    // 获取个人参数
    getUserData: function (callback) {
        return this.call("getUserData", callback);
    },
    // 获取app参数
    getProductData: function (callback) {
        return this.call("getProductData", callback);
    },
    // 获取签证
    getRequestSign: function (params, callback) {
        if (typeof params === "object") {
            params = JSON.stringify(params);
        }
        return this.call("getRequestSign", params, callback);
    },
    // 获取所有信息（个人和app）
    getAppData: function (callBack) {
        
        var params = {};
        setTimeout(function () {
            AppCall.getProductData(function (data) {
                //log('name=getProductData' + data);
                data = JSON.parse(data);
                //AppCall.alert(data);
                params.cmdId = data.cmdId;
                params.cmdName = data.cmdName;
                params.uuid = data.deviceId;
                params.platformCode = data.platformCode;
                params.platformVersion = data.platformVersion;
                params.appVersion = data.appVersion;
                AppCall.getUserData(function (data) {
                    //log('name=getUserData' + data);
                    data = JSON.parse(data);
                    // AppCall.alert(data);
                    params.UserID = data.userId;
                    params.usertype = data.userType;
                    params.token = data.userToken;
                    params.username = data.userName;
                    params.islogin = false;
                    if (!!params.UserID)
                        params.islogin = true;
                    if (callBack && typeof callBack === "function") {
                        callBack(params);
                    }
                });
            });
        }, 500);
    },
    // 获取签证信息(sign和公共参数)
    getSignData: function (self, callBack) {
        if (typeof self.params !== "object") {
            self.params = {};
        }
        setTimeout(function () {
            AppCall.getRequestSign(self.params.params, function (data) {
                //AppCall.alert(data);
                data = JSON.parse(data);
                self.params.cmdId = data.cmdId;
                self.params.cmdName = data.cmdName;
                self.params.uuid = data.uuid;
                self.params.platformCode = data.platformCode;
                self.params.platformVersion = data.platformVersion;
                self.params.appVersion = data.appVersion;
                self.params.UserID = data.userId;
                self.islogin = false;
                if (!!self.params.UserID)
                    self.islogin = true;
                self.params.sign = data.sign;
                if (callBack && typeof callBack === "function") {
                    callBack();
                }
            });
        }, 500);
    },
});

// 调起接口
AppCall.extend({
    // 行为调起
    navigate: function (action) {
        return this.call("navigate", JSON.stringify(action));
    },
    // 充值调起
    recharge: function (params, action) {
        return this.call("recharge", JSON.stringify(params), JSON.stringify(action));
    },
    // 充值第二版
    pay: function (params, expands, action) {
        return this.call("pay", JSON.stringify(params), JSON.stringify(expands), JSON.stringify(action));
    },
    // 分享功能
    share: function (title, content, url, target, screenshot) {
        var params = {
            title: title || "金山彩票",
            text: content || "",
            url: url || "",
            targetUrl: (target ? target : (url || "")),
            screenshot: (screenshot ? 1 : 0)
        };
        return this.call("share", JSON.stringify(params));
    },
    // 88红包分享功能
    share88: function (content, url, target) {
        return this.call("share88", content, url, (target || ""));
    },

    // 分享活动(int 活动ID)
    shareHuodong: function (activityid) {
        setTimeout(function () {
            post();
        }, 100);
        function post() {
            return AppCall.call("shareHuodong", activityid);
        }
    },
});

// 帐号操作接口
AppCall.extend({
    // 登录
    login: function () {
        return this.call("login");
    },
    // 注册
    register: function () {
        return this.call("register");
    },
    // 登录v2
    signin: function (action) {
        if (action == null) {
            action = {};
        }
        return this.call("signin", JSON.stringify(action));
    },
    // 注册v2
    signup: function (action) {
        if (action == null) {
            action = {};
        }
        return this.call("signup", JSON.stringify(action));
    },
    // 完善信息
    bindPersonal: function () {
        return this.call("bindPersonal");
    },
    // 绑定手机
    bindPhone: function () {
        return this.call("bindPhone");
    },
    // 绑定身份证
    bindIdCardNumber: function () {
        return this.call("bindIdCardNumber");
    }
});

// 基于服务端请求的封装
AppCall.extend({
    // 设置请求数据
    setServerData: function (self, callback) {
        if (typeof self.data !== "object") {
            self.data = {};
        }

        setTimeout(function () {
            AppCall.getUserData(function (data) {
                //AppCall.alert(data);
                data = JSON.parse(data);
                self.data.userId = data.userId;
                self.data.userType = data.userType;
                self.data.token = data.userToken;
                if (self.data.userId) {
                    self.isLogin = true;
                } else {
                    self.isLogin = false;
                }

                AppCall.getProductData(function (data) {
                    //AppCall.alert(data);
                    data = JSON.parse(data);
                    self.data.platformCode = data.platformCode;
                    self.data.appVersion = data.appVersion;
                    self.data.cmdId = data.cmdId;
                    self.data.cmdName = data.cmdName;

                    if (typeof callback === "function") {
                        callback();
                    }
                });
            });
        }, 100);
    }
});
var RquestConfig = {
    //WebSocket请求地址
    webSocket: '114.113.154.151:9090',
    //比分AJAX请求地址
    scoreAjax: 'data.master.jdd.com',
    //资讯AJAX请求地址
    clientAjax: 'client.jiangduoduo.com',
};
