<template>
  <div>
    <div class="imgWrapper">
      <!--上传图片-->
      <el-upload
        class = "avatar-uploader"
        list-type="picture-card"
        :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
        name="image"
        accept="image/png,image/jpeg,image/jpg"
        :action="upload_url"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
        <img v-if="image" :src="image" class="avatar">
      </el-upload>

      <div class = "avatar-uploader" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}">
        <img :src="image" class="avatar" @mouseenter="coverVisible = true">
      </div>

      <!--错误提示-->
      <div v-if="error" class="imgTips" :style="{height: imgHeight + 'px'}">
        <div>请上传小于2M的图片（仅支持JPG、JPEG、PNG格式）</div>
      </div>
    </div>

    <!--预览图片-->
    <div v-if="image" class="cover" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
         v-show="coverVisible" @mouseleave="coverVisible = false"
         @click="dialogVisible = true">
      <div class="amplify">
        <i class="el-icon-view"></i>
        <i class="el-icon-delete"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import {TEMP_PHOTOS_URL} from "../../../common/interface"

  export default{
    props: {
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgFill: String       // 图片资料
    },
    data() {
      return {
        upload_url: TEMP_PHOTOS_URL,   // 上传地址
        image: "",                  // 图片的URL
        error: "",                     // 上传错误标志
        dialogVisible: false,   // 查看大图片
        coverVisible: false      // 放大层
      }
    },
    watch: {
      // 图片展示
      imgFill: function() {
        var self = this
        if (self.imgFill !== "") {
          self.$refs.upload_tips.style.display = "none"
          self.image = "https://shopmanage-dev.jinmailife.com" + self.imgFill
        }
      }
    },
    methods: {
      // 上传图片验证
      validate: function() {
        var self = this
        if (self.imageUrl === "") {
          self.tipsFlag = false
        } else {
          self.tipsFlag = true
        }
      },
      // 上传图片前验证
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
      // 上传成功（返回父组件相关信息）
      handleSuccess(res, file) {
        var self = this
        self.$refs.upload_tips.style.display = "none"
        self.image = "" + file.url
        // 图片url 及 对应名称
        self.$emit("handleSuccess", res.content.url, self.suffix_name)
      },
      // 文件列表移除文件
      handleRemove: function(file, fileList) {
        console.log(file, fileList)
      }
    }
  }
</script>

<style scoped>
  .imgWrapper, .imgTips{
    float: left;
  }

  .el-icon-plus{
    font-size: 30px;
    color: #a5a5a5;
    display: table-cell;
    vertical-align: middle;
  }

  .imgTips{
    display: table;
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
    background-color:rgba(0, 0, 0, 0.4)
  }

  .amplify {
    cursor: pointer;
    font-size: 26px;
    color: #a8a8a8;
    display: table-cell;
    vertical-align: middle;
  }
</style>
