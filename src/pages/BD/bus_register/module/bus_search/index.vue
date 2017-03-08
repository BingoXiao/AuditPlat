<template>
  <el-col :span="24" class="toolbar">
    <el-form :inline="true" label-width="90px">
      <el-form-item label="商家搜索：">
        <el-input v-model="busForm.bus" placeholder="商家账号/商家名称"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" icon="search" @click="search_bus">搜索</el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" v-loading.body="loading"
                border highlight-current-row style="width: 100%;"
                :row-key="''+tableDatas.bus_id" @row-click="getAcc">
        <el-table-column label="" width="55px">
          <template scope="scope">
            <el-radio v-model="busForm.bus_id" class="radio"
                      :label="scope.row.bususer_id" ></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="申请号" align="center" min-width="90px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="class" label="商家分类" align="center" min-width="220px"></el-table-column>
        <el-table-column prop="date_join" label="开通时间" align="center" min-width="200px"></el-table-column>
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
  </el-col>
</template>

<script>
  import {getUrlParameters} from "../../../../../common/common"
  import {BDREGISTER_BRALIST_URL} from "../../../../../common/interface"

  export default{
    props: {
      filling: Object     // 信息填充
    },
    data() {
      return {
        loading: true,
        busForm: {
          bus_id: "",    // 商家id
          account: "",   // 商家账号
          bus: ""        // 商家账号/名称（搜索）
        },
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    mounted() {
      if (!getUrlParameters(window.location.hash, "id")) {
        this.search_bus()
      }
    },
    watch: {
      filling: function() {
        var self = this
        if (getUrlParameters(window.location.hash, "id")) {
          self.tableDatas = []
          self.tableDatas.push(self.filling.parentbus)
          self.totalItems = 1
          self.busForm.bus_id = self.filling.parentbus.bus_id
          self.busForm.account = self.filling.parentbus.account
          this.$store.commit("BUS_ACCOUNT", self.filling.parentbus.account)
          setTimeout(function() {
            self.loading = false
          })
        }
      }
    },
    methods: {
      /* 商家搜索（表格） */
      search_bus: function() {
        var self = this
        self.loading = true
        self.$http.get(BDREGISTER_BRALIST_URL + "?account=" + self.busForm.bus).then(function(response) {
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
      // 获取商家账号(表格行点击事件)
      getAcc: function(row) {
        var self = this
        self.$store.commit("BUS_ACCOUNT", row.account)
        self.busForm.account = row.account
        self.busForm.bus_id = row.bus_id
      },
      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      },
      // 商家搜索验证
      busValidate: function(func) {
        var self = this
        if (self.busForm.bus_id) {
          // 初始id和选择商家id不同
          if (getUrlParameters(window.location.hash, "id")) {
            if (self.busForm.bus_id !== self.filling.parentbus.bus_id) {
              self.$emit("getPAN", self.busForm.bus_id)
            }
          }
          self.$emit("getCheck", self.busForm.account)
          func()
        }
      }
    }
  }
</script>

<style scoped>
  .radio{
    color: transparent;
    font-size: 5px;
  }
</style>
