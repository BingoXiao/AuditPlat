<template>
  <el-row class="panel-center">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <el-row style="padding-top: 10px;">
          <tab-component :tabs="tabs" :which="which"></tab-component>
          <div class="returnTop">
            <span @click="backTo" style="cursor: pointer">
              <i class="iconfont icon-xiangzuo" style="font-size: 15px;"></i>
              回到{{$route.name}}</span>
          </div>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :span="16" :offset="4">
            <el-form id="form" ref="form" label-width="130px" label-position="left">
              <br/>
              <el-form-item label="商家账号：" required>
                <span class="info">{{account}}</span>
              </el-form-item>

              <el-form-item label="项目名称：" required>
                <div v-for="item in items_name" class="infoWrapper">
                  <span class="info" >{{item}}</span>
                </div>
              </el-form-item>

              <el-form-item label="财务联系人：" required>
                <span class="info">{{billing_account_name}} ( {{billing_account_tel}} )</span>
              </el-form-item>

              <el-form-item label="财务类型：" required>
                <span class="info">{{bank_account_type}}</span>
              </el-form-item>

              <el-form-item label="开户名称：" required>
                <span class="info">{{bank_account_name}}</span>
              </el-form-item>

              <el-form-item label="银行账号：" required>
                <span class="info">{{bank_account_number}}</span>
              </el-form-item>

              <el-form-item label="开户银行城市：" required>
                <span class="info">{{province_name}} - {{city_name}}</span>
              </el-form-item>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="开户银行：" required>
                    <span class="info" style="padding-right: 30px;">{{bank_name}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户行名称：" required>
                    <span class="info">{{bank_branch_name}}</span>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-row v-if="real_name">
                <p style="font-weight: normal" required>身份信息</p>
                <el-form-item label="上传清晰证件照片：" label-width="160px"></el-form-item>
                <el-form-item label=" 证件类型：" required>
                  <span class="info">{{cert_type}}</span>
                </el-form-item>

                <el-form-item label=" 真实姓名：" required>
                  <span class="info">{{real_name}}</span>
                </el-form-item>

                <el-form-item label=" 证件号码：" required>
                  <span class="info">{{card_code}}</span>
                </el-form-item>

                <el-form-item v-if="card_back" label="" label-width="0" required>
                  <el-col :span="10">
                    <show-image :imgWidth="220" :imgHeight="140" :imgSrc="card_front"></show-image>
                  </el-col>
                  <el-col :span="12">
                    <show-image :imgWidth="220" :imgHeight="140" :imgSrc="card_back"></show-image>
                  </el-col>
                </el-form-item>

                <el-form-item v-else label="" label-width="0" required>
                  <show-image :imgWidth="220" :imgHeight="280" :imgSrc="card_front"></show-image>
                </el-form-item>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

        <el-row class="buttonGroup">
          <el-button v-if="showBtn" type="primary" size="large"
                     @click="pass(true)">&emsp;通 过&emsp;</el-button>
          <el-button v-if="showBtn" type="danger" size="large"
                     @click="pass(false)">&emsp;驳 回&emsp;</el-button>
          <el-button type="primary" size="large" @click="backTo">&emsp;返 回&emsp;</el-button>
        </el-row>
      </el-col>
    </el-col>

    <!--提示-->
    <dialogTips ref="resNL"></dialogTips>
  </el-row>
</template>

<script>
  import {CHECKVERIFY_FILLING_URL, CHECKVERIFY_EDITINFO_URL} from "../../../../../common/interface";
  import {getUrlParameters, modalHide} from "../../../../../common/common";
  import tabComponent from "../../../../../components/tabs/inner/index";
  import showImage from "../../../../../components/form/previewImg/index.vue";
  import dialogTips from "../../../../../components/dialogTips/index.vue";

  export default{
    data() {
      return {
        tabs: {
          "view": "查看"
        },
        which: "view",
        showBtn: false,      // 是否显示审核和驳回按钮
        account: "",           // 商家账号
        items_name: [],        // 项目名称
        billing_account_name: "",     // 财务联系人
        billing_account_tel: "",      // 财务联系人电话
        bank_account_type: "",        // 财务类型
        bank_account_name: "",    // 开户名称
        bank_account_number: "",  // 银行卡号
        province_name: "",        // 开户银行城市
        city_name: "",
        bank_name: "",           // 开户银行
        bank_branch_name: "",    // 开户行名称
        real_name: "",    // 证件姓名
        cert_type: "",    // 证件类型
        card_code: "",    // 证件号码
        card_front: "",   // 正面照
        card_back: ""     // 背面照
      };
    },
    mounted() {
      var self = this;
      if (self.$route.name === "商家银行账户修改") {
        self.showBtn = true;
      }
      var id = getUrlParameters(window.location.hash, "id");
      self.$http.get(CHECKVERIFY_FILLING_URL + "?item_id=" + id)
        .then(function(response) {
          if (response.body.success) {
            var data = response.body.content;
            var bankinfo = data.bankinfo;
            self.account = data.account;           // 商家账号
            self.items_name = data.items_name;      // 项目名称
            self.billing_account_name = bankinfo.billing_account_name;   // 财务联系人
            self.billing_account_tel = bankinfo.billing_account_tel;     // 财务联系人电话
            self.bank_account_type = bankinfo.bank_account_type;         // 财务类型
            self.bank_account_name = bankinfo.bank_account_name;         // 开户名称
            self.bank_account_number = bankinfo.bank_account_number;     // 银行账号
            self.province_name = bankinfo.province_name;                 // 开户银行城市
            self.city_name = bankinfo.city_name;
            self.bank_name = bankinfo.bank_name;         // 开户银行
            self.bank_branch_name = bankinfo.bank_branch_name;    // 开户行名称
            self.real_name = bankinfo.real_name;     // 证件姓名
            self.cert_type = bankinfo.cert_type;     // 证件类型
            self.card_code = bankinfo.card_code;     // 证件号码
            self.card_front = bankinfo.card_front;   // 正面照
            self.card_back = bankinfo.card_back;     // 背面照
          }
        });
    },
    methods: {
      // 审核
      // 审核
      pass: function(flag) {
        var self = this;
        let id = getUrlParameters(window.location.hash, "id");
        var formdata = {
          flag: flag,
          item_id: id,
          reject_reason: ""
        };
        var title = "是否驳回该商户银行账户修改？";
        if (flag) {
          title = "是否通过该商户银行账户修改？";
        }
        this.$confirm(title, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false
        }).then(() => {
          self.$http.post(CHECKVERIFY_EDITINFO_URL,
          JSON.stringify(formdata),
          {emulateJSON: true})
          .then(function(response) {
            if (response.body.success) {
              self.$refs.resNL.show({
                isRight: true,
                tips: "操作成功！"
              });
              modalHide(function() {
                self.$refs.resNL.hide();
                self.backTo();
              });
            }
          });
        }).catch(() => {});
      },
      // 返回商家银行账户修改（记录）
      backTo: function() {
        var self = this;
        var htmlSrc = self.$route.path.substring(0, self.$route.path.lastIndexOf("/"));
        self.$router.push({path: htmlSrc});
      }
    },
    components: {
      tabComponent,
      showImage,
      dialogTips
    }
  };
</script>

<style scoped>
  .returnTop{
    position: absolute;
    bottom: 20px;
    right: 0;
    font-size: 15px;
    font-family: "SimHei";
  }
  .info{
    /*border: 1px solid rgb(210, 212, 215);*/
    padding: 5px 80px 5px 0;
    margin: 0;
  }
</style>
