<template>
  <el-row>
    <!--筛选栏-->
    <!--结款申请-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="85px">
          <el-form-item label="商家账号：">
            <input-search></input-search>
          </el-form-item>
        </el-form>
      </el-row>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row style="width: 100%;"
                :row-key="tableDatas.item_id">
        <el-table-column prop="num" label="商家编号" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="account" label="BD联系人" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="bd_info" label="商家账号" align="center" min-width="160px"></el-table-column>
        <el-table-column prop="peer_operation_type" label="状态" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="center" min-width="180px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100px">
          <template scope="scope">
            <el-button size="small" icon="document" class="tableButton"
                       @click="view(scope.row)"> 审核</el-button>
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
  </el-row>
</template>

<script>
  import inputSearch from "../../../../components/search/input/index"
  import {CHECKVERIFY_BANKEDIT_URL} from "../../../../common/interface"

  export default {
    props: {
      tab: String
    },
    data() {
      return {
        loading: false,
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
        self.$http.get(CHECKVERIFY_BANKEDIT_URL + "?type=V").then(function(response) {
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

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      },

      // 查看
      view: function(row) {
        var self = this
        self.$router.push({path: self.$route.path + "/content#id=" + row.item_id})
      }
    },
    components: {
      inputSearch
    }
  }
</script>

<style scoped>

</style>
