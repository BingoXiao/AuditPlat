<template>
  <el-col :span="24">
    <el-form id="consForm" :model="consForm" :rules="consRules" ref="consForm"
             label-width="130px">
      <h3 class="formTitle">商家合约</h3>
      <el-form-item label="合同有效期：" required prop="date">
        <el-col :span="10">
          <el-date-picker
            v-model="consForm.date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            @change="getDate">
          </el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="合同名称：" required prop="name">
        <el-col :span="10">
          <el-input v-model="consForm.name" name="name"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="合同图片：" required>
        <el-col :span="24">
          <span style="font-size:10px;" :style="{color: error}">
            （图片最多上传三张，文件大小不超过2M，文件格式为jpg\jpeg\png）
          </span>
        </el-col>
        <el-col :span="24">
          <upload-more-image ref="imageChild" :imgWidth="140" :imgHeight="140"
                             :imgFill="consForm.imageList"
                             v-on:get_image_list="get_data">
          </upload-more-image>
        </el-col>
      </el-form-item>
    </el-form>

    <el-col :span="20" :offset="1">
      <el-button type="primary" size="large" class="buttonGroup"
                 @click="saveConstract">&emsp;保 存&emsp;</el-button>
    </el-col>

    <!--提示-->
    <dialogTips ref="resNL"></dialogTips>
  </el-col>
</template>

<script>
  import uploadMoreImage from "../../../../../components/form/uploadMoreImg/index";
  import dialogTips from "../../../../../components/dialogTips/index.vue";
  import {BUSLIST_SUBMITCONSTRA_URL} from "../../../../../common/interface";
  import {modalHide} from "../../../../../common/common";

  export default{
    props: {
      account: String,    // 商家账号
      filling: Object     // 信息填充
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        consForm: {
          name: "",      // 合同名称
          date: "",      // 合同过有效期
          imageList: [], // 展示图片
          consImage: []  // 提交合约图片
        },
        error: "#7c7c7c",   // 未上传图片
        consRules: {
          name: [
            {required: true, message: "请填写合同名称", trigger: "blur"}
          ],
          date: [
            {required: true, message: "请选择合同有效期", trigger: "change"}
          ]
        }
      };
    },
    watch: {
      filling: function() {
        var self = this;
        var cons = self.filling;
        if (cons) {
          self.consForm.name = cons.name;       // 合同名称
          self.consForm.date = cons.date;   // 合同过有效期
          let arr = [];
          for (let i = 1; i <= 3; i++) {
            let item = "image" + i + "_url";
            if (cons[item] !== "") {
              arr.push(cons[item]);
            }
          }
          self.consForm.imageList = arr;
        }
      }
    },
    methods: {
      // 获取合约图片列表
      get_data: function(value, name) {
        var self = this;
        self.consForm[name] = value;
      },
      // 获取日期
      getDate: function(value) {
        var self = this;
        self.consForm.date = value;
      },
      // 保存合同该内容
      saveConstract: function() {
        var self = this;
        self.$refs.imageChild.get_image_list();
        if (self.consForm.consImage.length > 0) {
          var consForm = document.getElementById("consForm");
          var formData = new FormData(consForm);
          formData.append("date", self.consForm.date);
          formData.append("account", self.account);
          for (let i = 1; i <= self.consForm.consImage.length; i++) {
            formData.append("image" + [i] + "_url", self.consForm.consImage[i - 1]);
          }
//          for (var pair of formData.entries()) {
//            console.log(pair[0] + ", " + pair[1])
//          }
          self.$refs.consForm.validate((valid) => {
            if (valid) {
              self.$http.post(BUSLIST_SUBMITCONSTRA_URL, formData)
                .then(function(response) {
                  if (response.data.success) {
                    self.$refs.resNL.show({
                      isRight: true,
                      tips: "合约修改成功！"
                    });
                    modalHide(function() {
                      self.$refs.resNL.hide();
                    });
                  }
                });
            }
          });
        } else {
          self.error = "#ff4949";
        }
      }
    },
    components: {
      uploadMoreImage,
      dialogTips
    }
  };
</script>

<style scoped>

</style>
