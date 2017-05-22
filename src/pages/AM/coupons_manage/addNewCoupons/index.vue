<template>
  <el-row>
    <el-col :span="24" style="padding-left: 30px;">
      <el-form :model="couponinfo" :rules="rules" ref="couponinfo"
               label-width="115px" label-position="left" class="form">
        <el-form-item label="优惠券名称：" required prop="name">
          <el-col :span="7">
            <el-input v-model="couponinfo.name"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="优惠券类别：" required>
          <el-radio-group v-model="couponinfo.type" required>
            <el-radio label="DISCOUNT">优惠券</el-radio>
            <el-radio label="DATING">约会券</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="优惠金额：" required>
          <el-col :span="1">
            <span>满</span>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="amount_full">
              <el-input v-model.number="couponinfo.amount_full"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align: center">
            <span>减</span>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="amount_cut">
              <el-input v-model.number="couponinfo.amount_cut"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>

      <el-button type="primary" size="large" v-if="!urlID" @click="addCoupon">新 增</el-button>
      <el-button type="primary" size="large" v-else @click="addCoupon">修 改</el-button>
    </el-col>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import inputSearch from "../../../../components/search/input/index";
  import dialogTips from "../../../../components/dialogTips/index.vue";
  import {EVENTS_CMADDSHOPS_URL, EVENTS_CMEDIT_URL, EVENTS_CMGETINFO_URL} from "../../../../common/interface";
  import {getUrlParameters, modalHide} from "../../../../common/common";

  export default{
    data() {
      var numberValidate = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入满减金额"));
        } else {
          if (!Number.isInteger(value)) {
            callback(new Error("请输入数字值"));
          } else {
            callback();
          }
        }
      };
      return {
        urlID: "",       // url ID(按钮显示)
        isRight: true,       // 保存提示提示框
        tips: "",
        tipsVisible: false,
        couponinfo: {
          name: "",           // 优惠券名称
          type: "DISCOUNT",   // 优惠券类别:DISCOUNT,DATING
          amount_full: "",    // 优惠：满
          amount_cut: ""      // 优惠：减
        },
        rules: {
          name: [
            {required: true, message: "请输入优惠券名称", trigger: "blur"}
          ],
          amount_full: [
            {validator: numberValidate, trigger: "blur"}
          ],
          amount_cut: [
            {validator: numberValidate, trigger: "blur"}
          ]
        }
      };
    },
    mounted() {
      var self = this;
      var id = getUrlParameters(window.location.hash, "id");
      if (id) {  // 修改（获取优惠券信息）
        self.urlID = id;
        self.getCouponInfo(id);
      } else {
        self.urlID = "";
      }
    },
    methods: {
      // 获取优惠券信息（修改）
      getCouponInfo: function(id) {
        var self = this;
        self.$http.get(EVENTS_CMGETINFO_URL(id)).then(function(response) {
          if (response.body.success) {
            var couponinfo = response.body.content.couponinfo;
            self.couponinfo.name = couponinfo.name;   // 优惠券名称
            self.couponinfo.type = couponinfo.type;   // 优惠券类别
            self.couponinfo.amount_full = couponinfo.amount_full;   // 满减
            self.couponinfo.amount_cut = couponinfo.amount_cut;     // 满减
          }
        });
      },
      // 新增优惠券
      addCoupon: function() {
        var self = this;
        var datas = {
          "name": self.couponinfo.name,       // 优惠券名称
          "type": self.couponinfo.type,       // 优惠券类别
          "amount_full": self.couponinfo.amount_full,          // 优惠：满减
          "amount_cut": self.couponinfo.amount_cut
        };
        self.$refs.couponinfo.validate((valid) => {
          if (valid) {
            var id = getUrlParameters(window.location.hash, "id");
            var url = EVENTS_CMEDIT_URL(id);   // 修改
            self.tips = "修改优惠券成功！";
            if (!id) {   // 新增
              self.tips = "新增优惠券成功！";
              url = EVENTS_CMADDSHOPS_URL;
            }
            self.$http.post(url, JSON.stringify(datas), {emulateJSON: true})
              .then(function(response) {
                if (response.body.success) {
                  self.tipsVisible = true;
                  modalHide(function() {
                    self.tipsVisible = false;
                    self.$router.push({path: "/coupons_manage/my_coupons"});
                  });
                }
              });
          } else {
            return false;
          }
        });
      }
    },
    components: {
      inputSearch,
      dialogTips
    }
  };
</script>

<style scoped>
  .form{
    border-bottom: 1px solid #d7e1fa;
    margin-bottom: 20px;
  }
</style>
