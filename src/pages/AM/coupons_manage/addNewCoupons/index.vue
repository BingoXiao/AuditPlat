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

        <el-form-item label="促销类型：" required>
          <el-select v-model="couponinfo.promotion_type" placeholder="请选择">
            <el-option
              v-for="item in couponinfo.promotion_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
          <el-col :span="1">
            <span>&emsp;减 </span>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="amount_cut">
              <el-input v-model.number="couponinfo.amount_cut"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="有效时间：" required class="form_valid">
          <el-radio-group v-model="couponinfo.validRadio" required>
            <el-row>
              <el-col :span="6">
                <el-form-item label="" label-width="0"
                              class="form_valid_days"
                              prop="validDays">
                  <el-radio label="days">
                    <el-input v-model.number="couponinfo.validDays"></el-input>
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
                      :disabled="couponinfo.validRadio==='today'"
                      :editable="false"
                      v-model="couponinfo.validDates"
                      type="daterange"
                      placeholder="选择日期范围"
                      :picker-options="pickerOptions"
                      range-separator="~">
                    </el-date-picker>
                  </el-radio>
                </el-form-item>
              </el-col>
            </el-row>

          </el-radio-group>
        </el-form-item>

        <el-form-item label="适用范围：" required class="form_shop_category">
          <el-radio-group v-model="storeRadio" required>
            <el-row>
              <el-col :span="5">
                <el-radio label="wholeStores">全平台通用</el-radio>
              </el-col>
              <el-col :span="14">
                <el-form-item label="" lable-width="0" prop="shop_category" class="form_sCategory">
                  <el-radio label="shop_category">选择品类
                    <el-select v-model="couponinfo.shop_category" placeholder="请选择">
                      <el-option
                        v-for="item in couponinfo.shop_category_list"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-radio label="someStores">选择商家
                  <el-button type="primary" icon="search" size="mini"
                             style="padding:2px 7px;" @click="search"></el-button>
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24" v-show="storeRadio === 'someStores'">
      <tab-badge-component :tabs="tabs" :which="which"
                           :number="number" :onBadge="onBadge"
                           v-on:toggle="tabChange"></tab-badge-component>
      <el-row style="margin-bottom:10px;">
        <el-col :span="5">
          <input-search :placeholder="placeholder"></input-search>
        </el-col>
      </el-row>

      <el-row>
        <!--已选商家表格-->
        <el-col :span="16" v-show="which === 'selectedStores'">
          <el-table ref="table" :data="selected.tableDatas" border style="width: 100%;"
                    highlight-current-row row-key="bus_id">
            <el-table-column label="选择" align="center" width="90px">
              <template scope="scope">
                <el-button type="danger" size="mini" icon="minus"
                           style="padding:2px;" @click="deleteStore(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="busname" label="商家名称" align="center" min-width="130px"></el-table-column>
            <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
          </el-table>

          <el-row class="pageination">
            <el-pagination :current-page="selected.currentPage"
                           :page-size="selected.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="selected.totalItems"
                           :page-sizes=[selected.pageSize]
                           @current-change="handleSelectedChange">
            </el-pagination>
          </el-row>
        </el-col>

        <!--商家搜索表格-->
        <el-col :span="16"  v-show="which !== 'selectedStores'">
          <el-table ref="table" :data="whole.tableDatas" border style="width: 100%;"
                    highlight-current-row row-kry="bus_id">
            <el-table-column label="选择" align="center" width="90px">
              <template scope="scope">
                <el-button type="primary" size="mini" icon="plus"
                           style="padding:2px;" @click="addStore(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="busname" label="商家名称" align="center" min-width="130px"></el-table-column>
            <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
          </el-table>

          <el-row class="pageination">
            <el-pagination :current-page="whole.currentPage"
                           :page-size="whole.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="whole.totalItems"
                           :page-sizes=[whole.pageSize]
                           @current-change="handleWholeChange">
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>

    </el-col>

    <el-col :span="24">
      <el-button type="primary" size="large" v-if="!urlID"
                 @click="addCoupon">新 增</el-button>
      <el-button type="primary" size="large" v-else
                 @click="addCoupon">修 改</el-button>
    </el-col>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import tabBadgeComponent from "../../../../components/tabs/badge/index";
  import inputSearch from "../../../../components/search/input/index";
  import dialogTips from "../../../../components/dialogTips/index.vue";
  import {LCLASS_URL, EVENTS_CMSEARCHSHOPS_URL, EVENTS_CMADDSHOPS_URL,
    EVENTS_CMEDIT_URL, EVENTS_CMGETINFO_URL} from "../../../../common/interface";
  import {getUrlParameters, modalHide} from "../../../../common/common";

  export default{
    data() {
      var self = this;
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
      var daysValidate = (rule, value, callback) => {
        if (self.couponinfo.validRadio === "days") {
          if (!value) {
            return callback(new Error("请输入有效天数"));
          } else {
            if (!Number.isInteger(value)) {
              callback(new Error("请输入数字值"));
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      };
      var datesValidate = (rule, value, callback) => {
        if (self.couponinfo.validRadio === "dates" && value.length < 1) {
          return callback(new Error("请输入有效日期"));
        } else {
          callback();
        }
      };
      var shopCategoryV = (rule, value, callback) => {
        if (self.storeRadio === "shop_category" && !value) {
          return callback(new Error("请选择品类"));
        } else {
          callback();
        }
      };
      return {
        pickerOptions: {
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
        urlID: "",       // url ID(按钮显示)
        isRight: true,       // 保存提示提示框
        tips: "",
        tipsVisible: false,
        couponinfo: {
          name: "",           // 优惠券名称
          type: "DISCOUNT",   // 优惠券类别:DISCOUNT,DATING
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
          amount_full: "",   // 优惠：满
          amount_cut: "",    // 优惠：减
          validRadio: "days",    // 有效日期(days,dates)
          validDays: null,        // 有效天数
          validDates: [],         // 截止日期：valid_startdate,valid_enddate
          shop_category: "",      // 选择品类
          shop_category_list: []
        },
        rules: {
          name: [
            {required: true, message: "请输入优惠券名称", trigger: "blur"}
          ],
          validDays: [
            {validator: daysValidate, trigger: "blur"}
          ],
          validDates: [
            {validator: datesValidate, trigger: "blur"}
          ],
          amount_full: [
            {validator: numberValidate, trigger: "blur"}
          ],
          amount_cut: [
            {validator: numberValidate, trigger: "blur"}
          ],
          shop_category: [
            {validator: shopCategoryV, trigger: "change"}
          ]
        },
        storeRadio: "wholeStores",   // 适用范围（wholeStores,shop_category,someStores）
        blist: [],            // 商家
        tabs: {
          "selectedStores": "已选商家",
          "storesSearch": "商家搜索"
        },
        number: 0,
        onBadge: "selectedStores",
        which: "selectedStores",
        placeholder: "请输入商家名称",
        selected: {         // 已选商家（表格）
          idArr: [],                // 商家id数组
          totalDatas: [],           // 表格总数据
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        },
        whole: {         // 已选商家(表格)
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
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
      self.getWholeTables();
      self.md_http();
    },
    methods: {
      /* 获取品类列表 */
      md_http: function() {
        var self = this;
        self.$http.get(LCLASS_URL + "?lclass_id=1").then(function(response) {
          if (response.body.success) {
            self.couponinfo.shop_category_list = response.body.content;
          }
        });
      },
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        var self = this;
        self.which = name;
        if (name === "selectedStores") {
          self.getSelectedTables();
        }
      },
      // 获取优惠券信息（修改）
      getCouponInfo: function(id) {
        function getHours(time) {   // 设置返回时间
          var arr = time.split(":");
          var res = new Date();
          res.setHours(arr[0]);
          res.setMinutes(arr[1]);
          res.setSeconds(arr[2]);
          return res;
        }
        var self = this;
        self.$http.get(EVENTS_CMGETINFO_URL(id)).then(function(response) {
          if (response.body.success) {
            var couponinfo = response.body.content.couponinfo;
            var blist = response.body.content.blist;
            self.couponinfo.name = couponinfo.name;   // 优惠券名称
            self.couponinfo.type = couponinfo.type;   // 优惠券类别
            self.couponinfo.promotion_type = couponinfo.promotion_type;   // 促销类型
            self.couponinfo.amount_full = couponinfo.amount_full;   // 满减
            self.couponinfo.amount_cut = couponinfo.amount_cut;     // 满减
            if (couponinfo.valid_days) {  // 有效时间(天数)
              self.couponinfo.validRadio = "days";
              self.couponinfo.validDays = couponinfo.valid_days;
            } else {  // 有效日期
              self.couponinfo.validRadio = "dates";
              self.couponinfo.validDates = [new Date(couponinfo.valid_startdate), new Date(couponinfo.valid_enddate)];
            }
            if (blist.length > 0) {   //  适用范围(选择商家)
              self.storeRadio = "someStores";
              for (let i = 0; i < blist.length; i++) {
                self.selected.idArr.push(blist[i].bus_id);
              }
              self.selected.totalDatas = blist;    // 指定商家
              self.number = blist.length;
              self.getSelectedTables();
            } else {
              if (couponinfo.shop_category) {
                self.storeRadio = "shop_category";  // 选择品类
                self.couponinfo.shop_category = couponinfo.shop_category;
              } else {
                self.storeRadio = "wholeStores";   // 全平台通用
              }
            }
          }
        });
      },
      /* 获取已选商家（表格） */
      getSelectedTables: function() {
        var self = this;
        var datas = self.selected.totalDatas;
        self.selected.tableDatas = datas.slice((self.selected.currentPage - 1) *
          self.selected.pageSize, self.selected.currentPage * self.selected.pageSize);
        self.selected.totalItems = parseInt(datas.length);
      },
      /* 获取商家搜索（表格） */
      getWholeTables: function() {
        var self = this;
        self.$http.get(EVENTS_CMSEARCHSHOPS_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.buses;
            self.whole.tableDatas = datas.slice((self.whole.currentPage - 1) *
              self.whole.pageSize, self.whole.currentPage * self.whole.pageSize);
            self.whole.totalItems = parseInt(datas.length);
          }
        });
      },
      // 选择商家（搜索按钮）
      search: function() {
        var self = this;
        self.storeRadio = "someStores";
        self.which = "storesSearch";
      },
      // 添加商家
      addStore: function(row) {
        var self = this;
        var arr = self.selected.idArr;
        if (arr.length < 1) {
          self.selected.idArr.push(row.bus_id);
          self.selected.totalDatas.push(row);
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === row.bus_id) {
              break;
            } else {
              if (i === arr.length - 1) {
                self.selected.idArr.push(row.bus_id);
                self.selected.totalDatas.push(row);
              }
            }
          }
        }
        self.number = self.selected.totalDatas.length;
      },
      // 删除商家
      deleteStore: function(row) {
        var self = this;
        var arr = self.selected.idArr;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === row.bus_id) {
            self.selected.idArr.splice(i, 1);
            self.selected.totalDatas.splice(i, 1);
            self.number = self.selected.totalDatas.length;
            break;
          }
        }
        for (let i = 0; i < self.selected.tableDatas.length; i++) {
          if (self.selected.tableDatas[i].bus_id === row.bus_id) {
            self.selected.tableDatas.splice(i, 1);
          }
        }
        if (self.number % 10 === 0) {    // 删除到一页的最后一条，返回上一页
          self.currentPage = self.currentPage - 1;
          self.handleSelectedChange();
        }
      },
      // 新增优惠券
      addCoupon: function() {
        var self = this;
        var datas = {
          "name": self.couponinfo.name,       // 优惠券名称
          "type": self.couponinfo.type,       // 优惠券类别
          "promotion_type": self.couponinfo.promotion_type,    // 促销类型
          "amount_full": self.couponinfo.amount_full,          // 优惠：满减
          "amount_cut": self.couponinfo.amount_cut,
          "valid_days": "",       // 有效天数
          "valid_startdate": "",  // 有效日期
          "valid_enddate": "",
          "shop_category": "",    // 选择品类
          "bus_ids": []            // 已选商家
        };
        if (self.couponinfo.validRadio === "dates") {   // 有效日期
          let dateFrom = new Date(self.couponinfo.validDates[0]);
          let dateTo = new Date(self.couponinfo.validDates[1]);
          datas.valid_startdate = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
          datas.valid_enddate = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
        } else {
          datas.valid_days = self.couponinfo.validDays;
        }
        if (self.storeRadio === "someStores") {  // 已选商家(选择商家)
          datas.bus_ids = self.selected.idArr;
        } else if (self.storeRadio === "shop_category") {  // 选择品类
          datas.shop_category = self.couponinfo.shop_category;
        }
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
      },
      /* 改变当前页 */
      handleSelectedChange(currentPage) {
        this.selected.currentPage = currentPage;
        this.getSelectedTables();
      },
      /* 改变当前页 */
      handleWholeChange(currentPage) {
        this.whole.currentPage = currentPage;
        this.getWholeTables();
      }
    },
    components: {
      tabBadgeComponent,
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
