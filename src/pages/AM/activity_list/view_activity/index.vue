<template>
  <el-row>
    <el-col :span="24" style="position: relative">
      <tab-component :tabs="tabs" :which="which"></tab-component>
      <div class="returnTop">
        <span @click="backTo" style="cursor: pointer">
          <i class="iconfont icon-xiangzuo" style="font-size: 15px;"></i>
          返回活动列表</span>
      </div>
    </el-col>

    <el-col :span="24">
      <el-form id="form" ref="form" label-width="130px" label-position="left">
        <!--表格-->
        <el-col :span="24">
          <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                    highlight-current-row style="width: 100%;">
            <el-table-column prop="type" label="类型" align="center" min-width="100px"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" min-width="100px"></el-table-column>
            <el-table-column label="优惠" align="center" min-width="150px">
              <template scope="scope">
                <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
              </template>
            </el-table-column>
            <el-table-column prop="counts" label="数量" align="center" min-width="100px"></el-table-column>
            <el-table-column label="门店" align="center" min-width="150px">
              <template scope="scope">
                <div v-for="item in scope.row.buses">{{item}}</div>
              </template>
            </el-table-column>
            <el-table-column label="有效时间" align="center" min-width="160px">
              <template scope="scope">
                <span>{{scope.row.valid_startdate}}~{{scope.row.valid_enddate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="累计抵用金额" align="center" min-width="130px">
              <template scope="scope">
                <span>{{scope.row.amount}}元</span>
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
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../../components/tabs/inner/index";
  import {EVENTS_VIEWEVENT_URL} from "../../../../common/interface";
  import {getUrlParameters} from "../../../../common/common";

  export default{
    data() {
      return {
        loading: false,
        tabs: {
          "name": "查看活动"
        },
        which: "name",
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      };
    },
    mounted() {
      var self = this;
      self.getTables();
    },
    methods: {
      /* 获取表格数据 */
      getTables: function() {
        var self = this;
        var id = getUrlParameters(window.location.hash, "id");
        self.$http.get(EVENTS_VIEWEVENT_URL(id)).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.clist;
            self.tableDatas = datas;
          }
        });
      },
      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.getTables();
      },
      // 返回活动列表
      backTo: function() {
        var self = this;
        self.$router.push({path: "/activity_list/all"});
      }
    },
    components: {
      tabComponent
    }
  };
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
