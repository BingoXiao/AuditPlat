<template>
  <el-col>
    <!--筛选栏-->
    <!--结款申请-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="60px">
          <el-form-item label="日期：">
            <date-picker name="dateRange"
                         v-on:getRules="getFilterRules"></date-picker>
          </el-form-item>

          <el-form-item label="退款号：" label-width="90px">
            <input-search name="number"
                          v-on:getRules="getFilterRules"></input-search>
          </el-form-item>

          <el-form-item label="" label-width="10px">
            <el-button type="primary" size="small" icon="search"
                       @click="filterTable">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--表格-->
      <el-col :span="24">
        <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                  highlight-current-row style="width: 100%;"
                  row-key="item_id">
          <el-table-column prop="submit_time" label="提交时间" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="number" label="退款号" align="center" min-width="150px"></el-table-column>
          <el-table-column prop="token" label="团购券号码" align="center" min-width="150px"></el-table-column>
          <el-table-column prop="item" label="项目名称" align="center" min-width="130px"></el-table-column>
          <el-table-column prop="deserve" label="购买金额" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="status" label="团购券状态" align="center" min-width="100px"></el-table-column>
          <el-table-column prop="consume_time" label="消费时间" align="center" min-width="120px"></el-table-column>
          <el-table-column prop="create_time" label="上线时间" align="center" min-width="120px"></el-table-column>
          <el-table-column label="操作" align="center" min-width="120px">
            <template scope="scope">
              <el-button size="small" icon="search" class="tableButton"
                         @click="view(scope.row)"> 退款原因</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col class="pageination" :span="24">
        <el-pagination :current-page="currentPage"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalItems"
                       :page-sizes="[pageSize]"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
      </el-dialog>
    </el-col>

    <!--退款原因-->
    <el-dialog title="退款原因" v-model="dialogVisible" size="tiny">
      <el-row type="flex" justify="center">
        <el-col :span="20" :offset="1">
          <div class="dialogContent">
            {{content}}
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align: center">
        <el-button type="primary" @click="dialogVisible = false">返 回</el-button>
      </el-row>
    </el-dialog>
  </el-col>
</template>

<script>
  import alasql from "alasql";
  import inputSearch from "../../../../components/search/input/index";
  import datePicker from "../../../../components/search/datePicker/index";
  import {CHECKVERIFY_REFUNDRECORD_URL} from "../../../../common/interface";

  export default {
    props: {
      tab: String
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        content: "",         // 退款原因
        search: {          // 搜索栏
          number: "",     // 账号
          dateRange: []    // 日期
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
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
        self.$http.get(CHECKVERIFY_REFUNDRECORD_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            func(datas);
          }
        });
      },
      /* 填充（表格） */
      fillTable: function(data) {
        var self = this;
        var datas = alasql("SELECT * FROM ? ORDER BY consume_time DESC", [data]);
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

      /* 获取选中项 */
      getSelectedArr: function(selection) {
        var self = this;
        var arr = [];
        for (let i = 0; i < selection.length; i++) {
          arr.push(selection[i].applynum);
        }
        self.selectArr = arr;
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.getTables();
      },

      // 查看
      view: function(row) {
        var self = this;
        self.content = row.refund_reason;
        self.dialogVisible = true;
      }
    },
    components: {
      inputSearch,
      datePicker
    }
  };
</script>

<style scoped>
  .dialogContent{
    padding: 10px;
    border: 1px solid #c2c3ce;
    margin:20px 10px;
    height: 120px;
  }
</style>
