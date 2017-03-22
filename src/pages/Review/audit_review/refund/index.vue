<template>
  <el-col>
    <!--筛选栏-->
    <!--结款申请-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="100px">
          <el-form-item label="团购券号码：">
            <el-col :span="19">
              <el-input v-model="token" placeholder="请输入团购券号码"></el-input>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button type="primary" @click="getDatas">&emsp;查 询&emsp;</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>

      <!--内容-->
      <el-col :span="24" v-if="tokenInfo" style="text-align: center">
        <h3>团购券 <span id="couponNum">{{token}}</span></h3>
        <h2 :style="{color:textColor}">{{status}}</h2>
        <el-col :span="10" :offset="7">
          <el-form id="form" ref="form" label-width="125px" label-position="left">
            <br/>
            <el-form-item label="项目名称：">
              <span class="info">{{item}}</span>
            </el-form-item>

            <el-form-item label="购买时间：">
              <span class="info">{{buy_time}}</span>
            </el-form-item>

            <el-form-item label="消费时间：" v-show="consume_time">
              <span class="info">{{consume_time}}</span>
            </el-form-item>

            <el-form-item label="结算时间：" v-show="billing_time">
              <span class="info">{{billing_time}}</span>
            </el-form-item>

            <el-form-item label="消费者购买金额：">
              <span class="info">{{deserve}}</span>
            </el-form-item>

            <el-form-item label="上线日期：">
              <span class="info">{{create_time}}</span>
            </el-form-item>

            <el-button type="primary" @click="refundDialog = true">&emsp;退 款&emsp;</el-button>
          </el-form>
        </el-col>
      </el-col>
    </el-col>

    <!--退款-->
    <el-dialog size="tiny" v-model="refundDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p style="font-size: 17px">是否退款该团购券 {{token}}</p>
          <div>
            <el-input type="textarea" placeholder="请输入退款原因"
                      v-modal="refund_reason"></el-input>
          </div>
          <br/>
          <div class="buttonGroup" style="margin-bottom:20px">
            <el-button type="primary" size="large"
                       @click="refund" style="margin-right:20px">确 认</el-button>
            <el-button size="large" @click="refundDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-col>
</template>

<script>
  import inputSearch from "../../../../components/search/input/index";
  import dialogTips from "../../../../components/dialogTips/index.vue";
  import {CHECKVERIFY_REFUND_SEARCH_URL,
    CHECKVERIFY_REFUND_URL} from "../../../../common/interface";
  import {modalHide} from "../../../../common/common";

  export default {
    props: {
      tab: String
    },
    data() {
      return {
        token: "",           // 团购券号码
        tokenInfo: false,     // 显示团购券内容
        status: "",          // 团购券状态
        refund_reason: "",   // 退款原因
        refundDialog: false,
        isRight: true,       // 提示框
        tips: "操作成功！",
        tipsVisible: false,
        item: "",       // 项目名称
        refundnum: "",  // 项目id
        buy_time: "",   // 购买时间
        consume_time: "",    // 消费时间
        billing_time: "",    // 结算时间
        deserve: "",      // 消费者购买金额
        create_time: ""   // 上线日期
      };
    },
    computed: {
      textColor: function() {
        var self = this;
        var res = "#13CE66";
        if (self.status === "S") {   // 已退款
          res = "#FF4949";
        }
        return res;
      }
    },
    methods: {
      /* 获取数据 */
      getDatas: function() {
        var self = this;
        self.$http.get(CHECKVERIFY_REFUND_SEARCH_URL + "?token=" + self.token).then(function(response) {
          if (response.body.success) {
            self.tokenInfo = true;
            var datas = response.body.content;
            self.status = datas.status;     // 团购券状态
            if (datas.status === "S") {    // 已退款
              self.refundnum = datas.refundnum;          // 项目id
              self.consume_time = datas.consume_time;    // 消费时间
              self.billing_time = datas.billing_time;    // 结算时间
            }
            // datas.status === "UN" 验证
            self.item = datas.item;        // 项目名称
            self.buy_time = datas.buy_time;        // 购买时间
            self.deserve = datas.deserve;           // 消费者购买金额
            self.create_time = datas.create_time;   // 上线日期
          }
        });
      },

      // 退款
      refund: function() {
        var self = this;
        var formData = new FormData();
        formData.append("token", self.token);
        formData.append("refundnum", self.refundnum);
        if (self.refund_reason) {

        } else {
          formData.append("refund_reason", self.refund_reason);
        }
        self.$http.post(CHECKVERIFY_REFUND_URL, formData)
          .then(function(response) {
            if (response.body.success) {
              self.refundDialog = false;
              self.tipsVisible = true;
              modalHide(function() {
                self.tipsVisible = false;
              });
            }
          });
      }
    },
    components: {
      inputSearch,
      dialogTips
    }
  };
</script>

<style scoped>
  .info{
    border: 1px solid rgb(210, 212, 215);
    padding: 0 40px;
    width: 80%;
    display: inline-block;
  }
</style>
