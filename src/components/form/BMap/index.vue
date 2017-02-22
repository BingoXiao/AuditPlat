<template>
  <el-col span="24" id="mapshow">
    <small class="map_tips">
      为了更快的通过审核，请在地图上精确的标记您的位置
    </small>

    <el-row class="map_wrapper">
      <div id="allmap" style="width:100%;margin:auto;height:400px;"></div>
      <div id="searchResultPanel" style="display: none;"></div>
    </el-row>
  </el-col>
</template>

<script>
  import BMap from "BMap"

  // 根据提供的坐标点显示位置
  function showLocal(map, po) {
    var str = po.split(",")
    var newPoint = new BMap.Point(str[0], str[1])
    var marker = new BMap.Marker(newPoint)  // 创建标注
    map.clearOverlays()
    map.panTo(newPoint)
    map.addOverlay(marker)       // 将标注添加到地图中
  }

  export default{
    props: ["address", "point"],
    data() {
    },
    mounted() {
      var self = this
      // 百度地图API功能
      var map = new BMap.Map("allmap")
      var point = new BMap.Point(113.897649, 22.49876)
      var marker = new BMap.Marker(point)  // 创建标注

      map.centerAndZoom(point, 18)
      var geoc = new BMap.Geocoder()

      // 鼠标点击获取坐标点
      map.addEventListener("click", function(e) {
        var pt = e.point
//        alert(e.point.lng + "," + e.point.lat)
        geoc.getLocation(pt, function(rs) {
          var addComp = rs.addressComponents
          if (addComp.city !== "深圳市") {
            alert("抱歉！目前仅支持选择深圳地区！")
            return false
          } else {
            var marker = new BMap.Marker(pt)
            map.clearOverlays() // 清除标注
            map.addOverlay(marker) // 将标注添加到地图中
//            marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 创建一个跳动的红点
            // 将地址解析结果显示在地图上
            document.getElementById("position").value = pt.lng + "," + pt.lat
          }
        })
      })

      var local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
      })

      local.search(self.address)
    }
  }

</script>


<style scoped>
  .map_tips {
    font-size: 10px;
    color: #a5a5a5;
  }

  .map_wrapper {
    margin-top: 5px;
  }
</style>
