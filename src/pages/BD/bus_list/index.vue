<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="申请号：">
          <input-search ref="number" name="number"
                        v-on:getRules="getFilterRules"></input-search>
        </el-form-item>

        <el-form-item class="select" label="状态：">
          <select-search ref="status" name="status"
                         :options="search.state"
                         v-on:getRules="getFilterRules"></select-search>
        </el-form-item>

        <el-form-item label="商家分类：" label-width="100px">
          <classify-search ref="class" name="class"
                           v-on:getRules="getFilterRules"></classify-search>
        </el-form-item>

        <el-form-item label="" label-width="10px">
          <el-button type="primary" size="small" icon="search"
                     @click="filterTable">查询</el-button>
        </el-form-item>

        <el-form-item style="float: right">
          <el-button type="primary" @click="download">下载列表</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" v-loading.body="loading"
                border highlight-current-row style="width: 100%;"
                row-key="bus_id">
        <el-table-column prop="number" label="商家编号" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="class" label="商家分类" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="date_join" label="开通时间" align="center" min-width="200px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="120px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton" @click="viewBus(scope.row)"> 查看</el-button>
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
  import inputSearch from "../../../components/search/input/index";
  import selectSearch from "../../../components/search/select/index";
  import classifySearch from "../../../components/search/classify/index";
  import {BUSLIST_TABLE_URL, BUSLIST_DOWNLOAD_URL} from "../../../common/interface";

  export default {
    data() {
      return {
        loading: false,
        tabs: [       // 顶部tab标签
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
        search: {                 // 搜索栏
          number: "",   // 申请号
          status: "",     // 状态
          class: "",      // 分类
          state: [                // 状态列表
            {
              value: "筹备中",
              label: "筹备中"
            }, {
              value: "营业中",
              label: "营业中"
            }, {
              value: "暂停营业",
              label: "暂停营业"
            }, {
              value: "已关闭",
              label: "已关闭"
            }]
        },
        table: {
          bususer_id: ""
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      };
    },
    mounted: function() {
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
        self.$http.get(BUSLIST_TABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            func(datas);
          }
        });
      },
      /* 填充（表格） */
      fillTable: function(data) {
        var self = this;
        var datas = alasql("SELECT * FROM ? ORDER BY number ASC", [data]);
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
        var rules = "SELECT * FROM ? WHERE number LIKE '%" + self.search.number + "%'";
        if (self.search.status !== "") {    // 状态
          rules += " AND status = ?";
        }
        if (self.search.class !== "") {    // 分类
          rules += " AND `class` LIKE '%" + self.search.class + "%'";
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
        self.$refs.class.reset();
        self.$refs.number.reset();
        self.$refs.status.reset();
        self.currentPage = 1;
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        var self = this;
        self.currentPage = currentPage;
        self.fillTable(self.totalDatas);
      },

      // 查看
      viewBus: function(row) {
        var self = this;
        self.table.bususer_id = row.bususer_id;
        self.$router.push({path: "bus_list/view#id=" + row.bus_id + "&account=" + row.account});
      },
      // 下载商家列表
      download: function() {
        var href = BUSLIST_DOWNLOAD_URL;
        var otherWindow = window.open(href, "_self");
        otherWindow.opener = null;
      }
    },
    components: {
      inputSearch,
      selectSearch,
      classifySearch
    }
  };
</script>

<style scoped>
</style>
