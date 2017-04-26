<template>
  <el-col :span="24">
    <el-form id="quaForm" :model="quaForm" :rules="quaRules" ref="quaForm"
             label-width="150px" label-position="top">
      <h3 class="formTitle">资质信息</h3>
      <el-form-item label="门店LOGO照片：" required>
        <upload-image ref="logo_url" :imgWidth="140" :imgHeight="140" imgName="门店LOGO"
                      :imgFill="quaForm.logo_url"
                      suffix_name="logo_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['250 X 250']"
                      :imgSrc="require('../../../../../assets/register/1.png')"></upload-image>
      </el-form-item>

      <el-form-item label="门店招牌照片：" required>
        <upload-image ref="brand_url" :imgWidth="220" :imgHeight="140" imgName="门店招牌"
                      :imgFill="quaForm.brand_url"
                      suffix_name="brand_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['从店面正前方取景，光线明亮', '店面招牌和店面大门全景拍摄', '图片不得有水印、LOGO和其他网站信息']"
                      :imgSrc="require('../../../../../assets/register/1.png')"></upload-image>
      </el-form-item>

      <el-form-item label="店内照片：" required>
        <upload-image ref="indoor_url" :imgWidth="220" :imgHeight="140" imgName="店内照片"
                      :imgFill="quaForm.indoor_url"
                      suffix_name="indoor_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['体现主要经营环境，包含桌椅、墙面、地板等', '地面干净，无明显有无及垃圾；墙面无霉斑',
                      '照片如有工作人员，需着装干净整洁', '图片不得有水印、LOGO和其他网站信息']"
                      :imgSrc="require('../../../../../assets/register/2.png')"></upload-image>
      </el-form-item>


      <h5>营业执照</h5>
      <el-form-item label="上传清晰营业执照照片：" required>
        <upload-image ref="bl_image_url" :imgWidth="220" :imgHeight="140" imgName="营业执照"
                      :imgFill="quaForm.bl_image_url"
                      suffix_name="bl_image_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['证照边框及国徽必须包含在内','证照拍摄角度应为“正视”，不得出现歪斜现象',
                      '证件清晰可辨认，不得使用复印件息']"
                      :imgSrc="require('../../../../../assets/register/10.png')"></upload-image>
      </el-form-item>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel1">
          <label>*<span class="labelText">营业执照名称：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="bl_name">
            <el-input v-model="quaForm.bl_name" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel2">
          <label>*<span class="labelText">营业执照注册号：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="bl_account">
            <el-input v-model="quaForm.bl_account" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel3">
          <label>*<span class="labelText">营业执照注册地址：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="bl_address">
            <el-input v-model="quaForm.bl_address" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel4">
          <label>*<span class="labelText">注册有效期：</span></label>
        </el-col>
        <el-col :span="18">
          <el-form-item required>
            <el-radio-group v-model="quaForm.bl_expire">
              <el-radio label="long">长期有效</el-radio>
              <el-radio label="valid">到期日期为：</el-radio>
            </el-radio-group>
            <el-date-picker id="bl_expire"
              :editable="false"
              :clearable="false"
              @change="transform_bl_expire"
              :disabled="quaForm.bl_expire === 'long'"
              v-model="quaForm.bl_expire_date"
              type="date"
              placeholder="选择日期"
              :picker-options="blinfoPickerOptions">
            </el-date-picker>
            <span v-if="error" class="error">{{error}}</span>
          </el-form-item>
        </el-col>
      </el-col>


      <h5>餐饮服务许可证</h5>
      <el-form-item label="上传清晰餐饮服务许可证照片：" required>
        <upload-image ref="sl_image_url" :imgWidth="220" :imgHeight="140" imgName="营业执照"
                      :imgFill="quaForm.sl_image_url"
                      suffix_name="sl_image_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['证照边框及国徽必须包含在内','证照拍摄角度应为“正视”，不得出现歪斜现象',
                      '证件清晰可辨认，不得使用复印件息']"
                      :imgSrc="require('../../../../../assets/register/11.jpg')"></upload-image>
      </el-form-item>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel4">
          <label>*<span class="labelText">许可证名称：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="sl_name">
            <el-input v-model="quaForm.sl_name" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel5">
          <label>*<span class="labelText">许可证编号：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="sl_code">
            <el-input v-model="quaForm.sl_code" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel6">
          <label>*<span class="labelText">许可证注册地址：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="sl_address">
            <el-input v-model="quaForm.sl_address" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel4">
          <label>*<span class="labelText">到期日期为：</span></label>
        </el-col>
        <el-col :span="18">
          <el-form-item required prop="sl_expire">
            <el-date-picker
              @change="transform_sl_expire"
              :editable="false"
              :clearable="false"
              v-model="quaForm.sl_expire"
              type="date"
              placeholder="选择日期"
              :picker-options="blinfoPickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
  </el-col>
