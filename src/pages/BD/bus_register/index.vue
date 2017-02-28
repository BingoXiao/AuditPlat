<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
    </el-col>

    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="74px">
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

        <el-form-item v-show="$route.params.type !== 'apply'" style="float: right">
          <el-button size="small" style="padding:8px 15px;" @click="editInfo">立即注册</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border
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
        <el-table-column label="操作" align="center" min-width="200px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"
                       v-if="scope.row.status === '未处理'"> 查看</el-button>
            <el-button size="small" icon="document" class="tableButton"
                       v-if="scope.row.status === '未处理'"> 注册</el-button>
            <el-button size="small" icon="edit" class="tableButton"
                       v-if="scope.row.status !== '未处理' && '送审中'"
                       @click="editInfo(scope.row)"> 修改</el-button>
            <span v-if="scope.row.status === '送审中'"><b> —— </b></span>
            <el-button size="small" icon="delete2" class="tableButton"
                       v-if="scope.row.status !== '送审中'"> 删除</el-button>
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
  import tabComponent from "../../../components/tabs/index"
  import datePicker from "../../../components/search/datePicker/index"
  import inputSearch from "../../../components/search/input/index"
  import selectSearch from "../../../components/search/select/index"
  import {BDAPPLY_LIST_URL, BDREGISTER_TABLE_URL} from "../../../common/interface"

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
              value: "未处理",
              label: "已分配"
            }, {
              value: "处理中",
              label: "处理中"
            }, {
              value: "送审中",
              label: "送审中"
            }, {
              value: "驳回",
              label: "驳回"
            }],
          BDlist: [],                 // BD列表
          BDvalue: ""             // BD
        },
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    beforeRouteEnter(to, from, next) {
      if (to.path === "/bus_register/:type") {
        next({path: "/bus_register/new"})
      } else {
        next()
      }
    },
    mounted: function() {
      var self = this
      self.BDlist()
      self.getTables()  // APPLY,NEW,BRANCH
    },
    methods: {
      /* 获取BD列表 */
      BDlist: function() {
        var self = this
        self.$http.get(BDAPPLY_LIST_URL).then(function(response) {
          if (response.body.success) {
            self.search.BDlist = response.body.content    // 筛选栏
          }
        })
      },

      /* 获取数据（表格） */
      getTables: function() {
        var self = this
        var type = (self.$route.params.type).toUpperCase()
        self.$http.get(BDREGISTER_TABLE_URL + "?type=" + type).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
            self.totalItems = parseInt(datas.length)
          }
        })
      },

      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function() {
        this.getTables()
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      },

      /* 修改(按钮) */
      editInfo: function(row) {
        var self = this
        var type = self.$route.params.type
        var href, otherWindow
        if (type === "new") {   // 新店注册（修改）
          if (!row.applynum) {
            href = "#/bus_register/new/register"
          } else {
            href = "#/bus_register/new/register#id=" + row.applynum
          }
        } else {
          if (!row.applynum) {
            href = "#/bus_register/branch/register"
          } else {
            href = "#/bus_register/branch/register#id=" + row.applynum
          }
        }
        otherWindow = window.open(href)
        otherWindow.opener = null
      }
    },
    components: {
      tabComponent,
      datePicker,
      inputSearch,
      selectSearch
    }
  }
</script>

<style scoped>

</style>
