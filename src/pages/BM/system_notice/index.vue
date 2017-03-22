<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :which="which"></tab-component>
      <br/><br/>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
               label-width="80px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="">
          <textarea id="editor1" rows="10" cols="80"></textarea>
        </el-form-item>
      </el-form>

      <div class="buttonGroup">
        <el-button type="primary" size="large"
                   @click="sendNotice">&emsp;发 送&emsp;</el-button>
      </div>
    </el-col>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import CKEDITOR from "CKEDITOR";
  import tabComponent from "../../../components/tabs/inner/index";
  import dialogTips from "../../../components/dialogTips/index.vue";
  import {SYSTEMINFO_SUBMIT_URL} from "../../../common/interface";
  import {modalHide} from "../../../common/common";

  export default{
    data() {
      return {
        tabs: {
          "notice": "系统公告"
        },
        which: "notice",
        editor: null,
        isRight: true,       // 提示框
        tips: "操作成功！",
        tipsVisible: false,
        ruleForm: {
          title: ""          // 标题
        },
        content: "",
        rules: {
          title: [
            {required: true, message: "请输入标题", trigger: "blur"}
          ]
        }
      };
    },
    mounted() {
      var self = this;
      CKEDITOR.replace("editor1", {height: "180px", width: "100%", toolbar: "MyToolbar"});
      self.editor = CKEDITOR.instances.editor1;
    },
    methods: {
      // 发送
      sendNotice: function() {
        var self = this;
        var formData = new FormData();
        self.$refs.ruleForm.validate((valid) => {
          if (valid) {       // 获取标题
            formData.set("title", self.ruleForm.title);
            self.content = self.editor.getData();         // 获取内容
            if (!self.content) {
              self.isRight = false;
              self.tips = "请填写内容！";
              self.tipsVisible = true;
              modalHide(function() {
                self.tipsVisible = false;
              });
            } else {
              var str = (self.content).replace(/<br\s*\/?>/g, "\r\\n").replace(/\s/g, "&nbsp;");
              formData.set("content", str);
              self.isRight = true;
              self.tips = "发送成功！";
              self.$http.post(SYSTEMINFO_SUBMIT_URL, formData).then(function(response) {
                if (response.body.success) {
                  self.tipsVisible = true;
                  modalHide(function() {
                    self.tipsVisible = false;
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      }
    },
    components: {
      tabComponent,
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
