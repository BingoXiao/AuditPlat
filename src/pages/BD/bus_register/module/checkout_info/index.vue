<template>
  <el-col :span="24">
    <el-form id="checkForm" :model="checkForm"
             :rules="checkRules" ref="checkForm"
             label-width="103px" label-position="left">
      <h3 class="formTitle">结款信息</h3>
      <el-form-item label="结款信息:" required>
        <el-radio-group v-model="checkForm.bankRadio"
                        @change="bankRadio_change">
          <el-radio label="hasBank">有</el-radio>
          <el-radio label="noBank">无</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--银行信息-->
      <div v-show="checkForm.bankRadio === 'hasBank'">
        <el-row>
          <el-col :span="7">
            <el-form-item label="银行账户：" prop="account_type" required>
              <el-select v-model="checkForm.account_type"
                         placeholder="请选择"
                         :clearable="true">
                <el-option
                  v-for="item in checkForm.account_type_option"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="开户名：" label-width="90px" prop="person_or_company_name" required>
              <el-input v-model.trim="checkForm.person_or_company_name"
                        :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <bank-select ref="bank_children" :options="checkForm.bank"
                       v-on:bankValidate="module_res">
          </bank-select>
        </el-row>

        <el-form-item label="银行卡号：" prop="bank_account" required>
          <el-col :span="12">
            <el-input v-model.trim="checkForm.bank_account"
                      :maxlength="20"></el-input>
          </el-col>
        </el-form-item>

        <el-row>
          <el-col :span="9">
            <el-form-item label="财务联系人：" label-width="120px" prop="billing_account_name" required>
              <el-input v-model.trim="checkForm.billing_account_name"
                        :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="财务联系人手机：" label-width="150px" prop="billing_account_tel" required>
              <el-input v-model.trim.number="checkForm.billing_account_tel"
                        :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>


    <!--身份信息-->
    <el-form id="IDForm" :model="IDForm" :rules="IDRules" ref="IDForm"
             label-width="103px" label-position="left">
      <h3 class="formTitle">身份信息</h3>
      <el-form-item label="身份信息" required>
        <el-radio-group v-model="IDForm.IDRadio" @change="IDRadio_change">
          <el-radio label="hasID">有</el-radio>
          <el-radio label="noID">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-col :span="24" v-show="IDForm.IDRadio === 'hasID'">
        <el-form-item label="上传清晰证件照片" label-width="150px" required></el-form-item>
        <el-form-item label="证件类型：" prop="cert_type" required>
          <el-select v-model="IDForm.cert_type" @change="change_card">
            <el-option
              v-for="item in IDForm.cert_type_option"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="真实姓名：" prop="real_name" required>
          <el-col :span="10">
            <el-input v-model.trim="IDForm.real_name"
                      placeholder="请填写真实姓名"
                      :maxlength="30"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="证件号码：" prop="card_code" required>
          <el-col :span="10">
            <el-input v-model.trim="IDForm.card_code"
                      placeholder="请填写证件号码"
                      :maxlength="18"></el-input>
          </el-col>
        </el-form-item>

        <!--身份证、港澳通行证、台胞证-->
        <el-form-item v-show="IDForm.cardImg">
          <el-col :span="24">
            <upload-image ref="card_front"
                          :imgWidth="220" :imgHeight="140"
                          imgName="个人信息页"
                          :imgFill="IDForm.card_front_url"
                          suffix_name="card_front_url"
                          v-on:handleSuccess="addFormData"
                          :tips="['证件清晰可辨认，不得使用复印件']"
                          :imgSrc="IDForm.card_front_url_sample"></upload-image>
          </el-col>
          <el-col :span="24">
            <upload-image ref="card_back" :imgWidth="220" :imgHeight="140" imgName="国徽页"
                          :imgFill="IDForm.card_back_url"
                          suffix_name="card_back_url"
                          v-on:handleSuccess="addFormData"
                          :tips="['证件清晰可辨认，不得使用复印件']"
                          :imgSrc="IDForm.card_back_url_sample"></upload-image>
          </el-col>
        </el-form-item>

        <!--护照-->
        <el-form-item v-show="!IDForm.cardImg">
          <upload-image ref="card_all" :imgWidth="220" :imgHeight="280" imgName="个人信息页"
                        :imgFill="IDForm.card_all_url"
                        suffix_name="card_all_url"
                        v-on:handleSuccess="addFormData"
                        :tips="['证件清晰可辨认，不得使用复印件']"
                        :imgSrc="IDForm.card_all_url_sample"></upload-image>
        </el-form-item>
      </el-col>
    </el-form>
  </el-col>
