<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <br/>
        <el-form id="form" ref="form" label-width="100px">
          <h3 class="formTitle">商家负责人信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商家姓名：" required>
                <span class="info">{{name}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="1">
              <el-form-item label="商家手机：" required>
                <span class="info">{{phonenum}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <h3 class="formTitle">门店信息</h3>
          <el-form-item label="门店名称：" required>
            <span class="info">{{busname}}</span>
          </el-form-item>

          <el-form-item label="门店座机：">
            <span class="info">{{tel}}</span>
          </el-form-item>

          <el-form-item label="门店地址：" required>
            <div class="info">{{province}} - {{city}} - {{district}} - {{city_near}}</div>
            <div class="info">{{address_details}}</div>
          </el-form-item>

          <el-form-item label-width="0" id="mapshow">
            <small class="map_tips">
              为了更快的通过审核，请在地图上精确的标记您的位置
            </small>
            <div class="map_wrapper">
              <div id="allmap" class="allmap"></div>
              <div class="mapCover"></div>
            </div>
          </el-form-item>

          <h3 class="formTitle">商家信息</h3>
          <el-form-item label="商家分类：" required>
            <span class="info">{{lclass}} > {{md_class}} {{sm_class}}</span>
          </el-form-item>

          <el-form-item label="营业执照:" label-width="90px" required v-if="bl_image_url">
            <show-image :imgWidth="220" :imgHeight="140" :imgSrc="bl_image_url"></show-image>
          </el-form-item>

          <el-form-item label="餐饮服务许可证:" label-width="130px" required  v-if="sl_image_url">
            <show-image :imgWidth="220" :imgHeight="140" :imgSrc="sl_image_url"></show-image>
          </el-form-item>

          <el-form-item label="团购内容：">
            <pre class="info">{{group_buying_info}}</pre>
          </el-form-item>

          <el-form-item label="人均：" required>
            <span class="info">{{cost_per_person}} 元</span>
          </el-form-item>

          <el-form-item label="月销售额：" v-if="sale_per_month">
            <span class="info">{{sale_per_month}} 元/月</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import BMap from "BMap";
  import showImage from "../../../../components/form/previewImg/index.vue";
  import {PROVINCE_URL, CITY_URL, DISTRICT_URL, CITYNEAR_URL,
    BDREGISTER_APPLFILLING_URL, CATEGORY_URL, LCLASS_URL, SCLASS_URL} from "../../../../common/interface";
  import {getValue, getUrlParameters} from "../../../../common/common";

  /* eslint-disable no-unused-vars */
  let map, point, marker, geoc;
  export default{
    data() {
      return {
        name: "",          // 姓名
        phonenum: "",      // 手机
        busname: "",       // 门店名称
        tel: "",         // 门店座机
        province: null,    // 省
        city: null,        // 市
        district: null,    // 区
        city_near: null,   // 商圈
        address_details: "",      // 门店地址
        address_point: "",       // 门店坐标
        lclass: null,       // 一级分类
        md_class: null,     // 二级分类
        sm_class: null,     // 三级分类
        group_buying_info: "",   // 团购内容
        cost_per_person: "",     // 人均
        sale_per_month: "",      // 月销售额
        bl_image_url: "",        // 营业执照图片
        sl_image_url: ""         // 许可证图片
      };
    },
    mounted() {
      var self = this;
      let id = getUrlParameters(window.location.hash, "id");
      // 百度地图API功能
      map = new BMap.Map("allmap");
      point = new BMap.Point(114.025974, 22.546054);
      marker = new BMap.Marker(point);  // 创建标注
      map.centerAndZoom(point, 18);
      geoc = new BMap.Geocoder();

      // 根据提供的坐标点显示位置
      if (self.$store.state.map_point) {
        let pp = self.$store.state.map_point;
        let str = pp.split(",");
        let newPoint = new BMap.Point(str[0], str[1]);
        marker = new BMap.Marker(newPoint);  // 创建标注
        map.clearOverlays();
        map.panTo(newPoint);
        map.addOverlay(marker);      // 将标注添加到地图中
      }
      window.local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
      });

      self.$http.get(BDREGISTER_APPLFILLING_URL + "?applynum=" + id)
        .then(function(response) {
          if (response.body.success) {
            var userinfo = response.body.content.userinfo;
            var businfo = response.body.content.businfo;
            var blinfo = response.body.content.blinfo;
            var slinfo = response.body.content.slinfo;
            self.name = userinfo.name;           // 商家姓名
            self.phonenum = userinfo.phonenum;    // 商家手机
            self.busname = businfo.busname;      // 门店名称
            if (businfo.tel) {
              self.tel = businfo.tel;            // 门店名称
            } else {
              self.tel = "无";
            }
            self.get_province(businfo.province_id, businfo.city_id, businfo.district_id, businfo.city_near_id);
            self.address_details = businfo.address_details;     // 门店地址
            self.address_point = businfo.address_point;         // 门店坐标
            self.showLocal(businfo.address_point);
            self.get_lclass(businfo.lclass_id, businfo.mclass_id, businfo.sclass_id);
            self.group_buying_info = businfo.group_buying_info; // 团购内容
            self.cost_per_person = businfo.cost_per_person;     // 人均
            self.sale_per_month = businfo.sale_per_month;       // 月销售额
            if (blinfo.bl_image_url) {
              self.bl_image_url = blinfo.bl_image_url;
            }
            if (slinfo.sl_image_url) {
              self.sl_image_url = slinfo.sl_image_url;
            }
          }
        });
    },
    methods: {
      /* 获取省列表 */
      get_province: function(province, city, district, cityNear) {
        var self = this;
        self.$http.get(PROVINCE_URL).then(function(response) {
          if (response.body.success) {
            var arr = response.body.content;
            self.province = getValue(arr, province, "id", "name");
            self.get_city(province, city, district, cityNear);
          }
        });
      },
      /* 获取市列表 */
      get_city: function(province, city, district, cityNear) {
        var self = this;
        self.$http.get(CITY_URL + "?province_id=" + province).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            if (!self.flag) {
              self.city = getValue(arr, city, "id", "name");
              self.get_district(city, district, cityNear);
            }
          }
        });
      },
      /* 获取区/县列表 */
      get_district: function(city, district, cityNear) {
        var self = this;
        self.district_value = "";
        self.city_near_value = "";
        self.$http.get(DISTRICT_URL + "?city_id=" + city).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.district = getValue(arr, district, "id", "name");
            self.get_city_near(district, cityNear);
          }
        });
      },
      /* 获取商圈列表 */
      get_city_near: function(district, cityNear) {
        var self = this;
        self.city_near_value = "";
        self.$http.get(CITYNEAR_URL + "?district_id=" + district).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.city_near = getValue(arr, cityNear, "id", "name");
          }
        });
      },
      // 根据提供的坐标点显示位置
      showLocal: function(po) {
        var str = po.split(",");
        var newPoint = new BMap.Point(str[0], str[1]);
        var marker = new BMap.Marker(newPoint);
        map.clearOverlays();
        map.panTo(newPoint);
        map.addOverlay(marker);
      },
      // 获取分类
      get_lclass: function(lclass, mclass, sclass) {
        var self = this;
        self.$http.get(CATEGORY_URL).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.lclass = getValue(arr, lclass, "id", "name");
            self.get_md_class(lclass, mclass, sclass);
          }
        });
      },
      // 二级分类
      get_md_class: function(lclass, mclass, sclass) {
        var self = this;
        self.$http.get(LCLASS_URL + "?lclass_id=" + lclass).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.md_class = getValue(arr, mclass, "id", "name");
            self.get_sm_class(mclass, sclass);
          }
        });
      },
      // 三级分类
      get_sm_class: function(mclass, sclass) {
        var self = this;
        self.$http.get(SCLASS_URL + "?mclass_id=" + mclass).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            if (arr.length > 0) {
              self.sm_class = "> " + getValue(arr, sclass, "id", "name");
            }
          }
        });
      }
    },
    components: {
      showImage
    }
  };
</script>

<style scoped>
  pre.info{
    border: 1px solid #d7d7d7;
    padding: 0 15px;
  }
</style>
