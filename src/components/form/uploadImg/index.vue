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

    <!--预览图片-->
    <div class="cover" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
         v-if="coverVisible"
         :moveenter="coverVisible = true"
         :moveleave="coverVisible = false">
      <div class="amplify" @click="handlePreview">
        <i class="el-icon-view"></i>
      </div>
    </div>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-col>
</template>

<script>
  import {TEMP_PHOTOS_URL} from "../../../common/interface"

  export default{
    props: {
      tips: Array,          // 要求
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgName: String,      // 图片名称（展示）
      imgSrc: String,       // 样片展示
      suffix_name: String,  // 图片名称(返回)
      imgFill: String       // 图片填充来源
    },
    data() {
      return {
        upload_url: "" + TEMP_PHOTOS_URL,
        imageUrl: "",
        tipsFlag: true,
        dialogImageUrl: "",
        dialogVisible: false
      }
    },
    watch: {
      imgFill: function() {
        var self = this
        if (self.imgFill) {
          self.$refs.upload_tips.style.display = "none"
          self.imageUrl = "https://shopmanage-dev.jinmailife.com" + self.imgFill
        }
      }
    },
    mounted() {

    },
    methods: {
      handlePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
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
