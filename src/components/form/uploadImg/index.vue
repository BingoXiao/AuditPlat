<template>
  <el-col :span="24">
    <div class="imgWrapper">
      <el-upload
        class = "avatar-uploader"
        :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
        name="image"
        accept="image/png,image/jpeg,image/jpg"
        :action="upload_url"
        :show-file-list="false"
        :on-success="handleScucess"
        :before-upload="beforeUpload">
        <div ref="upload_tips" class="upload_tips">
          <div class="el-upload__text">{{imgName}}</div>
          <el-button size="small" type="primary">点击上传</el-button>
        </div>
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </el-upload>
    </div>

    <div class="imgSample">
      <img :src="imgSrc" alt="" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}">
    </div>

    <div v-if="tipsFlag" class="imgTips" :style="{height: imgHeight + 'px'}">
      <ol>
        <li v-for="(item, index) in tips">{{item}}</li>
      </ol>
    </div>
    <div v-else class="imgTips" :style="{height: imgHeight + 'px'}">
      <div>请上传小于2M的图片（仅支持JPG、JPEG、PNG格式）</div>
    </div>
  </el-col>
</template>

<script>
  import {TEMP_PHOTOS_URL} from "../../../common/interface"

  export default{
    props: {
      tips: Array,
      imgWidth: Number,
      imgHeight: Number,
      imgName: String,
      imgSrc: String,
      suffix_name: String
    },
    data() {
      return {
        upload_url: "" + TEMP_PHOTOS_URL,
        imageUrl: "",
        tipsFlag: true
      }
    },
    methods: {
      validate: function() {
        var self = this
        if (self.imageUrl === "") {
          self.tipsFlag = false
        } else {
          self.tipsFlag = true
        }
      },
      beforeUpload(file) {
        var self = this
        const isJPG = (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png")
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG || !isLt2M) {
          if (self.imageUrl !== "") {
            self.tipsFlag = false
            setTimeout(function() {
              self.tipsFlag = true
            }, 2000)
          } else {
            self.tipsFlag = false
          }
        } else {
          self.tipsFlag = true
        }
        return isJPG && isLt2M
      },
      handleScucess(res, file) {
        var self = this
        self.$refs.upload_tips.style.display = "none"
        self.imageUrl = "" + file.url
        self.$emit("handleScucess", res.content.url, self.suffix_name)
      }
    }
  }
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
</style>
