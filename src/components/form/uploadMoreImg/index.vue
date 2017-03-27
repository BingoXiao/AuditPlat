<template>
  <div>
    <div class="imgWrapper">
      <ul class="imgList" v-if="imageObject.length > 0">
        <li v-for="(item, index) in imageObject">
          <div class = "avatar-uploader">
            <img :src="http + item.image" class="avatar"
                 :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
                 @mouseenter="item.coverVisible = true">
            <!--预览和删除-->
            <div v-if="item" class="cover" :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
                 v-show="item.coverVisible" @mouseleave="item.coverVisible = false">
              <div class="amplify">
                <i class="el-icon-view" @click="viewImg(index)"></i>
                <i class="el-icon-delete" @click="deleteImg(index)"></i>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!--上传图片-->
      <el-upload
        v-if="imageObject.length<3"
        class="avatar-uploader"
        list-type="picture-card"
        :style="{width: imgWidth + 'px', height: imgHeight + 'px'}"
        name="image"
        accept="image/png,image/jpeg,image/jpg"
        :action="upload_url"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>

    <!--错误提示-->
    <div v-if="error" class="error imgTips" :style="{height: imgHeight + 'px'}">
      <div class="upload_tips">{{error}}</div>
    </div>

    <!--预览图片-->
    <el-dialog v-model="dialogVisible" :close-on-click-modal="false">
      <img width="100%" :src="http + image" alt=""/>
    </el-dialog>
  </div>
</template>

<script>
  import {TEMP_PHOTOS_URL} from "../../../common/interface";

  export default{
    props: {
      imgWidth: Number,     // 图片宽度
      imgHeight: Number,    // 图片高度
      imgFill: Array        // 图片资料
    },
    data() {
      return {
        http: "",
        upload_url: TEMP_PHOTOS_URL,   // 上传地址
        imageObject: [],               // 图片组合
        image: "",                     // 当前图片
        error: "",                     // 上传错误标志
        dialogVisible: false           // 预览图片
      };
    },
    watch: {
      // 图片展示
      imgFill: function() {
        var self = this;
        if (self.imgFill.length > 0) {
          for (let i = 0; i < self.imgFill.length; i++) {
            let item = self.imgFill[i];
            if (item !== "") {
              let obj = {
                coverVisible: false,
                image: self.imgFill[i]
              };
              self.imageObject.push(obj);
            }
          }
        }
      }
    },
    methods: {
      // 上传图片前验证
      beforeUpload(file) {
        var self = this;
        const isJPG = (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png");
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG || !isLt2M) {
          self.error = "请上传小于2M的图片（仅支持JPG、JPEG、PNG格式）";
        } else {
          self.error = "";
        }
        return isJPG && isLt2M;
      },
      // 上传成功（返回父组件相关信息）
      handleSuccess(res, file) {
        var self = this;
        let obj = {
          "coverVisible": false,
          "image": res.content.url
        };
        self.error = "";
        self.imageObject.push(obj);
      },
      // 预览图片
      viewImg: function(index) {
        var self = this;
        self.dialogVisible = true;
        self.image = self.imageObject[index].image;
      },
      // 文件列表移除文件
      deleteImg: function(index) {
        var self = this;
        // 注释：该方法会改变原始数组
        self.imageObject.splice(index, 1);
      },
      // 返回图片列表
      get_image_list: function() {
        var self = this;
        let arr = ["", "", ""];
        for (let i = 0; i < self.imageObject.length; i++) {
          arr[i] = self.imageObject[i].image;
        }
        // 图片url 及 对应名称
        self.$emit("get_image_list", arr, "consImage");
      }
    }
  };
</script>

<style scoped>
  .imgWrapper, .imgTips{
    float: left;
    margin-top: 20px;
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
    border: 1px dashed #bbb;
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

  .imgList{
    list-style: none;
    float: left;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  .imgList li{
    float: left;
    margin-right: 15px;
  }
</style>
