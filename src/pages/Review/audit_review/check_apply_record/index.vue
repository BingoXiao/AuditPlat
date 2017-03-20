<template>
  <el-row>
    <!--筛选栏-->
    <!--结款申请记录-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="60px">
          <el-form-item label="日期：">
            <date-picker></date-picker>
          </el-form-item>

          <el-form-item label="商家账号：" label-width="100px">
            <input-search></input-search>
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
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    mounted() {
      this.getTables()
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function() {
        var self = this
        self.loading = true
        self.$http.get(CHECKVERIFY_APPLY_URL + "?type=H").then(function(response) {
          if (response.body.success) {
            var datas = response.body.content
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
            self.totalItems = parseInt(datas.length)
            setTimeout(function() {
              self.loading = false
            })
          }
        })
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      },

      /* 每页条数改变时 */
      pageSizesChange: function(size) {
        this.pageSize = size
        this.getTables()
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
