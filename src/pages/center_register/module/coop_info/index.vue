<template>
  <el-col :span="24">
    <el-form id="quaForm" :model="quaForm" :rules="quaRules"
             ref="quaForm" label-width="100px">
      <el-form-item label="您的姓名：" prop="name" required>
        <el-col :span="8">
          <el-input v-model="quaForm.name"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="您的手机：" prop="phonenum" required>
        <el-col :span="6">
          <el-input v-model="quaForm.phonenum" disabled></el-input>
        </el-col>
      </el-form-item>

      <!--商家分类-->
      <el-form-item label="商家分类：" required>
        <bus-classification ref="bus_class_children" v-on:classValidate="module_res"></bus-classification>
      </el-form-item>
      <h5>营业执照</h5>
      <el-form-item label="上传清晰营业执照照片：" label-width="185px"></el-form-item>
      <el-form-item label="" label-width="20px" required>
        <upload-image ref="bl_image_url" :imgWidth="220" :imgHeight="140" imgName="营业执照"
                      :imgFill="quaForm.bl_image_url"
                      suffix_name="bl_image_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['证照边框及国徽必须包含在内','证照拍摄角度应为“正视”，不得出现歪斜现象',
                      '证件清晰可辨认，不得使用复印件息']"
                      :imgSrc="require('../../../../assets/register/10.png')"></upload-image>
      </el-form-item>

      <h5>餐饮服务许可证</h5>
      <el-form-item label="上传清晰餐饮服务许可证照片：" label-width="225px"></el-form-item>
      <el-form-item label="" label-width="20px" required>
        <upload-image ref="sl_image_url" :imgWidth="220" :imgHeight="140" imgName="营业执照"
                      :imgFill="quaForm.sl_image_url"
                      suffix_name="sl_image_url"
                      v-on:handleSuccess="addFormData"
                      :tips="['证照边框及国徽必须包含在内','证照拍摄角度应为“正视”，不得出现歪斜现象',
                      '证件清晰可辨认，不得使用复印件息']"
                      :imgSrc="require('../../../../assets/register/11.jpg')"></upload-image>
      </el-form-item>

      <el-form-item label="团购内容："></el-form-item>
      <el-form-item label="" label-width="20px">
        <el-col :span="18">
          <el-input
            type="textarea"
            :autosize="{minRows: 8, maxRows: 10}"
            :maxlength="500"
            v-model="quaForm.group_buying_info"
            style="color: #7c7c7c;">
          </el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="人均：" prop="cost_per_person" required>
        <el-col :span="6">
          <el-input v-model="quaForm.cost_per_person"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="月销售额：" prop="sale_per_month">
        <el-col :span="6">
          <el-input v-model="quaForm.sale_per_month"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import busClassification from "../../../../components/form/classification/index";
  import uploadImage from "../../../../components/form/uploadImg/index";
  import {isName, isCostPerPerson, isSalePerMonth, getParmString} from "../../../../common/common";

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
      // 人均
      var personV = (rule, value, callback) => {
        var Person = isCostPerPerson(value);
        if (!Person.flag) {
          callback(new Error(Person.error));
        } else {
          callback();
        }
      };
      // 月销售额
      var MonthV = (rule, value, callback) => {
        var MonthPay = isSalePerMonth(value);
        if (value !== "") {
          if (!MonthPay.flag) {
            callback(new Error(MonthPay.error));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        moduleV: {         // 模块验证结果
          class: false     // 分类
        },
        quaForm: {
          name: "",        // 姓名
          phonenum: "",    // 手机
          bl_image_url: "",    // 营业执照照片
          sl_image_url: "",    // 许可证照片
          group_buying_info: `商家介绍：例如营业面积、本店特色等
合作店数：
套餐/产品：
人均消费：
日均可接待量：
其他介绍：`,        // 团购
          cost_per_person: "",  // 人均
          sale_per_month: ""    // 月销售额
        },
        quaRules: {
          name: [
            {validator: nameV, trigger: "blur"}
          ],
          cost_per_person: [
            {validator: personV, trigger: "blur"}
          ],
          sale_per_month: [
            {validator: MonthV, trigger: "blur"}
          ]
        }
      };
    },
    mounted() {
      this.quaForm.phonenum = getParmString("tel");
    },
    methods: {
      // 模块验证结果及取值(分类)
      module_res: function(name, value, flag) {
        var self = this;
        self.moduleV[name] = flag;      // 返回模块验证结果
        self.quaForm[name] = value;   // 返回模块数据
      },
      // 获取子模块数据（图片）
      addFormData: function(value, name) {
        this.quaForm[name] = value;
      },
      // 资质信息验证
      coopValidate: function() {
        var self = this;
        self.$refs.bus_class_children.classValidate();    // 分类验证
        self.$refs.quaForm.validate((valid) => {
          if (valid && self.moduleV.class) {
            var datas = {
              userinfo: {
                "name": self.quaForm.name,
                "phonenum": self.quaForm.phonenum
              },
              blinfo: {
                "bl_image_url": self.quaForm.bl_image_url
              },
              slinfo: {
                "sl_image_url": self.quaForm.sl_image_url
              },
              businfo: {
                group_buying_info: self.quaForm.group_buying_info,        // 团购
                cost_per_person: self.quaForm.cost_per_person,   // 人均
                sale_per_month: self.quaForm.sale_per_month      // 月销售额
              }
            };
            self.$store.commit("V_FLAG", true);
            self.$emit("coopValidate", false, datas);
          }
        });
      }
    },
    components: {
      uploadImage,
      busClassification
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
