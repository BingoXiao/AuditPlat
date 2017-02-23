<template>
  <el-col :span="24">
    <el-select v-model="province_value" placeholder="--省--" class="small" clearable
               @change="get_city_list" name="businfo.province_id">
      <el-option
        v-for="item in province_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="city_value" placeholder="--市--" class="small" clearable
               @change="get_district_list" name="businfo.city_id">
      <el-option
        v-for="item in city_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="district_value" placeholder="--区/县--" class="small" clearable
               @change="get_city_near_list" name="businfo.district_id">
      <el-option
        v-for="item in district_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="city_near_value" placeholder="--商圈--" class="small"
               clearable name="businfo.city_near_id">
      <el-option
        v-for="item in city_near_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-col :span="24" style="margin-top: 22px">
      <el-col :span="12">
        <el-input name="businfo.address_detail"
                  placeholder="填写具体的位置（精确至门牌号），请与执照地址保持一致"></el-input>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button type="primary" @click="localAddress">定位标记</el-button>
      </el-col>
    </el-col>

    <el-col :span="24" id="mapshow" style="margin-left: -80px">
      <small class="map_tips">
        为了更快的通过审核，请在地图上精确的标记您的位置
      </small>

      <div class="map_wrapper">
        <div id="allmap" style="width:100%;margin:auto;height:400px;"></div>
      </div>
    </el-col>
  </el-col>
</template>

<script>
  import {PROVINCE_URL, CITY_URL, DISTRICT_URL, CITYNEAR_URL} from "../../../common/interface"
  import BMap from "BMap"

  export default{
    props: ["options"],
    data() {
      return {
        province_value: "",
        city_value: "",
        district_value: "",
        city_near_value: "",
        province_list: [],
        city_list: [],
        district_list: [],
        city_near_list: []
      }
    },
    mounted: function() {
      var self = this
      self.get_province_list()
//      if (self.options.length > 0) {
//        self.province_value = self.options[0]
//        self.city_value = self.options[1]
//        self.district_value = self.options[2]
//        self.city_near_value = self.options[3]
//      }

      // 百度地图API功能
      var map = new BMap.Map("allmap")
      var point = new BMap.Point(114.025974, 22.546054)
      var marker = new BMap.Marker(point)  // 创建标注
      map.centerAndZoom(point, 18)
      var geoc = new BMap.Geocoder()

      // 根据提供的坐标点显示位置
      if (self.$store.state.map_point) {
        let pp = self.$store.state.map_point
        let str = pp.split(",")
        let newPoint = new BMap.Point(str[0], str[1])
        marker = new BMap.Marker(newPoint)  // 创建标注
        map.clearOverlays()
        map.panTo(newPoint)
        map.addOverlay(marker)       // 将标注添加到地图中
      }
      // 鼠标点击获取坐标点
      /* eslint-disable no-undef */
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
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 创建一个跳动的红点
            // 将地址解析结果显示在地图上
            self.$store.state.map_point = pt.lng + "," + pt.lat
          }
        })
      })

      window.local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
      })
    },
    methods: {
      /* 获取省列表 */
      get_province_list: function() {
        var self = this
        self.$http.get(PROVINCE_URL).then(function(response) {
          if (response.data.success) {
            self.province_list = response.data.content
          }
        })
      },

      /* 获取市列表 */
      get_city_list: function(value) {
        var self = this
        if (!value) {    // 清空
          self.city_list = []
          self.district_list = []
          self.city_near_list = []
          self.city_value = ""
          self.district_value = ""
          self.city_near_value = ""
        } else {         // 选择
          self.$http.get(CITY_URL + "?province_id=" + value).then(function(response) {
            if (response.data.success) {
              self.city_list = response.data.content
            }
          })
        }
      },

      /* 获取区/县列表 */
      get_district_list: function(value) {
        var self = this
        if (!value) {         // 清空
          self.district_list = []
          self.city_near_list = []
          self.district_value = ""
          self.city_near_value = ""
        } else {         // 选择
          self.$http.get(DISTRICT_URL + "?city_id=" + value).then(function(response) {
            if (response.data.success) {
              self.district_list = response.data.content
            }
          })
        }
      },

      /* 获取商圈列表 */
      get_city_near_list: function(value) {
        var self = this
        if (!value) {         // 清空
          self.city_near_list = []
          self.city_near_value = ""
        } else {         // 选择
          self.$http.get(CITYNEAR_URL + "?district_id=" + value).then(function(response) {
            if (response.data.success) {
              self.city_near_list = response.data.content
            }
          })
        }
      },

      /* 定位标记 */
      localAddress: function(address) {
        var self = this
        var aa = self.province_value + "," + self.city_value + "," +
          self.district_value + "," + self.city_near_value
//        local.search(address)
      }
    }
  }
</script>

<style scoped>
  .small {
    width: 130px;
  }

  .map_tips {
    font-size: 10px;
    color: #a5a5a5;
  }

  .map_wrapper {
    margin-top: 5px;
  }
</style>
