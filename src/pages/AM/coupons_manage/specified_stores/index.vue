<template>
  <el-row>
    <el-col :span="24" style="position: relative">
      <tab-component :tabs="tabs" :which="which"></tab-component>
      <div class="returnTop">
        <span @click="backTo" style="cursor: pointer">
          <i class="iconfont icon-xiangzuo" style="font-size: 15px;"></i>
          返回优惠券列表</span>
      </div>
    </el-col>

    <el-col :span="20">
      <el-form id="form" ref="form" label-width="130px" label-position="left">
        <!--表格-->
        <el-col :span="24">
          <el-table ref="table" :data="tableDatas" v-loading.body="loading"
                    border highlight-current-row style="width: 100%;">
            <el-table-column prop="busname" label="门店名称" align="center" min-width="200px"></el-table-column>
            <el-table-column prop="account" label="门店账号" align="center" min-width="200px"></el-table-column>
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
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import {EVENTS_CMVIEWSHOPS_URL} from "../../../../common/interface"
  import {getUrlParameters} from "../../../../common/common"
  import tabComponent from "../../../../components/tabs/inner/index"

  export default{
    data() {
      return {
        loading: false,
        tabs: {
          "name": getUrlParameters(window.location.hash, "name")
        },
        which: "name",
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    mounted() {
      var self = this
      self.getTables()
    },
    methods: {
      /* 获取表格数据 */
      getTables: function() {
        var self = this
        var id = getUrlParameters(window.location.hash, "id")
        self.$http.get(EVENTS_CMVIEWSHOPS_URL(id)).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content
            self.tableDatas = datas.blist
          }
        })
      },
      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      },
      // 返回商家银行账户修改（记录）
      backTo: function() {
        var self = this
        self.$router.push({path: "/coupons_manage/my_coupons"})
      }
    },
    components: {
      tabComponent
    }
  }
</script>

<style scoped>
  .returnTop{
    position: absolute;
    bottom: 20px;
    right: 0;
    font-size: 15px;
    font-family: "SimHei";
  }
  .info{
    /*border: 1px solid rgb(210, 212, 215);*/
    padding: 5px 80px 5px 0;
    margin: 0;
  }
</style>
