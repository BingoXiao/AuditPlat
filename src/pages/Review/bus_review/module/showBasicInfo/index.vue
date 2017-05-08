<template>
  <el-form ref="basicForm" label-width="100px">
    <h3 class="formTitle">商家负责人信息</h3>
    <el-row>
      <el-col :span="6">
        <el-form-item label="商家姓名：" required>
          <span class="info">{{name}}</span>
        </el-form-item>
      </el-col>

      <el-col :span="8" :offset="1">
        <el-form-item label="商家手机：" required>
          <span class="info">{{phonenum}}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="商家分类：" required>
      <span class="info">{{lclass}} > {{md_class}} {{sm_class}}</span>
    </el-form-item>

    <el-form-item label="商家属性：" required>
      <el-col :span="3">
        <radio-check :selected="type==='A'"><span>A类</span></radio-check>
      </el-col>
      <el-col :span="3">
        <radio-check :selected="type==='B'"><span>B类</span></radio-check>
      </el-col>
    </el-form-item>

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


    <h3 class="formTitle">门店图片</h3>
    <el-form-item label="门店LOGO" required>
      <show-image :imgWidth="140" :imgHeight="140" :imgSrc="logo_url"></show-image>
    </el-form-item>

    <el-form-item label="门店招牌" required label-width="90px">
      <show-image :imgWidth="220" :imgHeight="140" :imgSrc="brand_url"></show-image>
    </el-form-item>

    <el-form-item label="门店环境" required label-width="90px">
      <show-image :imgWidth="220" :imgHeight="140" :imgSrc="indoor_url"></show-image>
    </el-form-item>
  </el-form>
</template>

<script>
  import BMap from "BMap";
  import showImage from "../../../../../components/form/previewImg/index.vue";
  import radioCheck from "../../../../../components/radio/index.vue";
  import {PROVINCE_URL, CITY_URL, DISTRICT_URL, CITYNEAR_URL, CATEGORY_URL,
    LCLASS_URL, SCLASS_URL} from "../../../../../common/interface";
  import {getValue} from "../../../../../common/common";

  let map, point, marker;
  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      return {
        tipsVisible: false,
        type: "",          // 分类
        name: "",          // 姓名
        phonenum: "",      // 手机
        busname: "",       // 门店名称
        tel: "",           // 门店座机
        province: null,    // 省
        city: null,        // 市
        district: null,    // 区
        city_near: null,   // 商圈
        lclass: null,       // 一级分类
        md_class: null,     // 二级分类
        sm_class: null,     // 三级分类
        address_details: "",     // 门店地址
        address_point: "",       // 门店坐标
        logo_url: "",     // logo图片
        brand_url: "",    // 门店招牌
        indoor_url: ""    // 门店环境
      };
    },
    mounted() {
      var self = this;
      // 百度地图API功能
      map = new BMap.Map("allmap");
      point = new BMap.Point(114.025974, 22.546054);
      marker = new BMap.Marker(point);  // 创建标注
      map.centerAndZoom(point, 18);

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
    },
    watch: {
      filling: function() {
        var self = this;
        var userinfo = self.filling.userinfo;
        var businfo = self.filling.businfo;
        self.name = userinfo.name;
        self.phonenum = userinfo.phonenum;
        self.type = businfo.type;
        self.busname = businfo.busname;      // 门店名称
        self.tel = businfo.tel;              // 门店座机
        if (businfo.tel) {
          self.tel = businfo.tel;
        } else {
          self.tel = "无";
        }
        self.get_lclass(businfo.lclass_id, businfo.mclass_id, businfo.sclass_id);
        self.get_province(businfo.province_id, businfo.city_id, businfo.district_id, businfo.city_near_id);
        self.address_details = businfo.address_details;     // 门店地址
        self.address_point = businfo.address_point;         // 门店坐标
        self.showLocal(businfo.address_point);
        self.logo_url = businfo.logo_url;         // logo图片
        self.brand_url = businfo.brand_url;       // 门店招牌
        self.indoor_url = businfo.indoor_url;     // 门店环境
      }
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
      radioCheck,
      showImage
    }
  };
</script>

<style scoped>
  .iconfont{
    font-size: 18px;
    cursor: pointer;
  }
</style>
