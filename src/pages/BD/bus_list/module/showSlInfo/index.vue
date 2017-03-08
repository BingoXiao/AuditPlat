<template>
  <el-col :span="24">
    <el-form ref="blForm" label-width="130px" label-position="left">
      <h3 class="formTitle">餐饮服务许可证</h3>
      <el-form-item label="上传清晰餐饮服务许可证照片：" required label-width="230px">
        <show-image :imgWidth="220" :imgHeight="140" :imgSrc="sl_image_url"></show-image>
      </el-form-item>

      <el-form-item label="许可证件名称：" required>
        <span class="info">{{sl_name}}</span>
      </el-form-item>

      <el-form-item label="许可证件编号：" required>
        <span class="info">{{sl_code}}</span>
      </el-form-item>

      <el-form-item label="许可证件地址：" required>
        <span class="info">{{sl_address}}</span>
      </el-form-item>

      <el-form-item label="注册有效期：" required>
        <span class="info">{{sl_expire}}</span>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import showImage from "../../../../../components/form/previewImg/index.vue"
  import radioCheck from "../../../../../components/radio/index.vue"

  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      return {
        sl_code: "",    // 许可证编号
        sl_image_url: "",  // 许可证图片
        sl_name: "",       // 许可证名称
        sl_expire: "",     // 许可证有效期
        sl_address: ""     // 许可证地址
      }
    },
    watch: {
      filling: function() {
        var self = this
        var slinfo = self.filling
        self.sl_code = slinfo.sl_code
        self.sl_image_url = slinfo.sl_image_url
        self.sl_name = slinfo.sl_name
        self.sl_address = slinfo.sl_address
        self.sl_expire = slinfo.sl_expire
      }
    },
    components: {
      showImage,
      radioCheck
    }
  }
</script>

<style scoped>

</style>
