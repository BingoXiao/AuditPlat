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

        <el-form-item label="审编号：">
          <input-search></input-search>
        </el-form-item>

        <el-form-item class="select" label="BD：">
          <bd-list></bd-list>
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
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        statusShow: false
      }
    },
    beforeRouteEnter(to, from, next) {
      if (to.path === "/bus_review/:type") {
        next({path: "/bus_review/bus_apply"})
      } else {
        next()
      }
    },
    mounted: function() {
      this.getTables()  // APPLY,NEW,BRANCH
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function() {
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
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
            self.totalItems = parseInt(datas.length)
            setTimeout(function() {
              self.loading = false
            })
          }
        })
      },

      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function() {
        this.currentPage = 1
        this.getTables()
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
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
