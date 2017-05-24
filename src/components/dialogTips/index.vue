<template>
  <!--提示-->
  <el-dialog v-model="tipsVisible"
             size="tiny"
             :close-on-click-modal="false"
             class="tipsModal">
    <div class="mainTips" style="margin-bottom:40px;">
      <i :class="{'el-icon-circle-check':isRight, 'el-icon-circle-cross':!isRight}"
         :style="{color: activeColor}"></i> {{tips}}
    </div>
  </el-dialog>
</template>

<script>
  export default{
    data() {
      return {
        isRight: false,     // 操作成功的icon(true),错误icon（false）
        tips: "",           // 提示
        tipsVisible: false  // 显示与否
      };
    },
    computed: {
      activeColor: function() {
        var self = this;
        if (self.isRight) {
          return "#13CE66";
        }
      }
    },
    methods: {
      show: function(obj) {
        var self = this;
        self.isRight = obj.isRight;
        self.tips = obj.tips;
        self.tipsVisible = true;
      },
      hide: function() {
        var self = this;
        self.tipsVisible = false;
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
