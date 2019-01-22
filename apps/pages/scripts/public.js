// 数字补0
function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 接口请求域名
var requestURL = 'http://api.juzi001.com:3000';