</template>

<script>
  import uploadImage from "../../../../../components/form/uploadImg/index";
  import bankSelect from "../../../../../components/form/bank/index";
  import {isName, isPhone, isbankNumber, isLicNumber, getUrlParameters} from "../../../../../common/common";

  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      // 银行卡号
      var validateBankAcc = (rule, value, callback) => {
        var BankAcc = isbankNumber(value);
        if (!BankAcc.flag) {
          callback(new Error(BankAcc.error));
        } else {
          callback();
        }
      };
      // 财务联系人
      var validateName = (rule, value, callback) => {
        var Name = isName(value);
        if (!Name.flag) {
          callback(new Error(Name.error));
        } else {
          callback();
        }
      };
      // 财务联系人手机
      var validatePhone = (rule, value, callback) => {
        var Phone = isPhone(value);
        if (!Phone.flag) {
          callback(new Error(Phone.error));
        } else {
          callback();
        }
      };
      // 证件号码
      var validateIDNum = (rule, value, callback) => {
        var IDNum = isLicNumber(value, "证件号码");
        if (!IDNum.flag) {
          callback(new Error(IDNum.error));
        } else {
          callback();
        }
      };
      return {
        moduleV: {      // 模块验证
          bank: false   // 银行(框)
        },
        checkFormFlag: false,  // 银行信息验证结果
        IDFormFlag: false,     // 身份信息验证结果
        checkForm: {                // 结款信息
          bankRadio: "noBank",      // 有无银行信息
          bank: [],                 // 银行信息（下拉框）
          account_type: "",         // 银行账户类型
          account_type_option: [{
            value: "个人户",
            label: "个人户"
          }, {
            value: "公司户",
            label: "公司户"
          }],
          person_or_company_name: "",    // 开户名
          bank_account: "",              // 银行卡号
          billing_account_name: "",      // 财务联系人
          billing_account_tel: ""        // 财务联系人电话
        },
        IDForm: {                  // 身份信息
          IDRadio: "noID",         // 有无身份信息
          cert_type: "ID_CARD",    // 证件类型
          cert_type_option: [{
            value: "ID_CARD",
            label: "身份证"
          }, {
            value: "HK_MACAO_CARD",
            label: "港澳通行证"
          }, {
            value: "TAIWAN_CARD",
            label: "台胞证"
          }, {
            value: "PASSPORT",
            label: "护照"
          }],
          real_name: "",         // 真实姓名
          card_code: "",         // 证件号码
          cardImg: true,         // 根据证件类型判断显示图片
          card_front_url: "",    // 证件正面照
          card_back_url: "",     // 证件背面照
          card_all_url: "",      // 护照照片
          card_front_url_sample: require("../../../../../assets/register/3.png"),
          card_back_url_sample: require("../../../../../assets/register/4.png"),
          card_all_url_sample: require("../../../../../assets/register/9.png")
        },
        checkRules: {
          account_type: [
            { required: true, message: "请选择银行账户", trigger: "change" }
          ],
          person_or_company_name: [
            { required: true, message: "请填写开户名", trigger: "blur" }
          ],
          bank_account: [
            { validator: validateBankAcc, trigger: "blur" }
          ],
          billing_account_name: [
            { validator: validateName, trigger: "blur" }
          ],
          billing_account_tel: [
            { validator: validatePhone, trigger: "blur" }
          ]
        },
        IDRules: {
          real_name: [
            { validator: validateName, trigger: "blur" }
          ],
          card_code: [
            { validator: validateIDNum, trigger: "blur" }
          ]
        }
      };
    },
    watch: {
      filling: function() {
        var self = this;
        var bankinfo = self.filling.bankinfo;
        var userinfo = self.filling.userinfo;
        if (bankinfo) {
          if (bankinfo.person_or_company_name) {   // 有银行信息
            self.checkForm.bankRadio = "hasBank";
            self.checkForm.account_type = bankinfo.account_type;                        // 银行账户
            self.checkForm.person_or_company_name = bankinfo.person_or_company_name;    // 开户名
            var arr = [];
            arr[0] = bankinfo.admiprovince_id;      // 开户行所在省
            arr[1] = bankinfo.admicity_id;          // 开户行所在市
            arr[2] = bankinfo.bank_id;              // 银行名称
            arr[3] = bankinfo.branch_id;            // 开户行名称（0表示自定义）
            arr[4] = bankinfo.custom_branch;        // 自定义开户行名称
            self.checkForm.bank = arr;
            self.checkForm.bank_account = bankinfo.bank_account;                        // 银行卡号
            self.checkForm.billing_account_name = bankinfo.billing_account_name;        // 财务联系人
            self.checkForm.billing_account_tel = bankinfo.billing_account_tel;          // 财务联系人手机
          }
        }
        if (userinfo) {
          if (userinfo.card_code) {         // 有身份信息
            self.IDForm.IDRadio = "hasID";
            self.IDForm.cert_type = userinfo.cert_type;    // 证件类型
            self.IDForm.real_name = userinfo.real_name;    // 真实姓名
            self.IDForm.card_code = userinfo.card_code;    // 证件号码
            if (userinfo.cert_type === "PASSPORT") {
              self.IDForm.card_all_url = userinfo.card_front_url;  // 护照
              self.IDForm.cardImg = false;
            } else {
              self.IDForm.cardImg = true;
              self.IDForm.card_front_url = userinfo.card_front_url;  // 其他
              self.IDForm.card_back_url = userinfo.card_back_url;
            }
          }
        }
      }
    },
    methods: {
      // 结款信息单选按钮改变事件
      bankRadio_change: function() {
        this.checkFormFlag = false;
      },
      // 身份信息单选按钮改变事件
      IDRadio_change: function() {
        this.IDFormFlag = false;
      },
      // 证件类型改变时
      change_card: function(value) {
        var self = this;
        if (value === "PASSPORT") {
          self.IDForm.cardImg = false;
        } else {
          self.IDForm.cardImg = true;
          if (value === "ID_CARD") {
            self.IDForm.card_front_url_sample = require("../../../../../assets/register/3.png");
            self.IDForm.card_back_url_sample = require("../../../../../assets/register/4.png");
          } else if (value === "HK_MACAO_CARD") {
            self.IDForm.card_front_url_sample = require("../../../../../assets/register/5.png");
            self.IDForm.card_back_url_sample = require("../../../../../assets/register/6.png");
          } else if (value === "TAIWAN_CARD") {
            self.IDForm.card_front_url_sample = require("../../../../../assets/register/7.png");
            self.IDForm.card_back_url_sample = require("../../../../../assets/register/8.png");
          }
        }
      },
      // 模块验证及数据返回
      module_res: function(name, value, flag) {
        var self = this;
        self.moduleV[name] = flag;
        self.checkForm[name] = value;
      },
      // 图片数据返回
      addFormData: function(value, name) {
        var self = this;
        self.IDForm[name] = value;
      },
      // 银行信息验证
      checkFormV: function() {
        var self = this;
        self.$refs.bank_children.bankValidate();
        self.$refs.checkForm.validate((valid) => {
          if (valid && self.moduleV.bank) {
            self.checkFormFlag = true;
          }
        });
      },
      // 身份信息验证
      IDFormV: function() {
        var self = this;
        var imageFlag = false;
        if (self.IDForm.cert_type === "PASSPORT") {
          self.$refs.card_all.validate();
          imageFlag = self.IDForm.card_all_url;
        } else {
          self.$refs.card_front.validate();
          self.$refs.card_back.validate();
          imageFlag = self.IDForm.card_front_url && self.IDForm.card_back_url;
        }
        self.$refs.IDForm.validate((valid) => {
          if (valid && imageFlag) {
            self.IDFormFlag = true;
          }
        });
      },
      /* 表单重置 */
//      resetForm: function() {
//        this.$refs.checkForm.resetFields()
//      },
      // 结款信息验证
      checkValidate: function(flag) {
        var self = this;
        var formData = {
          step: "BANK",
          "applynum": getUrlParameters(window.location.hash, "id"),
          "type": flag,
          "bankinfo": {                   // 银行信息
            "account_type": "",           // 银行账户
            "admiprovince_id": "",        // 开户行省
            "admicity_id": "",            // 开户行市
            "bank_id": "",                // 银行
            "branch_id": "",              // 开户行
            "custom_branch": "",          // 自定义
            "person_or_company_name": "", // 开户名
            "bank_account": "",           // 银行卡号
            "billing_account_name": "",   // 财务联系人
            "billing_account_tel": ""     // 财务联系人电话
          },
          "userinfo": {            // 身份信息
            "real_name": "",       // 真实姓名
            "cert_type": "",       // 证件类型
            "card_code": "",       // 证件号码
            "card_front_url": "",  // 正面照片
            "card_back_url": ""    // 背面照片
          }
        };
        if (self.checkForm.bankRadio === "hasBank") {   // 有银行信息
          self.checkFormV();
          formData.bankinfo.account_type = self.checkForm.account_type;
          formData.bankinfo.admiprovince_id = self.checkForm.bank[0];
          formData.bankinfo.admicity_id = self.checkForm.bank[1];
          formData.bankinfo.bank_id = self.checkForm.bank[2];
          formData.bankinfo.branch_id = self.checkForm.bank[3] + "";
          if (parseInt(self.checkForm.bank[3]) === 0) {  // 自定义支行
            formData.bankinfo.custom_branch = self.checkForm.bank[4];
          }
          formData.bankinfo.person_or_company_name = self.checkForm.person_or_company_name;
          formData.bankinfo.bank_account = self.checkForm.bank_account;
          formData.bankinfo.billing_account_name = self.checkForm.billing_account_name;
          formData.bankinfo.billing_account_tel = self.checkForm.billing_account_tel;
        } else {
          self.checkFormFlag = true;
        }
        if (self.IDForm.IDRadio === "hasID") {      // 有身份信息
          self.IDFormV();
          formData.userinfo.real_name = self.IDForm.real_name;
          formData.userinfo.cert_type = self.IDForm.cert_type;
          formData.userinfo.card_code = self.IDForm.card_code;
          if (self.IDForm.cert_type === "PASSPORT") {
            formData.userinfo.card_front_url = self.IDForm.card_all_url;
          } else {
            formData.userinfo.card_front_url = self.IDForm.card_front_url;
          }
          formData.userinfo.card_back_url = self.IDForm.card_back_url;
        } else {
          self.IDFormFlag = true;
        }
        // 验证判断
        if (self.checkFormFlag && self.IDFormFlag) {
          self.$store.commit("FORM_DATA", formData);
          self.$store.commit("V_FLAG", true);
        }
      }
    },
    components: {
      uploadImage,
      bankSelect
    }
  };
</script>

<style scoped>

</style>
