<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="60px">
        <el-form-item label="日期：">
          <date-picker ref="dateRange" name="dateRange"
                       v-on:getRules="getFilterRules"></date-picker>
        </el-form-item>

        <el-form-item label="优惠券名称：" label-width="120px">
          <input-search ref="coupon" name="coupon"
                        v-on:getRules="getFilterRules"></input-search>
        </el-form-item>

        <el-form-item label="" label-width="10px">
          <el-button type="primary" size="small" icon="search"
                     @click="filterTable">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" v-loading.body="loading"
                border row-key="id" style="width: 100%;"
                highlight-current-row>
        <el-table-column prop="name" label="优惠券名称" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="type" label="类别" align="center" min-width="100px"></el-table-column>
        <el-table-column label="适用范围" align="center" min-width="110px">
          <template scope="scope">
            <span v-if="scope.row.buses[0]==='全平台通用'">{{scope.row.buses[0]}}</span>
            <span v-else>
              <el-tooltip class="item" effect="dark" content="查看门店信息" placement="bottom">
                <el-button type="text" @click="viewStores(scope.row)">
                  <span>指定门店( {{scope.row.buses.length}} 家 )</span>
                </el-button>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" align="center" min-width="150px">
          <template scope="scope">
            <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
          </template>
        </el-table-column>
        <el-table-column label="有效时间" align="center" min-width="140px">
          <template scope="scope">
            <span v-if="scope.row.valid_days">{{scope.row.valid_days}} 天</span>
            <span v-else>{{scope.row.valid_startdate}} 至 {{scope.row.valid_enddate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="160px">
          <template scope="scope">
            <el-button size="small" icon="edit" class="tableButton"
                       @click="editCoupon(scope.row)"> 修改</el-button>
            <el-button size="small" icon="delete" class="tableButton"
                       @click="deleteCoupon(scope.row)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-col class="pageination" :span="24">
      <el-pagination :current-page="currentPage"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalItems"
                     :page-sizes=[pageSize]
                     @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import alasql from "alasql";
  import datePicker from "../../../../components/search/datePicker/index";
  import inputSearch from "../../../../components/search/input/index";
  import dialogTips from "../../../../components/dialogTips/index.vue";
  import {EVENTS_CMTABLE_URL, EVENTS_CMDELETE_URL} from "../../../../common/interface";
  import {modalHide} from "../../../../common/common";

  export default{
    data() {
      return {
        loading: false,
        search: {         // 搜索栏
          dateRange: [],  // 日期
          coupon: ""      // 优惠券名称
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        isRight: true,       // 保存提示提示框
        tips: "删除成功！",
        tipsVisible: false
      };
    },
    mounted() {
      var self = this;
      self.getTables(function(datas) {
        self.fillTable(datas);
      });
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function(func) {
        var self = this;
        self.loading = true;
        self.$http.get(EVENTS_CMTABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.coupons;
            func(datas);
          }
        });
      },
      /* 填充（表格） */
      fillTable: function(data) {
        var self = this;
        var datas = alasql("SELECT * FROM ? ORDER BY create_datetime DESC", [data]);
        self.totalDatas = datas;
        self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize,
          self.currentPage * self.pageSize);
        self.totalItems = parseInt(datas.length);
        setTimeout(function() {
          self.loading = false;
        });
      },

      /* 获取过滤条件 */
      getFilterRules: function(name, value) {
        var self = this;
        self.search[name] = value;
      },
      /* 过滤 */
      filterTable: function() {
        var self = this;
        var rules = "SELECT * FROM ? WHERE name LIKE '%" + self.search.coupon + "%'";
        if (self.search.dateRange[0] && self.search.dateRange[0] !== "") {     // 日期
          rules += "AND create_datetime >= '" + self.search.dateRange[0] + " 00:00:00'" +
            " AND create_datetime <= '" + self.search.dateRange[1] + " 23:59:59'";
        }
        self.getTables(function(datas) {
          var res = alasql(rules, [datas, self.search.status]);
          self.currentPage = 1;
          self.fillTable(res);
        });
      },
      /* 清空筛选 */
      rulesReset: function() {
        var self = this;
        self.$refs.dateRange.reset();
        self.$refs.coupon.reset();
        self.currentPage = 1;
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this;
        self.currentPage = currentPage;
        self.fillTable(self.totalDatas);
      },

      // 查看指定门店信息
      viewStores: function(row) {
        this.$router.push({path: "/coupons_manage/specified_stores#id=" +
        row.id + "&name=" + row.name});
      },
      // 修改优惠券
      editCoupon: function(row) {
        this.$router.push({path: "/coupons_manage/add_new_coupons/#id=" + row.id});
        this.$emit("tabChange");
      },
      // 删除优惠券
      deleteCoupon: function(row) {
        var self = this;
        self.$confirm("请确认是否删除该优惠券？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false
        }).then(() => {
          self.$http.post(EVENTS_CMDELETE_URL(row.id)).then(function(response) {
            if (response.body.success) {
              self.tipsVisible = true;
              modalHide(function() {
                self.tipsVisible = false;
                self.getTables(function(datas) {
                  self.fillTable(datas);
                  self.rulesReset();
                });
              });
            }
          });
        }).catch(() => {});
      }
    },
    components: {
      datePicker,
      inputSearch,
      dialogTips
    }
  };
</script>

<style scoped>

</style>
