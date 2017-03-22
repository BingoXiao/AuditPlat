<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
    </el-col>

    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="60px">
        <el-form-item label="日期：">
          <date-picker ref="dateRange" name="dateRange"
                       v-on:getRules="getFilterRules"></date-picker>
        </el-form-item>

        <el-form-item label="申请号：" label-width="80px">
          <input-search ref="applynum" name="applynum"
                        v-on:getRules="getFilterRules"></input-search>
        </el-form-item>

        <el-form-item class="select" label="状态：">
          <select-search ref="status" name="status"
                         :options="search.state"
                         v-on:getRules="getFilterRules"></select-search>
        </el-form-item>

        <el-form-item class="select" label="BD：">
          <bd-list ref="bd" name="bd"
                   v-on:getRules="getFilterRules"></bd-list>
        </el-form-item>

        <el-form-item label="" label-width="10px">
          <el-button type="primary" size="small" icon="search"
                     @click="filterTable">查询</el-button>
        </el-form-item>

        <el-form-item v-show="$route.params.type !== 'apply'" style="float: right">
          <el-button size="small" style="padding:8px 15px;" @click="editInfo">立即注册</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row style="width: 100%;">
        <el-table-column prop="applynum" label="注册号" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="name" label="联系人" align="center" min-width="100px"></el-table-column>
        <el-table-column label="状态" align="center" width="150px">
          <template scope="scope">
            <div>{{scope.row.status}}</div>
            <span v-if="scope.row.reject_reason"
                  style="font-size: 12px;color: #ff4949">{{scope.row.reject_reason}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bd" label="BD" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="center" width="180px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="280px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"
                       v-if="$route.params.type === 'apply'"
                       @click="viewInfo(scope.row)"> 查看</el-button>
            <el-button size="small" icon="document" class="tableButton"
                       v-if="scope.row.status === '未处理'"
                       @click="applyRe(scope.row)"> 注册</el-button>
            <el-button size="small" icon="edit" class="tableButton"
                       v-if="scope.row.status !== '未处理' && scope.row.status !== '送审中'"
                       @click="editInfo(scope.row)"> 修改</el-button>
            <span v-if="scope.row.status === '送审中'"><b> —— </b></span>
            <el-button size="small" icon="delete2" class="tableButton"
                       v-if="scope.row.status !== '送审中'" @click="deleteBus(scope.row)"> 删除</el-button>
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
  </el-row>
</template>

<script>
  import alasql from "alasql";
  import tabComponent from "../../../components/tabs/router/index";
  import datePicker from "../../../components/search/datePicker/index";
  import inputSearch from "../../../components/search/input/index";
  import selectSearch from "../../../components/search/select/index";
  import bdList from "../../../components/search/BDlist/index";
  import {BDREGISTER_TABLE_URL, BDREGISTER_DELETE_URL} from "../../../common/interface";

  export default {
    data() {
      return {
        loading: false,
        tabs: [
          {
            param: "new",
            name: "新店注册"
          },
          {
            param: "branch",
            name: "分店注册"
          },
          {
            param: "apply",
            name: "商家申请注册"
          }
        ],
        search: {         // 搜索栏
          dateRange: [],  // 日期
          applynum: "",   // 申请号
          status: "",     // 状态
          bd: "",         // BD
          state: [               // 状态列表
            {
              value: "未处理",
              label: "未处理"
            }, {
              value: "处理中",
              label: "处理中"
            }, {
              value: "送审中",
              label: "送审中"
            }, {
              value: "驳回",
              label: "驳回"
            }]
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      };
    },
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/bus_register/:type") {
        next({path: "/bus_register/new"});
      } else {
        next();
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      var self = this;
      if (to.path === "/bus_register/:type") {
        next({path: "/bus_register/new"});
      } else {
        next();
      }
      self.getTables(function(datas) {  // APPLY,NEW,BRANCH
        self.totalDatas = datas;
        self.fillTable(datas);
        self.rulesReset();
      });
    },
    mounted: function() {
      var self = this;
      self.getTables(function(datas) {  // APPLY,NEW,BRANCH
        self.totalDatas = datas;
        self.fillTable(datas);
      });
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function() {
        var self = this;
        self.rulesReset();
        self.getTables(function(datas) {  // APPLY,NEW,BRANCH
          self.totalDatas = datas;
          self.fillTable(datas);
        });
      },

      /* 获取数据（表格） */
      getTables: function(func) {
        var self = this;
        self.loading = true;
        var type = (self.$route.params.type).toUpperCase();
        self.$http.get(BDREGISTER_TABLE_URL + "?type=" + type).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            func(datas);
          }
        });
      },
      /* 填充（表格） */
      fillTable: function(data) {
        var self = this;
        var datas = alasql("SELECT * FROM ? ORDER BY submit_time DESC", [data]);
        self.totalDatas = datas;
        self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize);
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
        var rules = "SELECT * FROM ? WHERE applynum LIKE '%" + self.search.applynum + "%'";
        if (self.search.status !== "") {    // 状态
          rules += " AND status = ?";
        }
        if (self.search.bd !== "") {    // bd
          rules += " AND bd LIKE '%" + self.search.bd + "%'";
        }
        if (self.search.dateRange[0] && self.search.dateRange[0] !== "") {     // 日期
          rules += "AND submit_time >= '" + self.search.dateRange[0] + " 00:00:00'" +
            " AND submit_time <= '" + self.search.dateRange[1] + " 23:59:59'";
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
        self.$refs.applynum.reset();
        self.$refs.bd.reset();
        self.$refs.status.reset();
        self.currentPage = 1;
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this;
        self.currentPage = currentPage;
        self.fillTable(self.totalDatas);
      },

      /* 查看 */
      viewInfo: function(row) {
        var href, otherWindow;
        href = "#/bus_register/apply/view#id=" + row.applynum;
        otherWindow = window.open(href);
        otherWindow.opener = null;
      },
      /* 商家申请注册 */
      applyRe: function(row) {
        var href, otherWindow;
        href = "#/bus_register/new/register#id=" + row.applynum;
        otherWindow = window.open(href);
        otherWindow.opener = null;
      },
      /* 立即注册、修改 */
      editInfo: function(row) {
        var self = this;
        var type = self.$route.params.type;
        var href, otherWindow;
        if (type === "new") {   // 新店
          if (!row.applynum) {                      // 立即注册
            href = "#/bus_register/new/register";
          } else {                                  // 修改
            href = "#/bus_register/new/register#id=" + row.applynum;
          }
        } else if (type === "branch") {               // 分店
          if (!row.applynum) {                       // 立即注册
            href = "#/bus_register/branch/register";
          } else {                                   // 修改
            href = "#/bus_register/branch/register#id=" + row.applynum;
          }
        } else if (type === "apply") {
          href = "#/bus_register/apply/register#id=" + row.applynum;
        }
        otherWindow = window.open(href);
        otherWindow.opener = null;
      },
      /* 删除（新店、分店） */
      deleteBus: function(row) {
        var self = this;
        self.$confirm("确认删除商家" + "：" + row.busname + "?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          self.$http.post(BDREGISTER_DELETE_URL(row.applynum))
          .then(function(response) {
            if (response.body.success) {
              self.getTables(function(datas) {
                self.fillTable(datas);
                self.rulesReset();
              });
            }
          });
        });
      }
    },
    components: {
      tabComponent,
      datePicker,
      inputSearch,
      selectSearch,
      bdList
    }
  };
</script>

<style scoped>

</style>
