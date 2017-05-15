<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabsTop" :which="whichTop"></tab-component>
      <br/>

      <el-form :model="activityinfo" :rules="rules" ref="activityinfo"
               label-width="120px" label-position="left">
        <el-form-item label="日期：" label-width="80px" prop="date">
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

        <el-form-item label="活动名称：" prop="name">
          <el-col :span="6">
            <el-input v-model="activityinfo.name"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="领取次数：" required>
          <el-radio-group v-model="activityinfo.get_times" required>
            <el-radio label="E">一次/天</el-radio>
            <el-radio label="O">仅一次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="优惠券选择："></el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24">
      <tab-badge-component :tabs="tabs" :which="which"
                           :number="number" :onBadge="onBadge"
                           v-on:toggle="tabChange"></tab-badge-component>

      <el-row>
        <!--新增优惠券-->
        <el-col :span="24" v-show="which === 'addedCoupons'">
          <el-table ref="table" :data="added.tableDatas" border style="width: 100%;"
                    highlight-current-row row-key="id">
            <el-table-column label="选择" align="center" width="90px">
              <template scope="scope">
                <el-button type="danger" size="mini" icon="minus"
                           style="padding:2px;" @click="deleteCoupon(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" min-width="100px"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" min-width="150px"></el-table-column>
            <el-table-column label="优惠" align="center" min-width="160px">
              <template scope="scope">
                <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
              </template>
            </el-table-column>
            <el-table-column label="门店" align="center" min-width="110px">
              <template scope="scope">
                <span v-if="scope.row.buses[0]==='全部门店'">{{scope.row.buses[0]}}</span>
                <span v-else>
                  <el-tooltip class="item" effect="dark" content="查看门店信息" placement="bottom">
                    <el-button type="text">
                      <span>指定门店( {{scope.row.buses.length}} 家 )</span>
                    </el-button>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="有效时间" align="center" min-width="160px">
              <template scope="scope">
                <span v-if="scope.row.valid_startdate">{{scope.row.valid_startdate}}~{{scope.row.valid_enddate}}</span>
                <span v-else>24小时</span>
              </template>
            </el-table-column>
          </el-table>

          <el-row class="pageination">
            <el-pagination :current-page="added.currentPage"
                           :page-size="added.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="added.totalItems"
                           :page-sizes=[added.pageSize]
                           @current-change="handleAddedChange">
            </el-pagination>
          </el-row>
        </el-col>

        <!--优惠券列表-->
        <el-col :span="24"  v-show="which === 'couponsList'">
          <el-table ref="table" :data="list.tableDatas" border style="width: 100%;"
                    highlight-current-row :row-kry="list.tableDatas.bus_id">
            <el-table-column label="选择" align="center" width="90px">
              <template scope="scope">
                <el-button type="primary" size="mini" icon="plus"
                           style="padding:2px;" @click="addCoupon(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" align="center" min-width="100px"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" min-width="150px"></el-table-column>
            <el-table-column label="优惠" align="center" min-width="160px">
              <template scope="scope">
                <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
              </template>
            </el-table-column>
            <el-table-column label="门店" align="center" min-width="110px">
              <template scope="scope">
                <span v-if="scope.row.buses[0]==='全部门店'">{{scope.row.buses[0]}}</span>
                <span v-else>
                  <el-tooltip class="item" effect="dark" content="查看门店信息" placement="bottom">
                    <el-button type="text">
                      <span>指定门店( {{scope.row.buses.length}} 家 )</span>
                    </el-button>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="有效时间" align="center" min-width="160px">
              <template scope="scope">
                <span v-if="scope.row.valid_startdate">{{scope.row.valid_startdate}}~{{scope.row.valid_enddate}}</span>
                <span v-else>24小时</span>
              </template>
            </el-table-column>
          </el-table>

          <el-row class="pageination">
            <el-pagination :current-page="list.currentPage"
                           :page-size="list.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="list.totalItems"
                           :page-sizes=[list.pageSize]
                           @current-change="handleListChange">
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
    </el-col>

    <el-col :span="24">
      <el-button type="primary" size="large" @click="submitActivit('SAVE')">保 存</el-button>
      <el-button type="primary" size="large" @click="submitActivit('UP')">立即上线</el-button>
    </el-col>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import tabComponent from "../../../components/tabs/inner/index";
  import tabBadgeComponent from "../../../components/tabs/badge/index";
  import dialogTips from "../../../components/dialogTips/index.vue";
  import {EVENTS_CLTABLE_URL, EVENTS_ONLINE_URL,
    EVENTS_EDITINFO_URL, EVENTS_EDITEVENT_URL} from "../../../common/interface";
  import {getUrlParameters, modalHide} from "../../../common/common";

  export default {
    data() {
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
        tabsTop: {
          "add_activity": "新增活动"
        },
        whichTop: "add_activity",
        isRight: true,       // 保存提示提示框
        tips: "",
        tipsVisible: false,
        activityinfo: {
          name: "",   // 活动名称
          date: [],   // 日期
          get_times: "E"  // 领取次数
        },
        rules: {
          date: [
            {type: "array", required: true, message: "请选择活动日期", trigger: "change"}
          ],
          name: [
            {required: true, message: "请输入活动名称", trigger: "blur"}
          ]
        },
        tabs: {
          "addedCoupons": "已添加优惠券",
          "couponsList": "优惠券列表"
        },
        which: "addedCoupons",
        onBadge: "addedCoupons",
        number: 0,
        added: {         // 已选优惠券
          idArr: [],                // 门店id数组
          totalDatas: [],           // 表格总数据
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        },
        list: {         // 已选优惠券
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        }
      };
    },
    created() {
      var self = this;
      var id = getUrlParameters(window.location.hash, "id");
      if (id) {  // 修改（获取已添加优惠券）
        self.getActivityInfo(id);
      }
      self.getCouponsList();
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
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        var self = this;
        self.which = name;
        if (name === "addedCoupons") {
          self.getAddedCoupons();
        }
      },

      // 获取活动信息（修改）
      getActivityInfo: function(id) {
        var self = this;
        self.$http.get(EVENTS_EDITINFO_URL(id)).then(function(response) {
          if (response.body.success) {
            var activityinfo = response.body.content.activityinfo;
            var clist = response.body.content.clist;
            self.added.totalDatas = clist;   // 指定门店
            self.number = clist.length;
            self.getAddedCoupons();
            for (let i = 0; i < clist.length; i++) {
              self.added.idArr.push(clist[i].id);
            }
            self.activityinfo.name = activityinfo.name;   // 名称
            self.activityinfo.date = [new Date(activityinfo.startdate), new Date(activityinfo.enddate)];  // 日期
            self.activityinfo.get_times = activityinfo.get_times;  // 领取次数
          }
        });
      },
      /* 获取已添加优惠券（表格） */
      getAddedCoupons: function() {
        var self = this;
        var datas = self.added.totalDatas;
        self.added.tableDatas = datas.slice((self.added.currentPage - 1) *
          self.added.pageSize, self.added.currentPage * self.added.pageSize);
        self.added.totalItems = parseInt(datas.length);
      },
      /* 获取优惠券列表（表格） */
      getCouponsList: function() {
        var self = this;
        self.$http.get(EVENTS_CLTABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.coupons;
            self.list.tableDatas = datas.slice((self.list.currentPage - 1) *
              self.list.pageSize, self.list.currentPage * self.list.pageSize);
            self.list.totalItems = parseInt(datas.length);
          }
        });
      },

      // 添加优惠券
      addCoupon: function(row) {
        var self = this;
        var arr = self.added.idArr;
        if (arr.length < 1) {
          self.added.idArr.push(row.id);
          self.added.totalDatas.push(row);
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === row.id) {
              break;
            } else {
              if (i === arr.length - 1) {
                self.added.idArr.push(row.id);
                self.added.totalDatas.push(row);
              }
            }
          }
        }
        self.number = self.added.totalDatas.length;
      },
      // 删除优惠券
      deleteCoupon: function(row) {
        var self = this;
        var arr = self.added.idArr;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === row.id) {
            self.added.idArr.splice(i, 1);
            self.added.totalDatas.splice(i, 1);
            self.number = self.added.totalDatas.length;
            break;
          }
        }
        for (let i = 0; i < self.added.tableDatas.length; i++) {
          if (self.added.tableDatas[i].id === row.id) {
            self.added.tableDatas.splice(i, 1);
          }
        }
        if (self.number % 10 === 0) {    // 删除到一页的最后一条，返回上一页
          self.currentPage = self.currentPage - 1;
          self.handleAddedChange();
        }
      },

      // 新增优惠券（保存、上线）
      submitActivit: function(flag) {
        var self = this;
        var datas = {
          "name": self.activityinfo.name,       // 名称
          "startdate": "",   // 日期
          "enddate": "",
          "get_times": self.activityinfo.get_times,  // 领取次数
          "coupon_ids": self.added.idArr,
          "flag": flag            // SAVE 保存  UP 上线
        };
        var dateFrom = new Date(self.activityinfo.date[0]);
        var dateTo = new Date(self.activityinfo.date[1]);
        datas.startdate = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        datas.enddate = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
        self.$refs.activityinfo.validate((valid) => {
          if (valid) {
            if (self.number < 1) {   // 未选择优惠券
              self.tipsVisible = true;
              self.isRight = false;
              self.tips = "请选择优惠券！";
              modalHide(function() {
                self.tipsVisible = false;
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
                self.isRight = true;
                self.tips = "活动上线成功！";
              } else if (flag === "SAVE") {      // 保存
                self.isRight = true;
                self.tips = "活动保存成功！";
              }
              self.$http.post(url, JSON.stringify(datas), {emulateJSON: true})
                .then(function(response) {
                  if (response.body.success) {
                    self.tipsVisible = true;
                    modalHide(function() {
                      self.tipsVisible = false;
                      self.$router.push({path: "/activity_list/all"});
                    });
                  }
                });
            }
          } else {
            return false;
          }
        });
      },
      /* 改变当前页 */
      handleAddedChange(currentPage) {
        this.added.currentPage = currentPage;
        this.getAddedCoupons();
      },
      /* 改变当前页 */
      handleListChange(currentPage) {
        this.list.currentPage = currentPage;
        this.getCouponsList();
      }
    },
    components: {
      tabComponent,
      tabBadgeComponent,
      dialogTips
    }
  };
</script>

<style scoped>

</style>
