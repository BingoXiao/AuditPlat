<template>
  <el-col :span="24">
    <el-form ref="blForm" label-width="160px" label-position="left">
      <h3 class="formTitle">营业执照</h3>
      <el-form-item label="上传清晰营业执照照片：" required label-width="200px">
        <show-image :imgWidth="220" :imgHeight="140" :imgSrc="bl_image_url"></show-image>
      </el-form-item>

      <el-form-item label="营业执照名称：" required>
        <span class="info">{{bl_name}}</span>
      </el-form-item>

      <el-form-item label="营业执照注册号：" required>
        <span class="info">{{bl_account}}</span>
      </el-form-item>

      <el-form-item label="营业执照注册地址：" required>
        <span class="info">{{bl_address}}</span>
      </el-form-item>

      <el-form-item label="注册有效期：" required>
        <el-col :span="5">
          <radio-check :selected="blRadio"><span>长期有效</span></radio-check>
        </el-col>
        <el-col :span="14">
          <radio-check :selected="!blRadio"><span>到期日期为：{{bl_expire}}</span></radio-check>
        </el-col>
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
        bl_account: "",    // 营业执照注册号
        bl_image_url: "",  // 营业执照图片
        bl_name: "",       // 营业执照名称
        blRadio: true,       // 有效期
        bl_expire: "",     // 营业执照有效期
        bl_address: ""     // 营业执照地址
      }
    },
    watch: {
      filling: function() {
        var self = this
        var blinfo = self.filling
        self.bl_account = blinfo.bl_account
        self.bl_image_url = blinfo.bl_image_url
        self.bl_name = blinfo.bl_name
        self.bl_address = blinfo.bl_address
        if (self.bl_expire) {
          self.blRadio = false
          self.bl_expire = blinfo.bl_expire
        } else {
          self.blRadio = true
          self.bl_expire = "无"
        }
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
