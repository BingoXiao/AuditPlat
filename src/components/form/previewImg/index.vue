<template>
  <div>
    <div class="imgWrapper">
      <div class = "avatar-uploader" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}">
        <img :src="image" class="avatar"
             @mouseenter="coverVisible = true">
      </div>
      <!--预览图片-->
      <div v-if="image" class="cover" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
           v-show="coverVisible" @mouseleave="coverVisible = false"
           @click="dialogVisible = true">
        <div class="amplify">
          <i class="el-icon-view"></i>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :close-on-click-modal="false">
      <img width="100%" :src="image" alt=""/>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    props: {
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgSrc: String       // 图片填充来源
    },
    data() {
      return {
        http: "",
        dialogVisible: false,   // 查看大图片
        coverVisible: false     // 放大层
      };
    },
    computed: {
      // 图片展示
      image: function() {
        var self = this;
        if (self.imgSrc !== "") {
          return self.http + self.imgSrc;
        }
      }
    }
  };
</script>

<style scoped>
  .imgWrapper{
    position: relative;
  }

  .avatar-uploader{
    font-size: 14px;
    font-family: "Microsoft YaHei";
    position: relative;
    text-align: center;
    border: 1px dashed #bbb;
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
