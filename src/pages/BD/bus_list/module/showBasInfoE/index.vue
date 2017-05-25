<template>
  <el-col :span="24">
    <el-form :model="basicForm" :rules="basicRules" ref="basicForm"
             label-width="100px">
      <h3 class="formTitle">
        商家负责人信息
        <span v-show="busLock" @click="busLockInfo" class="iconfont icon-suoding"></span>
        <span v-show="!busLock" @click="busLockInfo" class="iconfont icon-jiesuo"></span>
      </h3>
      <el-row>
        <el-col :span="8">
          <el-form-item label="商家姓名：" prop="name" required>
            <el-input v-model.trim="basicForm.name"
                      :disabled="busDisable"
                      :maxlength="30"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7" :offset="1">
          <el-form-item label="商家手机：" prop="phonenum" required>
            <el-input v-model.trim.number="basicForm.phonenum"
                      :disabled="busDisable"
                      :maxlength="11"></el-input>
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

      <h3 class="formTitle">
        营业状态
        <span v-show="openLock" @click="openLockInfo" class="iconfont icon-suoding"></span>
        <span v-show="!openLock" @click="openLockInfo" class="iconfont icon-jiesuo"></span>
      </h3>
      <el-form-item label="状态" required>
        <el-select v-model="Operate_Status" placeholder="请选择"
                   :disabled="openDisable">
          <el-option
            v-for="item in Operate"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-button type="primary" size="large" class="buttonGroup"
               @click="basicValidate">
      &emsp;提 交&emsp;</el-button>


    <!--提示-->
    <dialogTips ref="resNL"></dialogTips>
  </el-col>
</template>

<script>
  import BMap from "BMap";
  import showImage from "../../../../../components/form/previewImg/index.vue";
  import dialogTips from "../../../../../components/dialogTips/index.vue";
  import {PROVINCE_URL, CITY_URL, DISTRICT_URL,
    CITYNEAR_URL, BUSLIST_SUBMIT_URL} from "../../../../../common/interface";
  import {isName, isPhone, getValue, modalHide, getUrlParameters} from "../../../../../common/common";

  let map, point, marker;
  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      // 商家姓名
      var nameV = (rule, value, callback) => {
        var Name = isName(value);
        if (!Name.flag) {
          callback(new Error(Name.error));
        } else {
          callback();
        }
      };
      // 商家手机
      var phoneV = (rule, value, callback) => {
        var Phone = isPhone(value);
        if (!Phone.flag) {
          callback(new Error(Phone.error));
        } else {
          callback();
        }
      };
      return {
        busLock: true,
        openLock: true,
        busDisable: false,
        openDisable: false,
        basicForm: {
          name: "",          // 姓名
          phonenum: ""       // 手机
        },
        basicRules: {
          name: [
            {validator: nameV, trigger: "blur"}
          ],
          phonenum: [
            {validator: phoneV, trigger: "blur"}
          ]
        },
        busname: "",       // 门店名称
        tel: "",           // 门店座机
        province: null,    // 省
        city: null,        // 市
        district: null,    // 区
        city_near: null,   // 商圈
        address_details: "",     // 门店地址
        address_point: "",       // 门店坐标
        logo_url: "",     // logo图片
        brand_url: "",    // 门店招牌
        indoor_url: "",   // 门店环境
        Operate_Status: "",
        Operate: [{
          value: "RO",
          label: "营业中"
        }, {
          value: "RC",
          label: "已关闭"
        }, {
          value: "RE",
          label: "筹备中"
        }, {
          value: "RP",
          label: "暂停营业"
        }]
      };
    },
    mounted() {
      var self = this;
//      let id = getUrlParameters(window.location.hash, "id")
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
        map.addOverlay(marker);       // 将标注添加到地图中
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
        self.basicForm.name = userinfo.name;
        self.basicForm.phonenum = userinfo.phonenum;
        self.busDisable = true;
        self.busname = businfo.busname;     // 门店名称
        self.tel = businfo.tel;              // 门店座机
        if (businfo.tel) {
          self.tel = businfo.tel;
        } else {
          self.tel = "无";
        }
        self.get_province(businfo.province_id, businfo.city_id, businfo.district_id, businfo.city_near_id);
        self.address_details = businfo.address_details;     // 门店地址
        self.address_point = businfo.address_point;         // 门店坐标
        self.showLocal(businfo.address_point);
        self.logo_url = businfo.logo_url;         // logo图片
        self.brand_url = businfo.brand_url;       // 门店招牌
        self.indoor_url = businfo.indoor_url;     // 门店环境
        self.Operate_Status = businfo.status;     // 营业状态
        self.openDisable = true;
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
      // lock商家负责人信息
      busLockInfo: function() {
        var self = this;
        if (self.busLock) {   // 解锁
          self.busDisable = false;
        } else {
          self.busDisable = true;
        }
        self.busLock = !self.busLock;
      },
      // lock营业状态
      openLockInfo: function() {
        var self = this;
        if (self.openLock) {   // 解锁
          self.openDisable = false;
        } else {
          self.openDisable = true;
        }
        self.openLock = !self.openLock;
      },
      // 基本信息验证
      basicValidate: function() {
        var self = this;
        self.$refs.basicForm.validate((valid) => {
          if (valid) {
            this.$confirm("确定修改页面详情?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              var formData = new FormData();
              formData.append("bus_id", getUrlParameters(window.location.hash, "id"));
              formData.append("status", self.Operate_Status);
              formData.append("name", self.basicForm.name);
              formData.append("phonenum", self.basicForm.phonenum);
//              for (var pair of formData.entries()) {
//                console.log(pair[0] + ", " + pair[1])
//              }
              self.$http.post(BUSLIST_SUBMIT_URL, formData)
              .then(function(response) {
                if (response.data.success) {
                  self.$refs.resNL.show({
                    isRight: true,
                    tips: "提交成功！"
                  });
                  modalHide(function() {
                    self.$refs.resNL.hide();
                  });
                }
              });
            });
          }
        });
      }
    },
    components: {
      showImage,
      dialogTips
    }
  };
</script>

<style scoped>
  .iconfont{
    font-size: 18px;
    cursor: pointer;
  }
</style>
