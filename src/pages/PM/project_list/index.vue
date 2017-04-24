<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="90px">
        <el-form-item label="日期：" label-width="60px">
          <date-picker name="dateRange"
                       v-on:getRules="getFilterRules"></date-picker>
        </el-form-item>

        <el-form-item label="商家分类：">
          <classify-search name="class"
                           v-on:getRules="getFilterRules"></classify-search>
        </el-form-item>

        <el-form-item class="select" label="项目类型：">
          <select-search name="typein"
                         :options="search.type"
                         v-on:getRules="getFilterRules"></select-search>
        </el-form-item>

        <el-form-item class="select" label="状态：">
          <select-search name="status"
                         :options="search.state"
                         v-on:getRules="getFilterRules"></select-search>
        </el-form-item>

        <el-form-item label="门店名称：">
          <input-search name="name"
                        :placeholder="search.placeholder"
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
                border highlight-current-row
                style="width: 100%;" row-key="item_id">
        <el-table-column prop="submit_time" label="申请时间" align="center" min-width="120px"></el-table-column>
        <el-table-column label="门店名称" align="center" min-width="130px">
          <template scope="scope">
            <div v-for="item in scope.row.bus_names">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目名称" align="center" min-width="130px"></el-table-column>
        <el-table-column label="项目分类" align="center" min-width="180px">
          <template scope="scope">
            <span v-for="item in scope.row.class">{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item_type" label="项目类型" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="80px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"
                       @click="viewInfo(scope.row)"> 查看</el-button>
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
  import datePicker from "../../../components/search/datePicker/index";
  import inputSearch from "../../../components/search/input/index";
  import selectSearch from "../../../components/search/select/index";
  import classifySearch from "../../../components/search/classify/index";
  import {PROLIST_TABLE_URL} from "../../../common/interface";

  export default {
    data() {
      return {
        loading: false,
        search: {                 // 搜索栏
          name: "",    // 申请号
          placeholder: "门店名称/项目名称",
          dateRange: [],   // 日期
          status: "",      // 状态
          class: "",       // 分类
          typein: "",      // 项目类型
          state: [                // 状态列表
            {
              value: "通过",
              label: "通过"
            }, {
              value: "驳回",
              label: "驳回"
            }],
          type: [                // 状态列表
            {
              value: "套餐券",
              label: "套餐券"
            }, {
              value: "商品券",
              label: "商品券"
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
    created: function() {
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
        self.$http.get(PROLIST_TABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            for (let i = 0; i < datas.length; i++) {
              var item = datas[i];
              item.bus_names = item.bus_names.split(" ");  // 门店名称
              item.class = item.class.split(" ");          // 项目分类
              for (let i = 0; i < item.class.length - 1; i++) {
                item.class[i] = item.class[i] + " > ";
              }
            }
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
        var rules = "SELECT * FROM ? WHERE (bus_names LIKE '%" + self.search.name + "%'" +
          " OR name LIKE '%" + self.search.name + "%')";
        if (self.search.status !== "") {    // 状态
          rules += " AND status = ?";
        }
        if (self.search.typein !== "") {    // 项目类型
          rules += " AND item_type LIKE '%" + self.search.typein + "%'";
        }
        if (self.search.class !== "") {    // 分类
          rules += " AND `class` LIKE '%" + self.search.class + "%'";
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

      /* 查看 */
      viewInfo: function(row) {
        var self = this;
        self.$router.push({path: self.$route.path + "/content#id=" + row.item_id});
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this;
        self.currentPage = currentPage;
        self.fillTable(self.totalDatas);
      }
    },
    components: {
      datePicker,
      inputSearch,
      selectSearch,
      classifySearch
    }
  };
</script>

<style scoped>
</style>
