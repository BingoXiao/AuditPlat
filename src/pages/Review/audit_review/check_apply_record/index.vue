<template>
  <el-row>
    <!--筛选栏-->
    <!--结款申请记录-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="60px">
          <el-form-item label="日期：">
            <date-picker ref="dateRange" name="dateRange"
                         v-on:getRules="getFilterRules"></date-picker>
          </el-form-item>

          <el-form-item label="商家账号：" label-width="100px">
            <input-search ref="account" name="account"
                          v-on:getRules="getFilterRules"></input-search>
          </el-form-item>

          <el-form-item label="" label-width="10px">
            <el-button type="primary" size="small" icon="search"
                       @click="filterTable">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col :span="24" class="toolbar" style="margin-bottom:10px;">
          <el-button type="primary" @click="download">下载结款明细</el-button>
        </el-col>
      </el-row>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row style="width: 100%;"
                row-key="applynum"
                @selection-change="getSelectedArr">
        <el-table-column type="selection" width="48"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="center" min-width="180px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="bank_name" label="开户名称" align="center" min-width="180px"></el-table-column>
        <el-table-column prop="person_or_company_name" label="开户行" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="bank_account" label="银行账户" align="center" min-width="160px"></el-table-column>
        <el-table-column prop="balance" label="提款金额" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="80px"></el-table-column>
      </el-table>
    </el-col>

    <el-col class="pageination" :span="24">
      <el-pagination :current-page="currentPage"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalItems"
                     :page-sizes="[10, 20, 50, 100]"
                     @current-change="handleCurrentChange"
                     @size-change="pageSizesChange">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import alasql from "alasql"
  import inputSearch from "../../../../components/search/input/index"
  import datePicker from "../../../../components/search/datePicker/index"
  import {CHECKVERIFY_APPLY_URL, CHECKVERIFY_RECORD_DOWNLOAD_URL} from "../../../../common/interface"

  export default {
    props: {
      tab: String
    },
    data() {
      return {
        loading: false,
        selectArr: [],            // 选中数组
        search: {         // 搜索栏
          name: "",       // 账号
          dateRange: []   // 日期
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    mounted() {
      var self = this
      self.getTables(function(datas) {
        self.fillTable(datas)
      })
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function(func) {
        var self = this
        self.loading = true
        self.$http.get(CHECKVERIFY_APPLY_URL + "?type=H").then(function(response) {
          if (response.body.success) {
            var datas = response.body.content
            func(datas)
          }
        })
      },
      /* 填充（表格） */
      fillTable: function(datas) {
        var self = this
        self.totalDatas = datas
        self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
        self.totalItems = parseInt(datas.length)
        setTimeout(function() {
          self.loading = false
        })
      },

      /* 获取过滤条件 */
      getFilterRules: function(name, value) {
        var self = this
        self.search[name] = value
      },
      /* 过滤 */
      filterTable: function() {
        var self = this
        var rules = "SELECT * FROM ? WHERE account LIKE '%" + self.search.account + "%'"
        if (self.search.dateRange[0] && self.search.dateRange[0] !== "") {     // 日期
          rules += "AND submit_time >= '" + self.search.dateRange[0] + " 00:00:00'" +
            " AND submit_time <= '" + self.search.dateRange[1] + " 23:59:59'"
        }
        self.getTables(function(datas) {
          var res = alasql(rules, [datas, self.search.status])
          self.currentPage = 1
          self.fillTable(res)
        })
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this
        self.currentPage = currentPage
        self.fillTable(self.totalDatas)
      },

      /* 每页条数改变时 */
      pageSizesChange: function(size) {
        this.pageSize = size
        var self = this
        self.fillTable(self.totalDatas)
      },

      /* 获取选中项 */
      getSelectedArr: function(selection) {
        var self = this
        var arr = []
        for (let i = 0; i < selection.length; i++) {
          arr.push(selection[i].applynum)
        }
        self.selectArr = arr
      },
      /* 下载结款明细 */
      download: function() {
        var self = this
        var arr = JSON.stringify(self.selectArr)
        window.open(CHECKVERIFY_RECORD_DOWNLOAD_URL + "?applynums=" + arr, "_self")
      }
    },
    components: {
      inputSearch,
      datePicker
    }
  }
</script>

<style scoped>

</style>