</template>

<script>
  import uploadImage from "../../../../../components/form/uploadImg/index";
  import {isLicName, isLicNumber, isLicAdd, getUrlParameters} from "../../../../../common/common";

  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      // 营业执照名称
      var validateBlinName = (rule, value, callback) => {
        var blinName = isLicName(value, "营业执照");
        if (!blinName.flag) {
          callback(new Error(blinName.error));
        } else {
          callback();
        }
      };
      // 许可证名称
      var validateSlinName = (rule, value, callback) => {
        var slinName = isLicName(value, "许可证");
        if (!slinName.flag) {
          callback(new Error(slinName.error));
        } else {
          callback();
        }
      };
      // 营业执照号码
      var validateBlinAcc = (rule, value, callback) => {
        var blinAcc = isLicNumber(value, "营业执照注册号");
        if (!blinAcc.flag) {
          callback(new Error(blinAcc.error));
        } else {
          callback();
        }
      };
      // 许可证号码
      var validateSlinAcc = (rule, value, callback) => {
        var slinAcc = isLicNumber(value, "许可证注册号");
        if (!slinAcc.flag) {
          callback(new Error(slinAcc.error));
        } else {
          callback();
        }
      };
      // 营业执照地址
      var validateBlinAdd = (rule, value, callback) => {
        var blinAdd = isLicAdd(value, "营业执照");
        if (!blinAdd.flag) {
          callback(new Error(blinAdd.error));
        } else {
          callback();
        }
      };
      // 许可证地址
      var validateSlinAdd = (rule, value, callback) => {
        var slinAdd = isLicAdd(value, "许可证");
        if (!slinAdd.flag) {
          callback(new Error(slinAdd.error));
        } else {
          callback();
        }
      };
      return {
        blinfoPickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        error: "",   // 营业执照到期日期错误提示
        quaForm: {
          logo_url: "",     // 门店LOGO
          brand_url: "",    // 门店招牌
          indoor_url: "",   // 店内照片
          bl_image_url: "",    // 营业执照照片
          bl_name: "",         // 营业执照名称
          bl_account: "",      // 营业执照注册号
          bl_address: "",      // 营业执照地址
          bl_expire: "long",   // 营业执照注册有效期radio组
          bl_expire_date: "",  // 营业执照注册有效日期
          sl_image_url: "",    // 许可证照片
          sl_name: "",         // 许可证名称
          sl_code: "",         // 许可证注册号
          sl_address: "",      // 许可证地址
          sl_expire: ""        // 许可证有效日期
        },
        quaRules: {
          bl_name: [
            { validator: validateBlinName, trigger: "blur" }
          ],
          sl_name: [
            { validator: validateSlinName, trigger: "blur" }
          ],
          bl_account: [
            { validator: validateBlinAcc, trigger: "blur" }
          ],
          sl_code: [
            { validator: validateSlinAcc, trigger: "blur" }
          ],
          bl_address: [
            { validator: validateBlinAdd, trigger: "blur" }
          ],
          sl_address: [
            { validator: validateSlinAdd, trigger: "blur" }
          ],
          sl_expire: [
            { required: true, message: "请选择许可证到期日期", trigger: "[blur, change]" }
          ]
        }
      };
    },
    watch: {
      filling: function() {
        var self = this;
        var businfo = self.filling.businfo;
        var blinfo = self.filling.blinfo;
        var slinfo = self.filling.slinfo;
        self.quaForm.logo_url = businfo.logo_url;
        self.quaForm.brand_url = businfo.brand_url;
        self.quaForm.indoor_url = businfo.indoor_url;
        if (blinfo.bl_image_url) {     // 营业执照
          self.quaForm.bl_image_url = blinfo.bl_image_url;
          self.quaForm.bl_account = blinfo.bl_account;
          self.quaForm.bl_name = blinfo.bl_name;
          self.quaForm.bl_address = blinfo.bl_address;
          if (blinfo.bl_expire) {
            self.quaForm.bl_expire = "valid";
            self.quaForm.bl_expire_date = blinfo.bl_expire;
          }
        }
        if (slinfo.sl_image_url) {    // 许可证
          self.quaForm.sl_image_url = slinfo.sl_image_url;
          self.quaForm.sl_code = slinfo.sl_code;
          self.quaForm.sl_name = slinfo.sl_name;
          self.quaForm.sl_address = slinfo.sl_address;
          self.quaForm.sl_expire = slinfo.sl_expire;
        }
      }
    },
    methods: {
      // 获取子模块数据
      addFormData: function(value, name) {
        this.quaForm[name] = value;
      },
      // 获取营业执照到期日期
      transform_bl_expire: function(value) {
        this.quaForm.bl_expire_date = value;
        this.error = "";
        document.getElementById("bl_expire").getElementsByTagName("input")[0].style.borderColor = "rgb(191, 203, 217)";
      },
      // 获取许可证到期日期
      transform_sl_expire: function(value) {
        this.quaForm.sl_expire = value;
      },
      // 资质信息验证
      quaValidate: function() {
        var self = this;
        // 图片验证
        self.$refs.logo_url.validate();
        self.$refs.brand_url.validate();
        self.$refs.indoor_url.validate();
        self.$refs.bl_image_url.validate();
        self.$refs.sl_image_url.validate();
        var imageFlag = self.quaForm.logo_url && self.quaForm.brand_url && self.quaForm.indoor_url &&
          self.quaForm.bl_image_url && self.quaForm.sl_image_url;
        if (self.quaForm.bl_expire === "valid" && self.quaForm.bl_expire_date === "") {
          self.error = "请选择营业执照到期日期";
          document.getElementById("bl_expire").getElementsByTagName("input")[0].style.borderColor = "#ff4949";
        }
        // 其他输入验证
        self.$refs.quaForm.validate((valid) => {
          if (valid && imageFlag && !self.error) {
            var formData = {
              step: "QUA",
              "applynum": getUrlParameters(window.location.hash, "id"),
              busimages: {
                "logo_url": self.quaForm.logo_url,      // 门店LOGO
                "brand_url": self.quaForm.brand_url,    // 门店招牌
                "indoor_url": self.quaForm.indoor_url   // 店内照片
              },
              blinfo: {    // 营业执照
                "bl_image_url": self.quaForm.bl_image_url,
                "bl_name": self.quaForm.bl_name,
                "bl_account": self.quaForm.bl_account,
                "bl_address": self.quaForm.bl_address,
                "bl_expire": ""
              },
              slinfo: {    // 许可证
                "sl_image_url": self.quaForm.sl_image_url,
                "sl_name": self.quaForm.sl_name,
                "sl_code": self.quaForm.sl_code,
                "sl_address": self.quaForm.sl_address,
                "sl_expire": self.quaForm.sl_expire
              }
            };
            if (self.quaForm.bl_expire === "valid") {
              formData.blinfo.bl_expire = self.quaForm.bl_expire_date;
            }
            self.$store.commit("FORM_DATA", formData);
            self.$store.commit("V_FLAG", true);
          }
        });
      }
    },
    components: {
      uploadImage
    }
  };
</script>

<style scoped>
  .qualabel1{
    width: 130px;
  }
  .qualabel2{
    width: 150px;
  }
  .qualabel3{
    width: 160px;
  }
  .qualabel4{
    width: 120px;
  }
  .qualabel5{
    width: 135px;
  }
  .qualabel6{
    width: 145px;
  }
</style>
