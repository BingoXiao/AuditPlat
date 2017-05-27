<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabsTop" :which="whichTop"></tab-component>
      <br/>

      <el-form :model="activityinfo"
               :rules="rules"
               ref="activityinfo"
               label-width="100px"
               label-position="left">
        <el-form-item label="发放日期：" label-width="100px" prop="date" required>
          <el-date-picker
            ref="date"
            :editable="false"
            :clearable="false"
            v-model="activityinfo.date"
            type="daterange"
            placeholder="选择日期范围"
            :picker-options="pickerOptions"
            range-separator="~">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动名称：" prop="name" required>
          <el-col :span="6">
            <el-input v-model.trim="activityinfo.name"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="活动图片：" required>
          <upload-image-component ref="photo"
                                  style="margin-top: 13px;"
                                  :imgWidth="140" :imgHeight="140"
                                  :imgFill="activityinfo.photo"
                                  suffix_name="photo"
                                  v-on:handleSuccess="addFormData">
          </upload-image-component>
        </el-form-item>

        <el-form-item label="领取次数：" required>
          <el-radio-group v-model="activityinfo.get_times" required>
            <el-radio label="E">一次/天</el-radio>
            <el-radio label="O">仅一次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="促销类型：" required>
          <el-select v-model="activityinfo.promotion_type" placeholder="请选择">
            <el-option
              v-for="item in activityinfo.promotion_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="有效时间：" class="form_valid" required>
          <el-radio-group v-model="activityinfo.validRadio" required
                          @change="validTimeValidate">
            <el-row>
              <el-col :span="6">
                <el-form-item label="" label-width="0" class="form_valid_days">
                  <el-radio label="days">
                    <el-input v-model.trim.number="activityinfo.validDays"
                              @blur="validTimeValidate"></el-input>
                    <span> 天 </span>
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="2">
                <el-form-item label="" label-width="0"
                              class="form_valid_dates"
                              prop="validDates">
                  <el-radio label="dates">
                    <span>截止日期：</span>
                    <el-date-picker
                      ref="date"
                      :disabled="activityinfo.validRadio==='today'"
                      :editable="false"
                      v-model="activityinfo.validDates"
                      type="daterange"
                      placeholder="选择日期范围"
                      :picker-options="pickerOptions"
                      range-separator="~"
                      @change="validTimeValidate">
                    </el-date-picker>
                    <span v-if="activityinfo.valid_error"
                          class="error" style="font-size: 12px;">{{activityinfo.valid_error}}</span>
                  </el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="适用范围：" required class="form_shop_category">
          <el-radio-group v-model="storeRadio" @change="shopCategoryValidate">
            <el-row>
              <el-col :span="5">
                <el-radio label="wholeStores">全平台通用</el-radio>
              </el-col>
              <el-col :span="14">
                <el-form-item label="" lable-width="0" class="form_sCategory">
                  <el-radio label="shop_category">选择品类
                    <el-select v-model="activityinfo.shop_category"
                               placeholder="请选择"
                               @change="shopCategoryValidate">
                      <el-option
                        v-for="item in activityinfo.shop_category_list"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <span v-if="activityinfo.store_error"
                          class="error" style="font-size: 12px;">{{activityinfo.store_error}}</span>
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-radio label="someStores">选择商家
                  <span class="busSearch">
                    <span class="el-icon-search"></span>
                  </span>
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>

        <!--选择商家-->
        <shops-table-component ref="shopsTable"
                               v-if="storeRadio==='someStores'"
                               :datas="shops.tableDatas"
                               :table="shops.table"></shops-table-component>


        <el-form-item label="优惠券选择："></el-form-item>
        <!--选择优惠券-->
        <coupons-table-component ref="couponsTable"
                                 :datas="coupons.tableDatas"
                                 :table="coupons.table"></coupons-table-component>
      </el-form>
    </el-col>

    <el-col :span="24">
      <el-button type="primary" size="large" @click="submitActivity('SAVE')">保 存</el-button>
      <el-button type="primary" size="large" @click="submitActivity('UP')">立即上线</el-button>
    </el-col>

    <!--提示-->
    <dialogTips ref="resNL"></dialogTips>
  </el-row>
</template>

