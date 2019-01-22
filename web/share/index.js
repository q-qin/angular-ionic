$(function () {
    $.getJSON('addrs.txt', function (data) {
        if(data.length ==0){
            capital();
        }else{
            Addmaker(data);
        }
    })

    function Addmaker(data){
        var map = new BMap.Map("allmap", {});                        // 创建Map实例
        map.centerAndZoom(new BMap.Point(120.628564,31.312588),13);     // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom();                        //启用滚轮放大缩小
        if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
            var points = [];  // 添加海量点数据
            for (var i = 0; i < data.length; i++) {
              points.push(new BMap.Point(data[i].lng, data[i].lat));
            }
            var options = {
                size: BMAP_POINT_SIZE_SMALL,
                shape: BMAP_POINT_SHAPE_STAR,
                color: '#d340c3'
            }
            var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
            pointCollection.addEventListener('click', function (e) {
                // 监听点击事件
                $(data).each(function(j,m){
                    if(m.lng==e.point.lng&&m.lat==e.point.lat){
                        layer.alert('地点：' + m.name
                            +'<br />类型：'+m.type
                            +'<br />价格：'+m.money
                            +'<br />简评：'+m.comment);
                        return false;
                    }else{
                        layer.alert('暂无记录')
                    }
                })
            });
            map.addOverlay(pointCollection);  // 添加Overlay
        } else {
            alert('请在chrome、safari、IE8+以上浏览器查看本示例');
        }
    }

    // 定位失败显示苏州地图
    function capital() {
        map.clearOverlays();
        map.centerAndZoom(new BMap.Point(120.628564,31.312588),13);
        map.enableScrollWheelZoom(true);   // 创建标注        
    } 
})