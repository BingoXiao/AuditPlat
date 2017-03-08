<template>
  <el-col :span="24">
    <el-form :model="consForm" :rules="consRules" ref="consForm"
             label-width="130px">
      <h3 class="formTitle">商家合约</h3>
      <el-form-item label="合同有效期：" required>
        <el-col :span="10">
          <el-input v-model="consForm.expire"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="合同名称：" required>
        <el-col :span="10">
          <el-input v-model="consForm.name"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="合同图片：" required>
        <el-col :span="24">
          <span style="font-size:10px;color:#7c7c7c">(图片最多上传三张，文件大小不超过2M，文件格式为bmp\png\jpeg\jpg\jpg或gif)</span>
        </el-col>
        <el-col :span="24">
          <upload-more-image :imgWidth="140" :imgHeight="140" :imgFill="consForm.image"></upload-more-image>
        </el-col>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
  import uploadMoreImage from "../../../../../components/form/uploadMoreImg/index"

  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      return {
        consForm: {
          name: "",       // 合同名称
          expire: "",     // 合同过有效期
          image: require("../../../../../assets/big.png")
        },
        consRules: {
          name: [
            {required: true, message: "请填写合同名称", trigger: "blur"}
          ],
          expire: [
            {required: true, message: "请选择合同有效期", trigger: "blur"}
          ]
        },
        dialogImageUrl: '',
        dialogVisible: false
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
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    },
    components: {
      uploadMoreImage
    }
  }
</script>

<style scoped>

</style>
