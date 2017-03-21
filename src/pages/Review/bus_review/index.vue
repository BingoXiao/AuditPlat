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

        <el-form-item label="审编号：" label-width="80px">
          <input-search ref="applynum" name="applynum"
                        v-on:getRules="getFilterRules"></input-search>
        </el-form-item>

        <el-form-item class="select" label="BD：">
          <bd-list ref="bd" name="bd"
                   v-on:getRules="getFilterRules"></bd-list>
        </el-form-item>

        <el-form-item label="" label-width="10px">
          <el-button type="primary" size="small" icon="search"
                     @click="filterTable">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row style="width: 100%;">
        <el-table-column prop="submit_time" label="提交时间" align="center" min-width="180px"></el-table-column>
        <el-table-column prop="applynum" label="审编号" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="160px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="110px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="bd" label="BD联系人" align="center" min-width="100px"></el-table-column>
        <el-table-column v-if="statusShow" prop="status" label="状态" align="center" width="80px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"
                       v-if="statusShow" @click="checkinfo(scope.row)"> 查看</el-button>
            <el-button size="small" icon="document" class="tableButton"
                       v-else @click="checkinfo(scope.row)"> 审核</el-button>
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
  import alasql from "alasql"
  import tabComponent from "../../../components/tabs/router/index"
  import datePicker from "../../../components/search/datePicker/index"
  import inputSearch from "../../../components/search/input/index"
  import selectSearch from "../../../components/search/select/index"
  import bdList from "../../../components/search/BDlist/index"
  import {BDVERIFY_APPLYTABLE_URL, BDVERIFY_EDITTABLE_URL} from "../../../common/interface"

  export default {
    data() {
      return {
        loading: false,
        tabs: [
          {
            param: "bus_apply",
            name: "商家申请"
          },
          {
            param: "bus_apply_record",
            name: "商家申请记录"
          },
          {
            param: "businfo_edit",
            name: "商家信息修改"
          },
          {
            param: "businfo_edit_record",
            name: "商家信息修改记录"
          }
        ],
        search: {         // 搜索栏
          dateRange: [],  // 日期
          applynum: "",   // 申请号
          bd: ""          // BD
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        statusShow: false
      }
    },
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/bus_review/:type") {
        next({path: "/bus_review/bus_apply"})
      } else {
        next()
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      var self = this
      if (to.path === "/bus_review/:type") {
        next({path: "/bus_review/bus_apply"})
      } else {
        next()
      }
      self.getTables(function(datas) {
        self.fillTable(datas)
      })
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
        var type = (self.$route.params.type)
        var url = ""
        var Type = "V"
        if (type === "bus_apply" || type === "businfo_edit") {
          if (type === "bus_apply") {
            url = BDVERIFY_APPLYTABLE_URL
          } else if (type === "businfo_edit") {
            url = BDVERIFY_EDITTABLE_URL
          }
          self.statusShow = false
        } else if (type === "bus_apply_record" || type === "businfo_edit_record") {
          if (type === "bus_apply_record") {
            url = BDVERIFY_APPLYTABLE_URL
          } else if (type === "businfo_edit_record") {
            url = BDVERIFY_EDITTABLE_URL
          }
          self.statusShow = true
          Type = "H"
        }
        self.$http.get(url + "?type=" + Type).then(function(response) {
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
        var rules = "SELECT * FROM ? WHERE applynum LIKE '%" + self.search.applynum + "%'"
        if (self.search.bd !== "") {    // bd
          rules += " AND bd LIKE '%" + self.search.bd + "%'"
        }
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
      /* 清空筛选 */
      rulesReset: function() {
        var self = this
        self.$refs.dateRange.reset()
        self.$refs.applynum.reset()
        self.$refs.bd.reset()
        self.currentPage = 1
      },

      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function() {
        var self = this
        self.rulesReset()
        self.getTables(function(datas) {
          self.fillTable(datas)
        })
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this
        self.currentPage = currentPage
        self.fillTable(self.totalDatas)
      },

      /* 审核（查看） */
      checkinfo: function(row) {
        var self = this
        var type = self.$route.params.type
        if (type === "businfo_edit" || type === "businfo_edit_record") {     // 商家信息修改
          self.$router.push({path: self.$route.path + "/content#id=" + row.item_id + "&applynum=" + row.applynum})
        } else {
          self.$router.push({path: self.$route.path + "/content#id=" + row.applynum})
        }
      }
    },
    components: {
      tabComponent,
      datePicker,
      inputSearch,
      selectSearch,
      bdList
    }
  }
</script>

<style scoped>

</style>
