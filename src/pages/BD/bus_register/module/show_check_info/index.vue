<template>
  <el-col :span="24">
    <el-form id="checkForm" :model="checkForm" ref="checkForm"
             label-width="103px" label-position="left">
      <h3 class="formTitle">结款信息</h3>
      <el-form-item label="结款信息:" required>
        <el-col :span="3">
          <radio-check :selected="checkForm.bankRadio"><span>有</span></radio-check>
        </el-col>
        <el-col :span="3">
          <radio-check :selected="!checkForm.bankRadio"><span>无</span></radio-check>
        </el-col>
      </el-form-item>

      <!--银行信息-->
      <div v-show="checkForm.bankRadio">
        <el-row>
          <el-col :span="6">
            <el-form-item label="银行账户：" prop="account_type" required>
              <span class="info">{{checkForm.account_type}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="开户名：" label-width="90px" prop="person_or_company_name" required>
              <span class="info">{{checkForm.person_or_company_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="开户行所在省市：" label-width="140px" required>
          <el-form-item>
            <span class="info">{{checkForm.bank.admiprovince}}-{{checkForm.bank.admicity}}</span>
          </el-form-item>
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item label="银行名称：" required>
              <span class="info">{{checkForm.bank.bank}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="开户行名称：" label-width="120px" required>
              <el-col :span="15">
                <span v-if="checkForm.bank.branchFlag" class="info">{{checkForm.bank.branch}}</span>
                <span v-else class="info">{{checkForm.bank.custom_branch}}</span>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="银行卡号：" prop="bank_account" required>
          <span class="info">{{checkForm.bank_account}}</span>
        </el-form-item>

        <el-row>
          <el-col :span="6">
            <el-form-item label="财务联系人：" label-width="120px" prop="billing_account_name" required>
              <span class="info">{{checkForm.billing_account_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="财务联系人手机：" label-width="150px" prop="billing_account_tel" required>
              <span class="info">{{checkForm.billing_account_tel}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>


    <!--身份信息-->
    <el-form id="IDForm" :model="IDForm" ref="IDForm"
             label-width="103px" label-position="left">
      <h3 class="formTitle">身份信息</h3>
      <el-form-item label="身份信息" required>
        <el-col :span="3">
          <radio-check :selected="IDForm.IDRadio"><span>有</span></radio-check>
        </el-col>
        <el-col :span="3">
          <radio-check :selected="!IDForm.IDRadio"><span>无</span></radio-check>
        </el-col>
      </el-form-item>

      <el-col :span="24" v-show="IDForm.IDRadio">
        <el-form-item label="证件类型：" prop="cert_type" required>
          <span class="info">{{IDForm.cert_type}}</span>
        </el-form-item>

        <el-form-item label="真实姓名：" prop="real_name" required>
          <span class="info">{{IDForm.real_name}}</span>
        </el-form-item>

        <el-form-item label="证件号码：" prop="card_code" required>
          <span class="info">{{IDForm.card_code}}</span>
        </el-form-item>

        <el-form-item label="上传清晰证件照片" label-width="150px" required></el-form-item>
        <!--身份证、港澳通行证、台胞证-->
        <el-form-item label-width="0" v-if="IDForm.card_back_url">
          <el-col :span="6">
            <show-image :imgWidth="220" :imgHeight="140" :imgSrc="IDForm.card_front_url"></show-image>
          </el-col>
          <el-col :span="6">
            <show-image :imgWidth="220" :imgHeight="140" :imgSrc="IDForm.card_back_url"></show-image>
          </el-col>
        </el-form-item>

        <!--护照-->
        <el-form-item label-width="0" v-else>
          <show-image :imgWidth="220" :imgHeight="280" :imgSrc="IDForm.card_front_url"></show-image>
        </el-form-item>
      </el-col>
    </el-form>
  </el-col>
</template>

<script>
  import radioCheck from "../../../../../components/radio/index.vue";
  import showImage from "../../../../../components/form/previewImg/index.vue";
  import {BANK_PROVINCES_URL, BANK_CITIES_URL,
    BANKS_URL, SUBBANKS_URL} from "../../../../../common/interface";
  import {getValue} from "../../../../../common/common";

  export default{
    props: {
      Bank: Object,
      ID: Object
    },
    data() {
      return {
        checkForm: {            // 结款信息
          bankRadio: false,      // 有无银行信息
          bank: {
            admiprovince: null,
            admiprovince_list: [],
            admicity: null,
            admicity_list: [],
            bank: null,
            bank_list: [],
            branch: null,
            branchFlag: true,
            branch_list: [],
            custom_branch: ""
          },                             // 银行信息（下拉框）
          account_type: "",              // 银行账户类型
          person_or_company_name: "",    // 开户名
          bank_account: "",              // 银行卡号
          billing_account_name: "",      // 财务联系人
          billing_account_tel: ""        // 财务联系人电话
        },
        IDForm: {                // 身份信息
          IDRadio: false,        // 有无身份信息
          cert_type: "",         // 证件类型
          real_name: "",         // 真实姓名
          card_code: "",         // 证件号码
          card_front_url: "",    // 证件正面照
          card_back_url: ""      // 证件背面照
        }
      };
    },
    watch: {
      Bank: function() {
        var self = this;
        var bank = self.Bank;
        if (bank.bank_account) {
          self.checkForm.bankRadio = true;     // 有无银行信息
          // 银行省、市、银行、支行
          self.get_admiprovince(bank.admiprovince_id, bank.admicity_id, bank.bank_id, bank.branch_id, bank.custom_branch);
          self.checkForm.account_type = bank.account_type;                       // 银行账户类型
          self.checkForm.person_or_company_name = bank.person_or_company_name;   // 开户名
          self.checkForm.bank_account = bank.bank_account;                       // 银行卡号
          self.checkForm.billing_account_name = bank.billing_account_name;       // 财务联系人
          self.checkForm.billing_account_tel = bank.billing_account_tel;         // 财务联系人电话
        }
      },
      ID: function() {
        var self = this;
        var id = self.ID;
        if (id.card_code) {
          self.IDForm.IDRadio = true;
          var cert = {
            "ID_CARD": "身份证",
            "HK_MACAO_CARD": "港澳通行证",
            "TAIWAN_CARD": "台胞证",
            "PASSPORT": "护照"
          };
          self.IDForm.cert_type = cert[id.cert_type];
          self.IDForm.real_name = id.real_name;      // 真实姓名
          self.IDForm.card_code = id.card_code;      // 证件号码
          self.IDForm.card_front_url = id.card_front_url;   // 证件正面照
          self.IDForm.card_back_url = id.card_back_url;     // 证件背面照
        }
      }
    },
    methods: {
      /* 获取银行省、银行列表 id、name */
      get_admiprovince: function(admiprovince, admicity, bank, branch, custom) {
        var self = this;
        self.$http.get(BANK_PROVINCES_URL).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.checkForm.bank.admiprovince = getValue(arr, admiprovince, "id", "name");
            self.get_admicity(admiprovince, admicity, bank, branch, custom);
          }
        });
      },
      get_admicity: function(admiprovince, admicity, bank, branch, custom) {
        var self = this;
        self.$http.get(BANK_CITIES_URL + "?admiprovince_id=" + admiprovince).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.checkForm.bank.admicity = getValue(arr, admicity, "id", "name");
            self.get_bank(admicity, bank, branch, custom);
          }
        });
      },
      get_bank: function(admicity, bank, branch, custom) {
        var self = this;
        self.$http.get(BANKS_URL).then(function(response) {
          if (response.body.success) {
            let arr = response.body.content;
            self.checkForm.bank.bank = getValue(arr, bank, "bank_id", "bank_name");
            self.get_branch(admicity, bank, branch, custom);
          }
        });
      },
      get_branch: function(admicity, bank, branch, custom) {
        var self = this;
        if (parseInt(branch) === 0) {
          self.checkForm.bank.branchFlag = false;
          self.checkForm.bank.custom_branch = custom + "（自定义）";
        } else {
          self.checkForm.bank.branchFlag = true;
          self.$http.get(SUBBANKS_URL + "?bank_id=" + bank + "&admicity_id=" + admicity).then(function(response) {
            if (response.body.success) {
              let arr = response.body.content;
              self.checkForm.bank.branch = getValue(arr, branch, "subbank_id", "subbank_name");
            }
          });
        }
      }
    },
    components: {
      radioCheck,
      showImage
    }
  };
</script>

<style scoped>

</style>
