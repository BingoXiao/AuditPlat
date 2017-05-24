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
    <dialogTips ref="resNL"></dialogTips>
  </div>
</template>

<script>
  import CKEDITOR from "CKEDITOR";
  import dialogTips from "../../../../../components/dialogTips/index.vue";
  import {getCookie, getUrlParameters, modalHide} from "../../../../../common/common";
  import {PROLIST_JM_URL, PROLIST_JMDATA_URL} from "../../../../../common/interface";

  var editor = null;
  export default{
    data() {
      return {
        data: "",            // 脉点
        spotVisible: false,  // 预览
        tips: ""   // 模态框提示信息
      };
    },
    mounted() {
      var self = this;
      var id = getUrlParameters(window.location.hash, "id");
      CKEDITOR.replace("editor2", {height: "300px", width: "100%", toolbar: "Full"});
      editor = CKEDITOR.instances.editor2;
      self.showSpot(id); // 展示脉点内容
      // 对话框显示后（跨网站攻击：表单插入csrfToken）
      editor.on("dialogShow", function(ev) {
        var dialogName = ev.data._.name;
        if (dialogName === "image") {
          var iframea = document.getElementsByClassName("cke_dialog_ui_input_file")[1].contentWindow;
          var form = iframea.document.getElementsByTagName("form")[0];
          var csrf = document.createElement("input");
          csrf.setAttribute("type", "hidden");
          csrf.setAttribute("name", "csrfmiddlewaretoken");
          csrf.value = getCookie("csrftoken");
          form.insertBefore(csrf, form.childNodes[0]);
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
      // 设置并展示脉点内容
      showSpot: function(id) {
        var self = this;
        self.$http.get(PROLIST_JMDATA_URL + "?item_id=" + id)
          .then(function(response) {
            if (response.body.success) {
              self.data = response.body.content;
              // 实例构建完成后
              editor.on("instanceReady", function(ev) {
                editor.setData(response.body.content);
              });
            }
          });
      },
      // 保存脉点
      saveSpot: function(type) {
        var self = this;
        var formData = new FormData();
        self.getData();
        if (!self.data) {
          self.$refs.resNL.show({
            isRight: false,
            tips: "请填写脉点！"
          });
          modalHide(function() {
            self.$refs.resNL.hide();
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
              self.$refs.resNL.show({
                isRight: false,
                tips: self.tips
              });
              modalHide(function() {
                self.$refs.resNL.hide();
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
//        self.$emit("getData", editor.getData());
      }
    },
    components: {
      dialogTips
    }
  };
</script>

