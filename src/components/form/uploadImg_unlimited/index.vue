<template>
  <el-col :span="24">
    <div class="imgWrapper">
      <!--上传图片-->
      <el-upload
        name="image"
        class="avatar-uploader"
        :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
        :headers="headers"
        :action="upload_url"
        :show-file-list="false"
        :on-success="handleSuccess"
        :on-error="handleError">
        <i v-if="!imageUrl" class="el-icon-plus"></i>
        <img v-if="imageUrl"
             :src="imageUrl"
             :style="{width: imgWidth + 'px', height: imgHeight + 'px'}">
      </el-upload>
    </div>

    <!--错误提示-->
    <div v-if="!tipsFlag" class="imgTips" :style="{height: imgHeight + 'px'}">
      <div>请上传图片<div/>
    </div>
  </el-col>
</template>

<script>
  import {TEMP_PHOTOS_URL} from "../../../common/interface";
  import {getCookie} from "../../../common/common";

  export default{
    props: {
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgName: String,      // 名称展示
      imgSrc: String,       // 样片展示
      suffix_name: String,  // 图片名称(返回)
      imgFill: String       // 图片展示（商家资料）
    },
    data() {
      return {
        headers: {        // 请求头
          "X-CSRFToken": getCookie("csrftoken")
        },
        upload_url: TEMP_PHOTOS_URL,   // 上传地址
        imageUrl: "",                  // 图片的URL
        tipsFlag: true                 // 上传错误标志
      };
    },
    watch: {
      // 图片展示
      imgFill: function() {
        var self = this;
        if (self.imgFill !== "") {
          self.imageUrl = self.imgFill;
        }
      }
    },
    methods: {
      // 上传图片验证
      validate: function() {
        var self = this;
        if (self.imageUrl === "") {
          self.tipsFlag = false;
        } else {
          self.tipsFlag = true;
        }
      },
      // 上传成功（返回父组件相关信息）
      handleSuccess(res, file) {
        var self = this;
        self.imageUrl = "" + file.url;
        // 图片url 及 对应名称
        self.$emit("handleSuccess", res.content.url, self.suffix_name);
      },
      // 上传失败
      handleError(res, file) {
        var self = this;
        self.tipError = "上传图片失败，请重试！";
        self.tipsFlag = false;
        setTimeout(function() {
          self.tipsFlag = true;
        }, 2000);
      }
    }
  };
</script>

<style scoped>
  .imgWrapper, .imgTips{
    float: left;
  }

  .imgTips{
    display: table;
  }

  .imgTips>div{
    font-size: 12px;
    color: #ff4949;
    display: table-cell;
    vertical-align: middle;
    padding-left: 20px;
  }

  .avatar-uploader{
    font-size: 14px;
    font-family: "Microsoft YaHei";
    position: relative;
    text-align: center;
  }

  .el-icon-plus{
    font-size: 30px;
    color: #a5a5a5;
    display: table-cell;
    vertical-align: middle;
  }
</style>
