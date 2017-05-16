<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
      <!--表格-->
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row row-key="id" style="width: 100%;">
        <el-table-column label="活动时间" align="center" min-width="160px">
          <template scope="scope">
            <span>{{scope.row.startdate}}~{{scope.row.enddate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="活动名称" align="center" min-width="150px"></el-table-column>
        <el-table-column label="优惠券" align="center" min-width="130px">
          <template scope="scope">
            <div v-for="item in scope.row.coupons">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column label="领取次数" align="center" min-width="100px">
          <template scope="scope">
            <div v-if="scope.row.get_times==='E'">1次/天</div>
            <div v-else>仅一次</div>
          </template>
        </el-table-column>
        <el-table-column label="累计抵用金额" align="center" min-width="130px">
          <template scope="scope">
            <span>{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="100px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"
                       v-if="scope.row.status !== '待上线'"
                       @click="viewAct(scope.row)"> 查看</el-button>
            <el-button size="small" icon="edit" class="tableButton"
                       v-if="scope.row.status === '待上线'"
                       @click="editAct(scope.row)"> 修改</el-button>
            <el-button size="small" icon="delete" class="tableButton"
                       v-if="scope.row.status === '待上线'"
                       @click="deleteAct(scope.row)"> 删除</el-button>
            <el-button size="small" class="tableButton"
                       v-if="scope.row.status === '已上线'"
                       @click="offAct(scope.row)">
              <i class="iconfont icon-xiaxian"
                 style="font-size: 14px;"></i> 下线
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

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import alasql from "alasql";
  import tabComponent from "../../../../components/tabs/router/index";
  import dialogTips from "../../../../components/dialogTips/index.vue";
  import {EVENTS_ELTABLE_URL, EVENTS_ELDELETE_URL,
    EVENTS_OFFLINEINFO_URL} from "../../../../common/interface";
  import {modalHide} from "../../../../common/common";
  export default {
    data() {
      return {
        loading: false,
        isRight: true,       // 保存提示提示框
        tips: "",
        tipsVisible: false,
        tabs: [
          {
            param: "all",
            name: "全部活动"
          },
          {
            param: "stay",
            name: "待上线活动"
          },
          {
            param: "online",
            name: "已上线活动"
          },
          {
            param: "offline",
            name: "已下线活动"
          }
        ],
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      };
    },
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/activity_list/:type") {
        next({path: "/activity_list/all"});
      } else {
        next();
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      if (to.path === "/activity_list/:type") {
        next({path: "/activity_list/all"});
      } else {
        next();
      }
      this.getTables();
    },
    created: function() {
      this.getTables();  // APPLY,NEW,BRANCH
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function() {
        var self = this;
        self.loading = true;
        let arr = {
          "all": "ALL",
          "stay": "SAVE",
          "online": "UP",
          "offline": "DOWN"
        };
        var type = arr[self.$route.params.type];
        self.$http.get(EVENTS_ELTABLE_URL + "?type=" + type).then(function(response) {
          if (response.body.success) {
            var datas = alasql("SELECT * FROM ? ORDER BY create_datetime DESC", [response.body.content.alist]);
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize);
            self.totalItems = parseInt(datas.length);
            setTimeout(function() {
              self.loading = false;
            });
          }
        });
      },

      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function() {
        var self = this;
        self.currentPage = 1;
        self.getTables();
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        var self = this;
        self.currentPage = currentPage;
        self.getTables();
      },

      /* 查看 */
      viewAct: function(row) {
        var self = this;
        self.$router.push({path: "/activity_list/view_activity#id=" + row.id});
      },
      /* 修改 */
      editAct: function(row) {
        var self = this;
        self.$router.push({path: "/add_activity#id=" + row.id});
      },
      /* 删除 */
      deleteAct: function(row) {
        var self = this;
        self.$confirm("确认是否删除“" + row.name + "”", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false
        }).then(() => {
          self.$http.post(EVENTS_ELDELETE_URL(row.id)).then(function(response) {
            if (response.body.success) {
              self.tips = "删除活动成功！";
              self.tipsVisible = true;
              modalHide(function() {
                self.tipsVisible = false;
                self.getTables();
              });
            }
          });
        }).catch(() => {});
      },
      /* 下线 */
      offAct: function(row) {
        var self = this;
        self.$confirm("确认是否下线“" + row.name + "”", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false
        }).then(() => {
          self.$http.post(EVENTS_OFFLINEINFO_URL(row.id)).then(function(response) {
            if (response.body.success) {
              self.tips = "活动下线成功！";
              self.tipsVisible = true;
              modalHide(function() {
                self.tipsVisible = false;
                self.getTables();
              });
            }
          });
        }).catch(() => {});
      }
    },
    components: {
      tabComponent,
      dialogTips
    }
  };
</script>

<style scoped>

</style>
