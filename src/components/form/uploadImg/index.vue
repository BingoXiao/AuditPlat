<template>
  <el-col :span="24">
    <div class="imgWrapper">
      <!--上传图片-->
      <el-upload
        class="avatar-uploader"
        :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
        name="image"
        accept="image/png,image/jpeg,image/jpg"
        :action="upload_url"
        :show-file-list="false"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload">
        <div ref="upload_tips" class="upload_tips">
          <div class="el-upload__text">{{imgName}}</div>
          <el-button size="small" type="primary">点击上传</el-button>
        </div>
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </el-upload>
    </div>

    <!--样片展示-->
    <div class="imgSample">
      <img :src="imgSrc" alt="" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}">
    </div>

    <!--上传提示-->
    <div v-if="tipsFlag" class="imgTips" :style="{height: imgHeight + 'px'}">
      <ol>
        <li v-for="(item, index) in tips">{{item}}</li>
      </ol>
    </div>
    <!--错误提示-->
    <div v-else class="imgTips" :style="{height: imgHeight + 'px'}">
      <div>{{tipError}}</div>
    </div>
  </el-col>
</template>

<script>
  import {TEMP_PHOTOS_URL} from "../../../common/interface";

  export default{
    props: {
      tips: Array,          // 要求
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgName: String,      // 名称展示
      imgSrc: String,       // 样片展示
      suffix_name: String,  // 图片名称(返回)
      imgFill: String       // 图片展示（商家资料）
    },
    data() {
      return {
        upload_url: TEMP_PHOTOS_URL,   // 上传地址
        imageUrl: "",                  // 图片的URL
        tipError: "请上传小于2M的图片（仅支持JPG、JPEG、PNG格式）",
        tipsFlag: true                 // 上传错误标志
      };
    },
    watch: {
      // 图片展示
      imgFill: function() {
        var self = this;
        if (self.imgFill !== "") {
          self.imageUrl = self.imgFill;
          self.$refs.upload_tips.style.display = "none";
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
      // 上传图片前验证
      beforeUpload(file) {
        var self = this;
        const isJPG = (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png");
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG || !isLt2M) {
          self.tipError = "请上传小于2M的图片（仅支持JPG、JPEG、PNG格式）";
          if (self.imageUrl !== "") {
            self.tipsFlag = false;
            setTimeout(function() {
              self.tipsFlag = true;
            }, 2000);
          } else {
            self.tipsFlag = false;
          }
        } else {
          self.tipsFlag = true;
        }
        return isJPG && isLt2M;
      },
      // 上传成功（返回父组件相关信息）
      handleSuccess(res, file) {
        var self = this;
        self.$refs.upload_tips.style.display = "none";
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
  .imgWrapper, .imgSample, .imgTips{
    float: left;
  }

  .imgSample{
    margin-left: 30px;
  }

  .imgTips{
    display: table;
  }

  .imgTips>ol, .imgTips>div{
    font-size: 10px;
    display: table-cell;
    vertical-align: bottom;
    padding-left: 30px;
  }

  .imgTips>ol>li{
    line-height: 20px;
    color: #909090;
  }

  .imgTips>div{
    color: #ff4949;
  }

  .avatar-uploader{
    font-size: 14px;
    font-family: "Microsoft YaHei";
    position: relative;
    text-align: center;
  }

  .upload_tips{
    width: 100%;
    height: 100%;
    display: table-cell;
    vertical-align:middle;
  }

  .avatar {
    width: 100%;
    height: 100%;
  }

  .cover {
    position: absolute;
    left: 1px;
    top: 1px;
    text-align: center;
    display: table;
    background-color:rgba(0, 0, 0, 0.45)
  }

  .amplify {
    cursor: pointer;
    font-size: 26px;
    color: #a8a8a8;
    display: table-cell;
    vertical-align: middle;
  }
</style>
