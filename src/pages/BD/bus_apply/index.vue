<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="77px">
        <el-form-item label="日期：">
          <date-picker></date-picker>
        </el-form-item>

        <el-form-item label="申请号：">
          <input-search></input-search>
        </el-form-item>

        <el-form-item class="select" label="状态：">
          <select-search :options="search.state"></select-search>
        </el-form-item>

        <el-form-item class="select" label="BD：">
          <el-select v-model="search.BDvalue" clearable size="small" placeholder="全部">
            <el-option
              v-for="item in search.BDlist"
              :label="item.name"
              :value="item.bd_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" @row-click="selectShop"
                border highlight-current-row style="width: 100%;">
        <el-table-column prop="applynum" label="申请号" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="180px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="140px"></el-table-column>
        <el-table-column prop="bd" label="BD" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="center" min-width="200px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="120px">
          <template scope="scope">
            <el-button v-if="scope.row.status==='已分配'" size="small"
                       icon="edit" class="tableButton" @click="dialog.BDvisible = true"> 修改
            </el-button>
            <el-button v-else size="small" class="tableButton" @click="dialog.BDvisible = true">
              <i class="iconfont icon-laba"></i> 分配
            </el-button>
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

    <!--模态框-->
    <!--分配任务-->
    <el-dialog title="分配任务" v-model="dialog.BDvisible" size="tiny"
               :close-on-click-modal="false">
      <div class="modal">
        <br/><br/><br/>
        <el-form id="BDassignmentForm" ref="BDassignmentForm" label-width="100px">
          <!--BD-->
          <el-form-item label="BD：">
            <el-select v-model="dialog.BD" clearable size="small"
                       placeholder="请选择" @change="chooseBD">
              <el-option
                v-for="item in search.BDlist"
                :label="item.name"
                :value="item.bd_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <br/><br/>
        <el-row type="justify" align="center">
          <el-button type="primary" @click="BDassignment">分 配
          </el-button>
        </el-row>
        <br/>
      </div>
    </el-dialog>

    <!--提示-->
    <el-dialog v-model="dialog.tipsVisible" size="tiny"
               :close-on-click-modal="false" class="tipsModal">
      <div class="mainTips">
        <i class="el-icon-circle-check"></i>
        {{dialog.tips}}
        <p class="returnTips">自动返回系统中...</p>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import datePicker from "../../../components/search/datePicker/index"
  import inputSearch from "../../../components/search/input/index"
  import selectSearch from "../../../components/search/select/index"
  import {modalHide} from "../../../common/common"
  import {BDAPPLY_TABLE_URL, BDAPPLY_LIST_URL, BDAPPLY_ASSIGN_URL} from "../../../common/interface"

  export default{
    data() {
      return {
        search: {                 // 搜索栏
          state: [               // 状态列表
            {
              value: "已分配",
              label: "已分配"
            }, {
              value: "未分配",
              label: "未分配"
            }],
          BDlist: [],             // BD列表
          BDvalue: ""             // BD
        },
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        table: {                  // 记录表格行数据
          shop_id: ""
        },
        dialog: {
          BDvisible: false,     // 分配任务
          BD: "",               // BD_id
          tipsVisible: false,   // 操作提示
          tips: ""              // 操作后提示信息
        }
      }
    },
    mounted: function() {
      this.BDlist()
      this.getTables()
    },
    methods: {
      /* 获取BD列表 */
      BDlist: function() {
        var self = this
        self.$http.get(BDAPPLY_LIST_URL).then(function(response) {
          if (response.data.success) {
            var datas = response.data.content
            self.search.BDlist = datas    // BD列表（模态框和筛选栏）
          }
        })
      },

      /* 获取数据（表格） */
      getTables: function() {
        var self = this
        self.$http.get(BDAPPLY_TABLE_URL).then(function(response) {
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
      },

      /* 表格操作 选择要分配得BD */
      chooseBD: function(value) {
        this.dialog.BD = value
      },

      /* 分配任务 */
      BDassignment: function() {
        var self = this
        var formData = new FormData()
        if (self.dialog.BD !== "") {
          formData.append("applynum", self.table.applynum)
          formData.append("bd_id", self.dialog.BD)
        } else {
          return false
        }

//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }

        self.$http.post(BDAPPLY_ASSIGN_URL, formData)
          .then(function(response) {
            if (response.data.success) {
              self.dialog.BDvisible = false
              self.dialog.tips = "分配成功！"
              self.dialog.tipsVisible = true
              modalHide(function() {
                self.dialog.tipsVisible = false
                self.getTables()
              })
            }
          })
      }
    },
    components: {
      datePicker,
      inputSearch,
      selectSearch
    }
  }
</script>

<style scoped>

</style>
