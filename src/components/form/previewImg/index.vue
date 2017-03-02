<template>
  <el-col :span="24">
    <div class="imgWrapper">
      <div class = "avatar-uploader">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" @mouseenter="coverVisible = true"
             @mouseleave="coverVisible = false">
      </div>
    </div>

    <div class="imgSample">
      <img :src="imgSrc" alt="" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}">
    </div>

    <div v-if="tipsFlag" class="imgTips" :style="{height: imgHeight + 'px'}">
      <ol>
        <li v-for="(item, index) in tips">{{item}}</li>
      </ol>
    </div>

    <!--预览图片-->
    <div class="cover" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
         v-show="coverVisible">
      <div class="amplify" @click="dialogVisible = true">
        <i class="el-icon-view"></i>
      </div>
      <el-dialog v-model="dialogVisible"
                 :close-on-click-modal="false">
        <img width="100%" :src="imageUrl" alt="">
      </el-dialog>
    </div>
  </el-col>
</template>

<script>
  export default{
    props: {
      tips: Array,          // 要求
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgSrc: String,       // 样片展示
      suffix_name: String,  // 图片名称(返回)
      imgFill: String       // 图片填充来源
    },
    data() {
      return {
        imageUrl: "",
        dialogVisible: false,
        coverVisible: false
      }
    },
    watch: {
      // 图片展示
      imgFill: function() {
        var self = this
        if (self.imgFill !== "") {
          self.imageUrl = "https://shopmanage-dev.jinmailife.com" + self.imgFill
        }
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
