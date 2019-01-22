(function(window,angular){

	angular.module('public', ['ngCookies'])
		.service('API', ['$http','$rootScope','$cookies','$cookieStore','getSign','browser',function($http,$rootScope,$cookies,$cookieStore,getSign,browser){
			var oldhost = 'http://client.jiangduoduo.com/action/mobilehandler.ashx',
				newhost = 'http://client.jiangduoduo.com/action/newmobilehandler.ashx';
				
				
			/*intObj//参数
				params,
				isNeedLogin,
				success,
				error
			 */
			var oldInt = function(intObj){
				httpInt(intObj,oldhost);
			}

			var newInt = function(intObj){
				httpInt(intObj,newhost);
			}

			var httpInt = function(intObj,ajaxUrl){
				

				var lastParams = {};

				if(browser.isApp){
					AppCall.getAppData(function(cparams){
						lastParams = angular.extend({},intObj.params,cparams);
						hget({
							ajaxUrl:ajaxUrl,
							isApp:browser.isApp,
							params:lastParams,
							isNeedLogin:intObj.isNeedLogin,
							successCallback:intObj.success,
							errorCallback:intObj.error
						});
					})
				}else{

					var userInfo = $cookieStore.get('userInfo');

					var publicParams = {
						// platform:4,
						uuid:'3C075555N9M0',
						platformCode:'h5mobile',
						appVersion:'1.0.0',
						platformVersion:'1.0.0',
						UserID:userInfo ? userInfo.id : '',
						usertype:1,
						cmdName:$cookies.get('from') || 'h5_zz',
						token:userInfo ? userInfo.token : ''
						
					};

					
					

					var sign = getSign(publicParams.uuid,publicParams.platformCode,publicParams.platformVersion,publicParams.appVersion,publicParams.UserID,intObj.params.params);
					// console.log(publicParams.sign);
					lastParams = angular.extend({sign:sign},publicParams,intObj.params);

					//hget(oldhost,browser.isApp,lastParams,successCallback,errorCallback);
					//
					hget({
						ajaxUrl:ajaxUrl,
						isApp:browser.isApp,
						params:lastParams,
						isNeedLogin:intObj.isNeedLogin,
						successCallback:intObj.success,
						errorCallback:intObj.error
					});

				}


				
			}

			/* obj｛
				ajaxUrl,
				isApp,是否是app
				params,参数
				isNeedLogin,是否需要登陆
				successCallback,成功回调
				errorCallback,网络错误回调
			 ｝*/
			function hget(obj){
				$http.get(obj.ajaxUrl,{params:obj.params})
					.success(function(rt){
						var isNeedLogin = 0;
						if(angular.isUndefined(obj.isNeedLogin)){
							isNeedLogin = 1;
						}else{
							isNeedLogin = obj.isNeedLogin;
						}
						if(rt.Code == -2 && isNeedLogin){

							if(obj.isApp){
								AppCall.login();
							}else{
								location.href='/home/#/login?backUrl='+encodeURIComponent(location.href);
							}
							return false;
						}
						if(obj.successCallback)
							obj.successCallback(rt);
					}).error(function(){
						layer.open({
						    content: '请求超时，请您重新加载或检查您的网络连接!',
						    btn: ['确认']
						});
						if(obj.errorCallback)
							obj.errorCallback();
					});
				
			}

			return {
				// qtInt:qtInt
				oldInt:oldInt,
				newInt:newInt
			}
				
		}])
		.service('getSign', [function(){
			return function(uuid,platformCode,platformVersion,appVersion,userId,params){
				
				var	key = '8888';

				// console.log(uuid+platformCode+platformVersion+appVersion+params+userId+key);
				// var sign = md5.createHash(uuid+platformCode+platformVersion+appVersion+params+userId+key);
				var sign = md5(uuid+platformCode+platformVersion+appVersion+params+userId+key);
				// console.log(sign);
				return sign;
			}
		}])
		.service('browser',[function(){

			var u = navigator.userAgent.toLowerCase();
			var app = navigator.appVersion.toLowerCase(); 
			return {
					txt: u, // 浏览器版本信息
					version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], // 版本号
					msie: /msie/.test(u) && !/opera/.test(u), // IE内核
					mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u), // 火狐浏览器
					safari: /safari/.test(u) && !/chrome/.test(u), //是否为safair
					chrome: /chrome/.test(u), //是否为chrome
					opera: /opera/.test(u), //是否为oprea
					presto: u.indexOf('presto/') > -1, //opera内核
					webKit: u.indexOf('applewebkit/') > -1, //苹果、谷歌内核
					gecko: u.indexOf('gecko/') > -1 && u.indexOf('khtml') == -1, //火狐内核
					mobile: !!u.match(/applewebkit.*mobile.*/), //是否为移动终端
					ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
					android: u.indexOf('android') > -1, //android终端
					iPhone: u.indexOf('iphone') > -1, //是否为iPhone
					iPad: u.indexOf('ipad') > -1, //是否iPad
					weixin: /micromessenger/.test(u), //微信
					QQBrowse: u.indexOf(' QQ') > -1 || u.indexOf(' qq') > -1,
					webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf('safari/') == -1, //是否web应该程序，没有头部与底部,
					isApp:(u.indexOf('jscp/ios')> -1 || u.indexOf('jscp/android')>-1)
					// isApp:true
			 };
			
    	}])
    	.factory('lyer', [function(){

			var msg = function(msg,callback){
				layer.open({
				    content:msg,
				    btn: ['确认'],
				    yes:function(index){
				    	layer.close(index);
				    	if(callback){
				    		callback(index);
				    	}
				    }

				});
			}

			var confirm = function(msg,yesCallback,noCallback){
				layer.open({
					title:'温馨提示',
					content:msg,
					btn:['确认','取消'],
					yes:function(index){
						if(yesCallback){
							yesCallback()
						}
						layer.close(index);
					},
					no:function(index){
						if(noCallback){
							noCallback();
						}
						layer.close(index);
					}
				})
			}

			return {
				msg:msg,
				confirm:confirm
			}
		
		}])
		.factory('app', [function(){
			
		}])
})(window,angular)




