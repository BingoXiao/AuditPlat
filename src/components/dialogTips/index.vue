<template>
  <!--提示-->
  <el-dialog v-model="tipsVisible" size="tiny"
             :close-on-click-modal="false" class="tipsModal">
    <div class="mainTips" style="margin-bottom:40px;">
      <i :class="{'el-icon-circle-check':isRight, 'el-icon-circle-cross':!isRight}"
         :style="{color: activeColor}"></i> {{tips}}
    </div>
  </el-dialog>
</template>

<script>
  export default{
    props: {
      isRight: Boolean,     // 操作成功的icon(true),错误icon（false）
      tips: String,         // 提示语句
      tipsVisible: Boolean  // 显示与否
    },
    computed: {
      activeColor: function() {
        var self = this;
        if (self.isRight) {
          return "#13CE66";
        }
      }
    }
  };
</script>

<style scoped>
  .mainTips i{
    font-size: 30px;
    color: #FF4949;
  }
</style>
