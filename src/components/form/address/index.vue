<template>
  <el-col :span="24">
    <el-col :span="4">
      <el-form-item id="province">
        <el-select v-model="province_value" placeholder="--省--"
                   @change="get_city_list">
          <el-option
            v-for="item in province_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="4" class="selectOffset">
      <el-form-item id="city">
        <el-select v-model="city_value" placeholder="--市--"
                   @change="get_district_list">
          <el-option
            v-for="item in city_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="4" class="selectOffset">
      <el-form-item id="district">
        <el-select v-model="district_value" placeholder="--区/县--"
                   @change="get_city_near_list">
          <el-option
            v-for="item in district_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="4" class="selectOffset">
      <el-form-item id="city_near">
        <el-select v-model="city_near_value" placeholder="--商圈--"
                   @change="get_city_near_data">
          <el-option
            v-for="item in city_near_list"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <span v-if="error" class="error">{{error}}</span>

    <el-col :span="24" style="margin-top: 22px">
      <el-col :span="12">
        <el-input v-model="address_detail" name="businfo.address_detail"
                  placeholder="填写具体的位置（精确至门牌号），请与执照地址保持一致" @change="clear_error">
        </el-input>
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
        city_near_list: [],
        address_detail: "",
        address_point: "",
        error: ""
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
            self.address_point = pt.lng + "," + pt.lat
            self.clear_error()
          }
        })
      })

      window.local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
      })
    },
    methods: {
      clear_error: function() {
        var self = this
        self.error = ""
        document.getElementById("province").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
        document.getElementById("city").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
        document.getElementById("district").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
        document.getElementById("city_near").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)"
        document.getElementsByName("businfo.address_detail")[0].style.borderColor = "rgb(191, 203, 217)"
      },
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
        self.$http.get(CITY_URL + "?province_id=" + value).then(function(response) {
          if (response.data.success) {
            self.city_list = response.data.content
          }
        })
        self.clear_error()
      },
      /* 获取区/县列表 */
      get_district_list: function(value) {
        var self = this
        self.$http.get(DISTRICT_URL + "?city_id=" + value).then(function(response) {
          if (response.data.success) {
            self.district_list = response.data.content
          }
        })
        self.clear_error()
      },
      /* 获取商圈列表 */
      get_city_near_list: function(value) {
        var self = this
        self.$http.get(CITYNEAR_URL + "?district_id=" + value).then(function(response) {
          if (response.data.success) {
            self.city_near_list = response.data.content
          }
        })
        self.clear_error()
      },
      /* 获取商圈数据 */
      get_city_near_data: function(value) {
        var self = this
        self.clear_error()
      },
      /* 验证 */
      addressValidate: function() {
        var self = this
        if (self.province_value === "") {
          self.error = "请选择门店地址"
          document.getElementById("province").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          document.getElementById("city").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          document.getElementById("district").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          document.getElementById("city_near").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
        } else {
          if (self.city_value === "") {
            self.error = "请选择门店地址"
            document.getElementById("city").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
            document.getElementById("district").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
            document.getElementById("city_near").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
          } else {
            if (self.district_value === "") {
              self.error = "请选择门店地址"
              document.getElementById("district").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
              document.getElementById("city_near").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
            } else {
              if (self.city_near_value === "") {
                self.error = "请选择门店地址"
                document.getElementById("city_near").getElementsByTagName("input")[0].style.borderColor = "#ff4949"
              } else {
                if (self.address_detail === "") {
                  self.error = "请填写完整门店地址"
                  document.getElementsByName("businfo.address_detail")[0].style.borderColor = "#ff4949"
                } else {
                  if (self.address_point === "") {
                    self.error = "请在地图上定位当前地址"
                  } else {
                    self.clear_error()
                  }
                }
              }
            }
          }
        }

        if (!self.error) {
          var para = {
            name: "address",
            value: {
              select: [self.province_value, self.city_value, self.district_value, self.city_near_value],
              point: self.address_point
            }
          }
          self.$emit("addressValidate", "address_flag", para, true)
        } else {
          self.$emit("addressValidate", "address_flag", false)
        }
      },

      /* 定位标记 */
      localAddress: function(address) {
        var self = this
        var add = document.getElementById("province").getElementsByTagName("input")[0].value +
          document.getElementById("city").getElementsByTagName("input")[0].value +
          document.getElementById("district").getElementsByTagName("input")[0].value +
          document.getElementById("city_near").getElementsByTagName("input")[0].value +
            self.address_detail
        local.search(add)
      }
    }
  }
</script>

<style scoped>
  .selectOffset{
    margin-left: 15px;
  }

  .map_tips {
    font-size: 10px;
    color: #a5a5a5;
  }

  .map_wrapper {
    margin-top: 5px;
  }
</style>
