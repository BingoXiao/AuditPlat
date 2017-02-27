<template>
  <el-col :span="24">
    <el-form :model="quaForm" :rules="quaRules" ref="quaForm"
             label-width="150px" label-position="top">
      <h3 class="formTitle">资质信息</h3>
      <el-form-item label="门店LOGO照片：" required>
        <upload-image :imgWidth="140" :imgHeight="140" imgName="门店LOGO"
                      :tips = "['250X250']"
                      :imgSrc = "require('../../../../../assets/register/1.png')"></upload-image>
      </el-form-item>

      <el-form-item label="门店招牌照片：" required>
        <upload-image :imgWidth="220" :imgHeight="140" imgName="门店招牌"
                      :tips = "['从店面正前方取景，光线明亮', '店面招牌和店面大门全景拍摄', '图片不得有水印、LOGO和其他网站信息']"
                      :imgSrc = "require('../../../../../assets/register/1.png')"></upload-image>
      </el-form-item>

      <el-form-item label="店内照片：" required>
        <upload-image :imgWidth="220" :imgHeight="140" imgName="店内照片"
                      :tips = "['体现主要经营环境，包含桌椅、墙面、地板等', '地面干净，无明显有无及垃圾；墙面无霉斑',
                      '照片如有工作人员，需着装干净整洁', '图片不得有水印、LOGO和其他网站信息']"
                      :imgSrc = "require('../../../../../assets/register/2.png')"></upload-image>
      </el-form-item>


      <h5>营业执照</h5>
      <el-form-item label="上传清晰营业执照照片：" required>
        <upload-image :imgWidth="220" :imgHeight="140" imgName="营业执照"
                      :tips = "['证照边框及国徽必须包含在内','证照拍摄角度应为“正视”，不得出现歪斜现象',
                      '证件清晰可辨认，不得使用复印件息']"
                      :imgSrc = "require('../../../../../assets/register/10.png')"></upload-image>
      </el-form-item>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel1">
          <label>*<span class="labelText">营业执照名称：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="bl_name" required>
            <el-input v-model="quaForm.blinfo.bl_name" name="blinfo.bl_name"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel2">
          <label>*<span class="labelText">营业执照注册号：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="bl_account">
            <el-input v-model="quaForm.blinfo.bl_account" name="blinfo.bl_account"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel3">
          <label>*<span class="labelText">营业执照注册地址：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="bl_address">
            <el-input v-model="quaForm.blinfo.bl_address" name="blinfo.bl_address"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel4">
          <label>*<span class="labelText">注册有效期：</span></label>
        </el-col>
        <el-col :span="18">
          <el-form-item required prop="blinfo_expire">
            <el-radio-group v-model="quaForm.blinfo.bl_expire">
              <el-radio label="长期有效"></el-radio>
              <el-radio label="到期日期为："></el-radio>
            </el-radio-group>

            <el-date-picker
              v-model="quaForm.blinfo.expire_date"
              type="date"
              placeholder="选择日期"
              :picker-options="blinfoPickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-col>


      <h5>餐饮服务许可证</h5>
      <el-form-item label="上传清晰餐饮服务许可证照片：" required>
        <upload-image :imgWidth="220" :imgHeight="140" imgName="营业执照"
                      :tips = "['证照边框及国徽必须包含在内','证照拍摄角度应为“正视”，不得出现歪斜现象',
                      '证件清晰可辨认，不得使用复印件息']"
                      :imgSrc = "require('../../../../../assets/register/11.jpg')"></upload-image>
      </el-form-item>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel4">
          <label>*<span class="labelText">许可证名称：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="sl_name">
            <el-input v-model="quaForm.slinfo.bl_name" name="slinfo.sl_name"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel5">
          <label>*<span class="labelText">许可证注册号：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="sl_account">
            <el-input v-model="quaForm.slinfo.sl_account" name="slinfo.sl_account"></el-input>
          </el-form-item>
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-col class="labelWrapper qualabel6">
          <label>*<span class="labelText">许可证注册地址：</span></label>
        </el-col>
        <el-col :span="10">
          <el-form-item required prop="sl_address">
            <el-input v-model="quaForm.slinfo.sl_address" name="slinfo.sl_address"></el-input>
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
              v-model="quaForm.slinfo.sl_expire"
              type="date"
              placeholder="选择日期"
              :picker-options="blinfoPickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-col>
    </el-form>
    <el-button @click="quaValidate">diandsafaf</el-button>
  </el-col>
</template>

<script>
  import uploadImage from "../../../../../components/form/uploadImg/index"
//  import {BDREGISTER_NEWREGISTER_URL} from "../../../../../common/interface"
  import {isLicName} from "../../../../../common/common"

  export default{
    data() {
      var blinNameV = (rule, value, callback) => {
        var blinN = isLicName(value, "营业执照")
        if (!blinN.flag) {
          callback(new Error(blinN.error))
        } else {
          callback()
        }
      }
      var slinNameV = (rule, value, callback) => {
        var slinN = isLicName(value, "餐饮许可证")
        if (!slinN.flag) {
          callback(new Error(slinN.error))
        } else {
          callback()
        }
      }
      return {
        blinfoPickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        moduleV: {
          tel_flag: false
        },
        quaForm: {
          busimages: {
            logo_url: "",
            brand_url: "",
            indoor_url: ""
          },
          blinfo: {
            bl_image_url: "",
            bl_name: "",
            bl_account: "",
            bl_address: "",
            bl_expire: "长期有效",
            expire_date: ""
          },
          slinfo: {
            sl_image_url: "",
            sl_name: "",
            sl_account: "",
            sl_address: "",
            sl_expire: ""
          }
        },
        quaRules: {
          bl_name: [
            { validator: blinNameV, trigger: "blur" }
          ],
          sl_name: [
            { validator: slinNameV, trigger: "blur" }
          ]
        }
      }
    },
    methods: {
      quaValidate: function() {
        var self = this
        self.$refs.quaForm.validate((valid) => {
          if (valid) {
            alert(1)
//            var form = document.getElementById("basicForm")
//            var formData = new FormData(form)
//            formData.append("step", "QUA")
//            formData.append("applynum", "")
//            self.$store.commit("FORM_DATA", formData)
//            self.$store.commit("V_FLAG", true)
//                    for (var pair of self.$store.state.form_data) {
//                      console.log(pair[0] + ", " + pair[1])
//                    }
          }
        })
      }
    },
    components: {
      uploadImage
    }
  }
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
