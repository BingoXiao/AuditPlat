<template>
  <div>
    <br/><br/>
    <textarea id="editor2" rows="10" cols="80"></textarea>

    <el-row class="buttonGroup">
      <br/>
      <el-button type="primary" size="large" @click="saveSpot('S')">&emsp;保 存&emsp;</el-button>
      <el-button size="large" @click="preview">&emsp;预 览&emsp;</el-button>
      <el-button type="primary" size="large" @click="saveSpot('R')">&emsp;上 线&emsp;</el-button>
    </el-row>

    <!--预览脉点-->
    <el-dialog title="" class="jinmai" :close-on-click-modal="false"
               v-model="spotVisible">
      <div v-html="data"></div>
    </el-dialog>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </div>
</template>

<script>
  import CKEDITOR from "CKEDITOR";
  import dialogTips from "../../../../../components/dialogTips/index.vue";
  import {getUrlParameters, modalHide} from "../../../../../common/common";
  import {PROLIST_JM_URL, PROLIST_JMDATA_URL} from "../../../../../common/interface";

  let editor;
  export default{
    data() {
      return {
        data: "",     // 脉点
        spotVisible: false,  // 预览
        isRight: true,       // 提示框
        tips: "",
        tipsVisible: false
      };
    },
    mounted() {
      var self = this;
      CKEDITOR.replace("editor2", {height: "300px", width: "100%", toolbar: "Full"});
      editor = CKEDITOR.instances.editor2;
      var id = getUrlParameters(window.location.hash, "id");
      self.$http.get(PROLIST_JMDATA_URL + "?item_id=" + id)
        .then(function(response) {
          if (response.body.success) {
            editor.setData(response.body.content);
            self.data = response.body.content;
          }
        });
    },
    methods: {
      // 预览图
      preview: function() {
        var self = this;
        self.spotVisible = true;
        self.getData();
      },
      // 保存脉点
      saveSpot: function(type) {
        var self = this;
        var formData = new FormData();
        self.getData();
        if (!self.data) {
          self.isRight = false;
          self.tips = "请填写脉点！";
          self.tipsVisible = true;
          modalHide(function() {
            self.tipsVisible = false;
          });
        } else {
          if (type === "S") {
            self.tips = "保存成功！";
          } else {
            self.tips = "上线成功！";
          }
          formData.set("item_id", getUrlParameters(window.location.hash, "id"));
          formData.set("data", editor.getData());
          formData.set("type", type);
          self.$http.post(PROLIST_JM_URL, formData).then(function(response) {
            if (response.body.success) {
              self.tipsVisible = true;
              modalHide(function() {
                self.tipsVisible = false;
                self.$router.push({path: "/project_list"});
              });
            }
          });
        }
      },
      // 获取脉点
      getData: function() {
        var self = this;
        self.data = editor.getData();
        self.$emit("getData", editor.getData());
      }
    },
    components: {
      dialogTips
    }
  };
</script>

