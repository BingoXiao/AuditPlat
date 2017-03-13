<template>
  <el-row class="panel-center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <el-row style="border-bottom: 1px solid #d3ddea; padding-bottom:10px;font-size: 21px">
          <el-col :span="8">
            <p>商务经理：{{bd}}</p>
          </el-col>
          <el-col :span="16" v-if="$route.name === '商家申请审核查看'">
            <p v-if="!reason" style="color:#13CE66">通过</p>
            <p v-else style="color:#FF4949">驳回：{{reason}}</p>
          </el-col>
        </el-row>

        <el-form id="form" ref="form" label-width="100px">
          <show-basic-info :filling="filling"></show-basic-info>
          <show-bl-info :filling="blInfo"></show-bl-info>
          <show-sl-info :filling="slInfo"></show-sl-info>
          <show-check-info :Bank="bankInfo" :ID="idInfo"></show-check-info>
        </el-form>

        <el-col :span="24" class="buttonGroup" style="text-align: left">
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
            <el-button type="primary" size="large"
                       @click="pass(true)" style="margin-right:20px">确 认</el-button>
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
          <el-radio-group v-model="rejectReason" style="line-height: 30px"
                          @change="radioChange">
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
            <el-col :span="24">
              <span v-if="error" class="error">{{error}}</span>
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
            <el-button type="primary" size="large"
                       @click="pass(false)" style="margin-right:20px">发 送</el-button>
            <el-button size="large" @click="rejectDialog = false">取 消</el-button>
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
  import showBasicInfo from "../module/showBasicInfo/index"
  import showBlInfo from "../../../BD/bus_list/module/showBlInfo/index"
  import showSlInfo from "../../../BD/bus_list/module/showSlInfo/index"
  import showCheckInfo from "../../../BD/bus_register/module/show_check_info/index"
  import {BDREGISTER_EDITFILLING_URL, BDVERIFY_APPLYPASS_URL} from "../../../../common/interface"
  import {modalHide, getUrlParameters} from "../../../../common/common"

  export default{
    data() {
      return {
        showBtn: false,        // 是否显示审核和驳回按钮
        filling: {},           // 信息填充
        bd: "",                // 商务经理
        reason: "",            // 原因
        blInfo: {},            // 营业执照信息
        slInfo: {},            // 许可证信息
        bankInfo: {},          // 银行填充
        idInfo: {},            // 身份填充
        shopName: "",          // 店名
        applynum: "",          // 审编号
        error: "",             // 驳回选择其他原因（文本框未填写时提示）
        rejectReason: "商家信息有误/不真实",
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
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        this.currentView = name
      },
      // 获取信息
      get_info: function(busId) {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        self.$http.get(BDREGISTER_EDITFILLING_URL + "?applynum=" + id)
          .then(function(response) {
            if (response.body.success) {
              var data = response.body.content
              self.filling = data
              self.bankInfo = data.bankinfo
              self.idInfo = data.userinfo
              self.blInfo = data.blinfo
              self.slInfo = data.slinfo
              self.shopName = data.userinfo.account       // 店名
              self.applynum = getUrlParameters(window.location.hash, "id")       // 审编号
              self.bd = data.applyinfo.bd
              self.reason = data.applyinfo.reject_reason || ""
            }
          })
      },
      // 返回商家列表
      backTo: function() {
        var self = this
        var htmlSrc = self.$route.path.substring(0, self.$route.path.lastIndexOf("/"))
        self.$router.push({path: htmlSrc})
      },
      // 驳回选择理由
      radioChange: function() {
        var self = this
        self.error = ""
      },
      // 审核
      pass: function(flag) {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        var formdata = {}
        if (flag) {   // 通过
          formdata = {
            flag: flag,
            applynum: id,
            reject_reason: ""
          }
          self.dialogtips = "审核成功"
        } else {   // 驳回
          formdata = {
            flag: flag,
            applynum: id,
            reject_reason: self.rejectReason
          }
          if (self.rejectReason === "其他(请填写)") {
            if (self.textarea) {
              formdata.reject_reason = self.textarea
              self.error = ""
              self.dialogtips = "发送成功"
            } else {
              self.error = "请选择驳回原因"
            }
          }
        }
        if (!self.error) {
          self.$http.post(BDVERIFY_APPLYPASS_URL,
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
        }
      }
    },
    components: {
      showBasicInfo,
      showBlInfo,
      showSlInfo,
      showCheckInfo
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
