<template>
  <el-row class="panel-center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <el-row style="border-bottom: 1px solid #d3ddea; padding-bottom:10px;font-size:21px">
          <el-col :span="8">
            <p>商家账号：{{shopName}}</p>
          </el-col>
          <el-col :span="16" v-if="$route.name === '商家信息修改审核查看'">
            <p v-if="reject_reason" style="color:#FF4949">驳回：{{reject_reason}}</p>
            <p v-else style="color:#13CE66">通过</p>
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
              <div class="info">{{resNew.name}}</div>
              <div class="info old" v-if="resOld.name !== resNew.name">原始数据：{{resOld.name}}</div>
            </el-form-item>

            <el-form-item label="门店号码：" required>
              <div>
                <span class="info">{{resNew.tel[0]}}&emsp;</span>
                <span type="text" v-if="resNew.tel[1]" class="old" style="cursor: pointer"
                      @click="resNew.telVisible = !resNew.telVisible">更多</span>
                <div v-show="resNew.telVisible">
                  <ul class="telUl">
                    <li v-for="(item, index) in resNew.tel">号码{{index+1}}：{{item}}</li>
                  </ul>
                </div>
              </div>
              <div>
                <span class="info old" v-if="telFlag">
                  原始数据：{{resOld.tel[0]}}&emsp;
                </span>
                <span type="text" v-if="resOld.tel[1]" class="old" style="cursor:pointer;"
                      @click="resOld.telVisible = !resOld.telVisible">更多</span>
                <div v-show="resOld.telVisible" style="color:#FF4949">
                  <ul class="telUl">
                    <li v-for="(item, index) in resOld.tel">号码{{index+1}}：{{item}}</li>
                  </ul>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="门店地址：" required>
              <div class="info">{{resNew.province_name}} - {{resNew.city_name}} -
                {{resNew.district_name}} - {{resNew.circle_name}}</div>
              <div class="info">{{resNew.address}}</div>
              <div class="info old" v-if="addressFlag">
                原始数据：{{resOld.province_name}} - {{resOld.city_name}} -
                {{resOld.district_name}} - {{resOld.circle_name}}
                ( {{resOld.address}} )
              </div>
            </el-form-item>

            <el-form-item label="门店分类：" required>
              <div class="info">美食 > {{resNew.category_parent_name}}<span v-if="resNew.category_name"> > </span>
                {{resNew.category_name}}</div>
              <div class="info" v-if="classFlag">美食 > {{resOld.category_parent_name}}<span v-if="resOld.category_name"> > </span>
                {{resOld.category_name}}</div>
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
            <el-form-item label-width="10px" required>
              <div class="info" v-for="(item, index) in resNew.open_hours">
                <el-col :span="3">每周营业时间{{index+1}}：</el-col>
                <el-col :span="20">
                  <open-hour :open_hours="resNew.open_hours[index]"></open-hour>
                </el-col>
              </div>
            </el-form-item>
            <el-row class="info old" v-if="openFlag">
              <el-col :span="2" :offset="1">
                <span>原始数据：</span>
              </el-col>
              <el-col :span="18">
                <ul class="telUl old">
                  <li v-for="(item, index) in resOld.open_hours">
                    每周营业时间{{index + 1}}：&emsp;{{item.weekString}}
                    （ {{item.begin}} 至 {{item.end}} ）
                  </li>
                </ul>
              </el-col>
            </el-row>

            <h3 class="formTitle">营业状态</h3>
            <el-form-item label="状态：" required>
              <div class="info">{{resNew.open_status}}</div>
              <div class="info old" v-if="resNew.open_status !== resOld.open_status">
                原始数据：{{resOld.open_status}}
              </div>
            </el-form-item>

            <el-form-item label="人均：" required>
              <div class="info">{{resNew.capita_consumption}}</div>
              <div class="info old" v-if="resNew.capita_consumption !== resOld.capita_consumption">
                原始数据：{{resOld.capita_consumption}}
              </div>
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
  import openHour from "../../../../components/form/openHour/index"
  import {BDVERIFY_FILLING_URL, BDVERIFY_EDITPASS_URL} from "../../../../common/interface"
  import {getValue, modalHide, compareArrData, compareObjArrData, getUrlParameters} from "../../../../common/common"

  let map, point, marker
  export default{
    data() {
      return {
        showBtn: false,      // 是否显示审核和驳回按钮
        reject_reason: "",          // 原因
        shopName: "",        // 店名
        applynum: "",        // 审编号
        name: "",            // 姓名
        phonenum: "",        // 手机
        resNew: {            // 新数据
          name: "",       // 门店名称
          tel: [],           // 门店座机
          telVisible: false, // 更多电话
          province_name: null,    // 省
          city_name: null,        // 市
          district_name: null,    // 区
          circle_name: null,      // 商圈
          category_parent_name: null,    // 二级分类
          category_name: null,    // 三级分类
          address: "",            // 门店地址
          address_point: "",      // 门店坐标
          open_hours: [],         // 营业时间
          open_status: "",        // 营业状态
          capita_consumption: ""            // 人均
        },
        telFlag: false,          // 判断电话是否相同
        addressFlag: false,      // 判断地址是否相同
        classFlag: false,        // 判断分类是否相同
        openFlag: false,         // 判断营业时间是否相同
        resOld: {
          name: "",       // 门店名称
          tel: [],           // 门店座机
          telVisible: false, // 更多电话
          province_name: null,    // 省
          city_name: null,        // 市
          district_name: null,    // 区
          circle_name: null,      // 商圈
          category_parent_name: null,    // 二级分类
          category_name: null,    // 三级分类
          address: "",            // 门店地址
          address_point: "",      // 门店坐标
          open_hours: [],         // 营业时间
          open_status: "",        // 营业状态
          capita_consumption: ""            // 人均
        },
        rejectDialog: false,   // 驳回模态框
        passDialog: false,     // 驳回模态框
        tipsVisible: false,    // 操作提示模态框
        dialogtips: "",        // 操作提示
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
              var data = response.body.content
              var resNew = data.data
              var resOld = data.old_data
              self.reject_reason = data.iteminfo.reject_reason
              var userinfo = data.userinfo
              self.shopName = userinfo.account     // 店名
              self.applynum = getUrlParameters(window.location.hash, "applynum")       // 审编号
              self.name = userinfo.name            // 负责人姓名
              self.phonenum = userinfo.phonenum    // 负责人手机
              self.resNew.name = resNew.name       // 新门店名称
              if (resOld.name) {                   // 旧门店名称
                self.resOld.name = resOld.name
              } else {
                self.resOld.name = resNew.name
              }
              for (let i = 1; i <= 5; i++) {     // 新电话
                if (resNew["tel_" + i]) {
                  self.resNew.tel.push(resNew["tel_" + i])
                }
              }
              for (let i = 1; i <= 5; i++) {     // 旧电话
                if (resOld["tel_" + i]) {
                  self.resOld.tel.push(resOld["tel_" + i])
                }
              }
              self.telFlag = !compareArrData(self.resOld.tel, self.resNew.tel)
              self.resNew.province_name = resNew.province_name    // 新地址
              self.resNew.city_name = resNew.city_name
              self.resNew.district_name = resNew.district_name
              self.resNew.circle_name = resNew.circle_name
              self.resOld.province_name = resOld.province_name   // 旧地址
              self.resOld.city_name = resOld.city_name
              self.resOld.district_name = resOld.district_name
              self.resOld.circle_name = resOld.circle_name
              if (resNew.district_name !== resOld.district_name || resNew.circle_name !== resOld.circle_name) {
                self.addressFlag = true
              }
              self.resNew.category_parent_name = resNew.category_parent_name    // 新分类
              self.resNew.category_name = resNew.category_name    // 新分类
              self.resOld.category_parent_name = resOld.category_parent_name    // 新分类
              self.resOld.category_name = resOld.category_name    // 新分类
              if (resNew.category_parent_name !== resOld.category_parent_name || resNew.category_name !== resOld.category_name) {
                self.classFlag = true
              }
              self.showLocal(resNew.address_point)   // 地图定位
              self.resNew.open_hours = resNew.open_hours    // 新营业时间
              let oldArr = resOld.open_hours    // 旧营业时间
              let oldTime = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
              for (let i = 0; i < oldArr.length; i++) {
                let item = oldArr[i].week.split("")
                var str = ""
                for (let j = 0; j < item.length; j++) {
                  if (item[j] === "1") {
                    str += oldTime[j] + "、"
                  }
                }
                oldArr[i].weekString = str.substr(0, str.length - 1)
              }
              self.resOld.open_hours = oldArr
              self.openFlag = !compareObjArrData(resNew.open_hours, resOld.open_hours)
              let running = {
                "RO": "营业中",
                "RC": "已关闭",
                "RE": "筹备中",
                "RP": "暂停营业"
              }
              self.resNew.open_status = running[resNew.running_status]   // 新营业状态
              self.resOld.open_status = running[resOld.running_status]   // 旧营业状态
              self.resNew.capita_consumption = resNew.capita_consumption // 新人均
              self.resOld.capita_consumption = resOld.capita_consumption // 新人均
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
      // 根据提供的坐标点显示位置
      showLocal: function(po) {
        var str = po.split(",")
        var newPoint = new BMap.Point(str[0], str[1])
        var marker = new BMap.Marker(newPoint)
        map.clearOverlays()
        map.panTo(newPoint)
        map.addOverlay(marker)
      }
    },
    components: {
      openHour
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

  .old{
    font-size: 13px;
    color: #ff4949;
  }

  .telUl{
    list-style: none;
    padding-left: 0;
    margin-top: 0;
  }

  .telUl li{
    font-size: 13px;
  }
</style>
