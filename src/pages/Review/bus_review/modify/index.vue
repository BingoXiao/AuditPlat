<template>
  <el-row class="panel-center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <el-row style="border-bottom: 1px solid #d3ddea; padding-bottom:10px">
          <el-col :span="6">
            <p style="font-size: 21px">商家账号：{{shopName}}</p>
          </el-col>
          <el-col :span="18" v-if="$route.name === '商家申请审核查看'">
            <span v-if="!reason" style="color:#13CE66">通过</span>
            <span v-else style="color:#FF4949">驳回：{{reason}}</span>
          </el-col>
        </el-row>

        <el-col :span="24" class="buttonGroup" style="text-align: left">
          <el-form ref="basicForm" label-width="100px">
            <h3 class="formTitle">合作信息</h3>
            <el-form-item label="负责人姓名：" label-width="120px" required>
              <span class="info">{{name}}</span>
            </el-form-item>

            <el-form-item label="负责人手机：" label-width="120px" required>
              <span class="info">{{phonenum}}</span>
            </el-form-item>

            <h3 class="formTitle">门店基本信息</h3>
            <el-form-item label="门店名称：" required>
              <span class="info">{{busname}}</span>
            </el-form-item>

            <el-form-item label="门店号码：">
              <span class="info">{{tel}}</span>
            </el-form-item>

            <el-form-item label="门店地址：" required>
              <div class="info">{{province}} - {{city}} - {{district}} - {{city_near}}</div>
              <div class="info">{{address_details}}</div>
            </el-form-item>

            <el-form-item label="门店分类：" required>
              <span class="info">{{lclass}} > {{md_class}} {{sm_class}}</span>
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


            <h3 class="formTitle">营业时间</h3>
            <el-form-item label="门店名称：" required>
              <span class="info">{{busname}}</span>
            </el-form-item>

            <h3 class="formTitle">营业状态</h3>
            <el-form-item label="状态：" required>
              <span class="info">{{open_status}}</span>
            </el-form-item>

            <el-form-item label="人均：" required>
              <span class="info">{{avgprice}}</span>
            </el-form-item>
            </el-form>
          <br/>
          <el-button v-if="showBtn" type="primary" size="large" @click="passDialog = true">&emsp;通 过&emsp;</el-button>
          <el-button v-if="showBtn" type="danger" size="large" @click="rejectDialog = true">&emsp;驳 回&emsp;</el-button>
          <el-button type="primary" size="large" @click="backTo">&emsp;返 回&emsp;</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!--通过-->
    <el-dialog size="tiny" v-model="passDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p style="font-size: 17px">确认商家<b> "{{shopName}} (申请编号: {{applynum}})" </b>申请审核通过？</p>
          <br/>
          <div class="buttonGroup" style="margin-bottom:20px">
            <el-button type="primary" size="large" @click="pass(true)">确 认</el-button>
            <el-button size="large" @click="passDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--驳回-->
    <el-dialog title="" v-model="rejectDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p style="font-size:16px;letter-spacing:1px;line-height:25px;margin-top: 0">
            亲爱的审核员，您未通过 <b>"{{shopName}} (申请编号: {{applynum}})"</b> 的申请审核，请输入未通过审核原因
          </p>
          <p>未通过原因：</p>
          <el-radio-group v-model="rejectReason" style="line-height: 30px">
            <el-col :span="12">
              <el-radio label="商家信息有误/不真实">商家信息有误/不真实</el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio label="商家资质信息审核不通过">商家资质信息审核不通过</el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio label="负责人信息审核不通过">负责人信息审核不通过</el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio label="其他(请填写)">其他(请填写)</el-radio>
            </el-col>
          </el-radio-group>
          <br/>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            :disabled="rejectReason !== '其他(请填写)'"
            :autosize="{ minRows: 4}"
            v-model="textarea">
          </el-input>
          <br/><br/>
          <div class="buttonGroup" style="margin-bottom:20px">
            <el-button type="primary" size="large" @click="pass(false)">发 送</el-button>
            <el-button type="primary" size="large" @click="rejectDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--提示-->
    <el-dialog v-model="tipsVisible" size="tiny"
               :close-on-click-modal="false" class="tipsModal">
      <div class="mainTips">
        <i class="el-icon-circle-check"></i>
        {{dialogtips}}
        <p class="returnTips">自动返回系统中...</p>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import BMap from "BMap"
  import {BDVERIFY_FILLING_URL, BDVERIFY_EDITPASS_URL,
    PROVINCE_URL, CITY_URL, DISTRICT_URL, CITYNEAR_URL,
    CATEGORY_URL, LCLASS_URL, SCLASS_URL} from "../../../../common/interface"
  import {getValue, modalHide, getUrlParameters} from "../../../../common/common"

  let map, point, marker
  export default{
    data() {
      return {
        showBtn: false,        // 是否显示审核和驳回按钮
        reason: "",            // 原因
        shopName: "",          // 店名
        applynum: "",          // 审编号
        resNew: {},        // 新数据
        resOld: {},        // 旧数据
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
        open_status: "",       // 营业状态
        avgprice: "",          // 人均
        rejectDialog: false,   // 驳回模态框
        passDialog: false,     // 驳回模态框
        tipsVisible: false,    // 操作提示模态框
        dialogtips: "",        // 操作提示
        rejectReason: "商家信息有误/不真实",    // 驳回原因
        textarea: ""
      }
    },
    mounted() {
      var self = this
      self.get_info()
      if (self.$route.name === "商家申请审核") {
        self.showBtn = true
      } else {
        self.showBtn = false
      }
      // 百度地图API功能
      map = new BMap.Map("allmap")
      point = new BMap.Point(114.025974, 22.546054)
      marker = new BMap.Marker(point)  // 创建标注
      map.centerAndZoom(point, 18)

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
      window.local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
      })
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        this.currentView = name
      },
      // 获取信息
      get_info: function() {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        self.$http.get(BDVERIFY_FILLING_URL + "?item_id=" + id)
          .then(function(response) {
            if (response.body.success) {
              var resNew = response.body.content.data
              var resOld = response.body.content.shop_data
              var userinfo = response.body.content.userinfo
              self.shopName = userinfo.account       // 店名
              self.applynum = getUrlParameters(window.location.hash, "applynum")       // 审编号
              self.name = userinfo.name
              self.phonenum = userinfo.phonenum
            }
          })
      },
      // 返回商家列表
      backTo: function() {
        var self = this
        var htmlSrc = self.$route.path.substring(0, self.$route.path.lastIndexOf("/"))
        self.$router.push({path: htmlSrc})
      },
      // 审核
      pass: function(flag) {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        var formdata = {}
        if (flag) {   // 通过
          formdata = {
            flag: flag,
            item_id: id,
            reject_reason: ""
          }
          self.dialogtips = "审核成功"
        } else {   // 驳回
          formdata = {
            flag: flag,
            item_id: id,
            reject_reason: self.rejectReason
          }
          if (self.rejectReason === "其他(请填写)") {
            formdata.reject_reason = self.textarea
          }
          self.dialogtips = "发送成功"
        }
        self.$http.post(BDVERIFY_EDITPASS_URL,
          JSON.stringify(formdata),
          {emulateJSON: true})
          .then(function(response) {
            if (response.body.success) {
              self.passDialog = false
              self.rejectDialog = false
              self.tipsVisible = true
              modalHide(function() {
                self.tipsVisible = false
                self.$router.push({path: "/bus_review/bus_apply"})
              })
            }
          })
      },
      /* 获取省列表 */
      get_province: function(province, city, district, cityNear) {
        var self = this
        self.$http.get(PROVINCE_URL).then(function(response) {
          if (response.body.success) {
            var arr = response.body.content
            self.province = getValue(arr, province, "id", "name")
            self.get_city(province, city, district, cityNear)
          }
        })
      },
      /* 获取市列表 */
      get_city: function(province, city, district, cityNear) {
        var self = this
        self.$http.get(CITY_URL + "?province_id=" + province).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content
            if (!self.flag) {
              self.city = getValue(arr, city, "id", "name")
              self.get_district(city, district, cityNear)
            }
          }
        })
      },
      /* 获取区/县列表 */
      get_district: function(city, district, cityNear) {
        var self = this
        self.district_value = ""
        self.city_near_value = ""
        self.$http.get(DISTRICT_URL + "?city_id=" + city).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content
            self.district = getValue(arr, district, "id", "name")
            self.get_city_near(district, cityNear)
          }
        })
      },
      /* 获取商圈列表 */
      get_city_near: function(district, cityNear) {
        var self = this
        self.city_near_value = ""
        self.$http.get(CITYNEAR_URL + "?district_id=" + district).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content
            self.city_near = getValue(arr, cityNear, "id", "name")
          }
        })
      },
      // 根据提供的坐标点显示位置
      showLocal: function(po) {
        var str = po.split(",")
        var newPoint = new BMap.Point(str[0], str[1])
        var marker = new BMap.Marker(newPoint)
        map.clearOverlays()
        map.panTo(newPoint)
        map.addOverlay(marker)
      },
      // 获取分类
      get_lclass: function(lclass, mclass, sclass) {
        var self = this
        self.$http.get(CATEGORY_URL).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content
            self.lclass = getValue(arr, lclass, "id", "name")
            self.get_md_class(lclass, mclass, sclass)
          }
        })
      },
      // 二级分类
      get_md_class: function(lclass, mclass, sclass) {
        var self = this
        self.$http.get(LCLASS_URL + "?lclass_id=" + lclass).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content
            self.md_class = getValue(arr, mclass, "id", "name")
            self.get_sm_class(mclass, sclass)
          }
        })
      },
      // 三级分类
      get_sm_class: function(mclass, sclass) {
        var self = this
        self.$http.get(SCLASS_URL + "?mclass_id=" + mclass).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content
            if (arr.length > 0) {
              self.sm_class = "> " + getValue(arr, sclass, "id", "name")
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .braSwitch {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
  }

  .backTo{
    padding:6px 15px;
  }
</style>
