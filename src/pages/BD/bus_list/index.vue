<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="90px">
        <el-form-item label="申请号：">
          <input-search></input-search>
        </el-form-item>

        <el-form-item class="select" label="状态：">
          <select-search :options="search.state"></select-search>
        </el-form-item>

        <el-form-item label="商家分类：">
          <classify-search></classify-search>
        </el-form-item>
      </el-form>
    </el-col>


    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" @row-click="selectShop" border
                highlight-current-row style="width: 100%;" :row-key="tableDatas.bususer_id">
        <el-table-column prop="number" label="商家编号" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="class" label="商家分类" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="date_join" label="开通时间" align="center" min-width="200px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="120px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"> 查看</el-button>
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
  import inputSearch from "../../../components/search/input/index"
  import selectSearch from "../../../components/search/select/index"
  import classifySearch from "../../../components/search/classify/index"
  import {BUSLIST_TABLE_URL} from "../../../common/interface"

  export default {
    data() {
      return {
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
        search: {                 // 搜索栏
          state: [               // 状态列表
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
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    mounted: function() {
      var self = this
      self.getTables()  // APPLY,NEW,BRANCH
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function() {
        var self = this
        self.$http.get(BUSLIST_TABLE_URL).then(function(response) {
          if (response.data.success) {
            var datas = response.data.content
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
            self.totalItems = parseInt(datas.length)
          }
        })
      },

      /* 表格数据选择 */
      selectShop: function(row, event, column) {
        this.table.applynum = row.applynum
        this.dialog.BD = row.bd
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      }
    },
    components: {
      inputSearch,
      selectSearch,
      classifySearch
    }
  }
</script>

<style scoped>
</style>