<script>
  import tabComponent from "../../../components/tabs/inner/index";
  import uploadImageComponent from "../../../components/form/uploadImg_unlimited/index.vue";
  import shopsTableComponent from "./modules/shopsTable/index.vue";
  import couponsTableComponent from "./modules/couponsTable/index.vue";
  import dialogTips from "../../../components/dialogTips/index.vue";
  import {EVENTS_ONLINE_URL, LCLASS_URL, EVENTS_EDITINFO_URL,
    EVENTS_EDITEVENT_URL} from "../../../common/interface";
  import {getUrlParameters, modalHide, isInteger} from "../../../common/common";

  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
        },
        tabsTop: {
          "add_activity": "新增活动"
        },
        whichTop: "add_activity",
        activityinfo: {
          date: [],   // 发放日期
          name: "",   // 活动名称
          photo: "",  // 活动图片
          get_times: "E",  // 领取次数
          promotion_type: "N",    // 促销类型
          promotion_type_options: [
            {
              label: "新用户",
              value: "N"
            }, {
              label: "节点促销",
              value: "F"
            }, {
              label: "品牌合作",
              value: "B"
            }
          ],
          validRadio: "days",    // 有效日期(days,dates)
          validDays: null,        // 有效天数
          validDates: [],         // 截止日期：valid_startdate,valid_enddate
          shop_category: "",      // 选择品类
          shop_category_list: [],
          valid_error: "",   //  有效时间（错误提示）
          store_error: ""       // 适用范围（错误提示）
        },
        rules: {
          date: [
            {type: "array", required: true, message: "请选择活动日期", trigger: "change"}
          ],
          name: [
            {required: true, message: "请输入活动名称", trigger: "blur"}
          ]
        },
        storeRadio: "wholeStores",   // 适用范围（wholeStores,shop_category,someStores）
        shops: {
          "tableDatas": [],  // 已选商家表格数据
          "table": "storesSearch"  // 商家表格显示
        },
        coupons: {
          "tableDatas": [],  // 已选优惠券表格数据
          "table": "wholeCoupons"  // 优惠券表格显示
        },
        tips: ""   // 模态框提示信息
      };
    },
    created() {
      var self = this;
      var id = getUrlParameters(window.location.hash, "id");
      if (id) {  // 修改（获取已添加优惠券）
        self.getActivityInfo(id);
      }
      self.md_http();
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      if (getUrlParameters(window.location.hash, "id")) {
        next({path: "/add_Activity#id=" + window.location.hash});
      } else {
        next();
      }
    },
    methods: {
      // 获取子模块数据(图片)
      addFormData: function(value, name) {
        this.activityinfo[name] = value;
      },
      /* 获取品类列表 */
      md_http: function() {
        var self = this;
        self.$http.get(LCLASS_URL + "?lclass_id=1").then(function(response) {
          if (response.body.success) {
            self.activityinfo.shop_category_list = response.body.content;
          }
        });
      },
      // 获取活动信息（修改）
      getActivityInfo: function(id) {
        var self = this;
        self.$http.get(EVENTS_EDITINFO_URL(id)).then(function(response) {
          if (response.body.success) {
            var activityinfo = response.body.content.activityinfo;
            self.activityinfo.date = [new Date(activityinfo.startdate), new Date(activityinfo.enddate)];  // 发放日期
            self.activityinfo.name = activityinfo.name;   // 活动名称
            self.activityinfo.photo = activityinfo.photo;   // 活动图片
            self.activityinfo.get_times = activityinfo.get_times;  // 领取次数
            self.activityinfo.promotion_type = activityinfo.promotion_type;   // 促销类型
            if (activityinfo.valid_days > 0) {  // 有效时间(天数)
              self.activityinfo.validRadio = "days";
              self.activityinfo.validDays = activityinfo.valid_days;
            } else {  // 有效日期
              self.activityinfo.validRadio = "dates";
              self.activityinfo.validDates = [new Date(activityinfo.valid_startdate), new Date(activityinfo.valid_enddate)];
            }
            if (activityinfo.shop_category) {     //  适用范围
              self.storeRadio = "shop_category";   // 选择品类
              self.activityinfo.shop_category = parseInt(activityinfo.shop_category);
            } else {
              if (activityinfo.buses_name.length > 0) {   // 选择商家
                self.storeRadio = "someStores";
                self.shops.tableDatas = response.body.content.blist;    // 指定商家表格数据
                self.shops.table = "selectedStores";
              } else {
                self.storeRadio = "wholeStores";   // 全平台通用
              }
            }
            self.coupons.tableDatas = response.body.content.clist;  // 已选优惠券表格数据
            self.coupons.table = "selectedCoupons";
          }
        });
      },

      // 有效时间验证
      validTimeValidate: function() {
        var self = this;
        if (self.activityinfo.validRadio === "dates") {   // 验证有效时间
          if (!self.activityinfo.validDates[0]) {
            self.activityinfo.valid_error = "请输入有效日期";
          } else if (new Date(self.activityinfo.validDates[0]).toLocaleDateString() >= new Date(self.activityinfo.date[0]).toLocaleDateString() &&
            new Date(self.activityinfo.validDates[1]).toLocaleDateString() >= new Date(self.activityinfo.date[1]).toLocaleDateString()) {
            self.activityinfo.valid_error = "";
          } else {
            self.activityinfo.valid_error = "请选择合适的截止日期";
          }
        } else {
          let validate = isInteger(self.activityinfo.validDays, "有效天数");
          self.activityinfo.valid_error = validate.error;
        }
      },
      // 使用范围（选择品类）验证
      shopCategoryValidate: function() {
        var self = this;
        if (self.storeRadio === "shop_category") {   // 验证使用范围（选择品类）
          if (!self.activityinfo.shop_category) {
            self.activityinfo.store_error = "请选择品类";
          } else {
            self.activityinfo.store_error = "";
          }
        } else {
          self.activityinfo.store_error = "";
        }
      },

      // 新增优惠券（保存、上线）
      submitActivity: function(flag) {
        var self = this;
        var datas = {
          "name": self.activityinfo.name,    // 活动名称
          "startdate": "",                   // 活动日期
          "enddate": "",
          "photo": self.activityinfo.photo,  // 活动图片
          "get_times": self.activityinfo.get_times,       // 领取次数
          "promotion_type": self.activityinfo.promotion_type,    // 促销类型
          "valid_days": "",       // 有效天数
          "valid_startdate": "",  // 有效日期
          "valid_enddate": "",
          "shop_category": "",    // 选择品类
          "bus_ids": [],          // 已选商家
          "coupon_ids": [],       // 已添加商家
          "flag": flag            // SAVE 保存  UP 上线
        };
        self.$refs.photo.validate();   // 验证图片是否上传
        self.validTimeValidate();
        self.shopCategoryValidate();
        self.$refs.activityinfo.validate((valid) => {
          if (valid && self.activityinfo.photo &&
        (!self.activityinfo.valid_error) && (!self.activityinfo.store_error)) {
          // 发放日期
            var dateFrom = new Date(self.activityinfo.date[0]);
            var dateTo = new Date(self.activityinfo.date[1]);
            datas.startdate = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
            datas.enddate = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
          // 有效日期
            if (self.activityinfo.validRadio === "dates") {
              let dateFrom = new Date(self.activityinfo.validDates[0]);
              let dateTo = new Date(self.activityinfo.validDates[1]);
              datas.valid_startdate = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
              datas.valid_enddate = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
            } else {
              datas.valid_days = self.activityinfo.validDays;
            }
          // 已选商家(选择商家)
            if (self.storeRadio === "someStores") {
              datas.bus_ids = self.$refs.shopsTable.returnBusIds();
              if (datas.bus_ids.length < 1) {
                self.$refs.resNL.show({
                  isRight: false,
                  tips: "请选择商家！"
                });
                modalHide(function() {
                  self.$refs.resNL.hide();
                });
              }
            } else if (self.storeRadio === "shop_category") {  // 选择品类
              datas.shop_category = self.activityinfo.shop_category;
            }

            // 选择优惠券
            if (self.storeRadio !== "someStores" || (self.storeRadio === "someStores" && datas.bus_ids.length > 0)) {
              datas.coupon_ids = self.$refs.couponsTable.returnIds();
              if (datas.coupon_ids.length < 1) {
                self.$refs.resNL.show({
                  isRight: false,
                  tips: "请选择优惠券！"
                });
                modalHide(function() {
                  self.$refs.resNL.hide();
                });
              } else {
                let id = getUrlParameters(window.location.hash, "id");
                let url = "";
                if (!id) {    // 新增活动
                  url = EVENTS_ONLINE_URL;
                } else {      // 修改活动
                  url = EVENTS_EDITEVENT_URL(id);
                }
                if (flag === "UP") {               // 立即上线
                  self.tips = "活动上线成功！";
                } else if (flag === "SAVE") {      // 保存
                  self.tips = "活动保存成功！";
                }
//                console.log(datas);
                self.$http.post(url, JSON.stringify(datas), {emulateJSON: true})
                  .then(function(response) {
                    if (response.body.success) {
                      self.$refs.resNL.show({
                        isRight: true,
                        tips: self.tips
                      });
                      modalHide(function() {
                        self.$refs.resNL.hide();
                        self.$router.push({path: "/activity_list/all"});
                      });
                    }
                  });
              }
            }
          }
        });
      }
    },
    components: {
      tabComponent,
      dialogTips,
      uploadImageComponent,
      shopsTableComponent,
      couponsTableComponent
    }
  };
</script>

<style scoped>
  .busSearch{
    color: #fff;
    font-size: 10px;
    background-color: #000;
    padding: 2px 5px 1px 5px;
    border-radius: 3px;
  }
</style>
