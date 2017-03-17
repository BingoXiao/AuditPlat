<template>
  <el-row>
    <el-col :span="24">
      <tab-component :tabs="tabs" :type="$route.params.type"
                     v-on:toggle="tabChange"></tab-component>
      <br/>
    </el-col>

    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="90px">
        <el-form-item label="日期：" label-width="60px"
                      v-show="$route.params.type==='record'">
          <date-picker></date-picker>
        </el-form-item>

        <el-form-item class="select" label="状态：" label-width="60px"
                      v-show="$route.params.type==='record'">
          <select-search :options="search.state"></select-search>
        </el-form-item>

        <el-form-item label="商家分类：">
          <classify-search></classify-search>
        </el-form-item>

        <el-form-item label="申请号：" label-width="70px">
          <input-search></input-search>
        </el-form-item>

        <el-form-item class="select" label="项目类型：">
          <select-search :options="search.type"></select-search>
        </el-form-item>
      </el-form>
    </el-col>


    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row :row-key="tableDatas.item_id" style="width: 100%;">
        <el-table-column prop="submit_time" label="申请时间" align="center" min-width="180px"></el-table-column>
        <el-table-column label="门店名称" align="center" min-width="130px">
          <template scope="scope">
            <div v-for="item in scope.row.bus_names">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目名称" align="center" min-width="160px"></el-table-column>
        <el-table-column label="项目分类" align="center" min-width="180px">
          <template scope="scope">
            <span v-for="item in scope.row.class">{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item_type" label="项目类型" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100px">
          <template scope="scope">
            <el-button size="small" icon="search" class="tableButton"
                       v-if="scope.row.status !== '未审核'"
                       @click="viewInfo(scope.row)"> 查看</el-button>
            <el-button size="small" icon="edit" class="tableButton"
                       v-else @click="viewInfo(scope.row)"> 审核</el-button>
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
  import classifySearch from "../../../components/search/classify/index"
  import inputSearch from "../../../components/search/input/index"
  import selectSearch from "../../../components/search/select/index"
  import {PROVERIFY_TABLE_URL} from "../../../common/interface"

  export default {
    data() {
      return {
        loading: false,
        tabs: [
          {
            param: "online",
            name: "上线申请"
          },
          {
            param: "edit",
            name: "修改申请"
          },
          {
            param: "offline",
            name: "下线申请"
          },
          {
            param: "record",
            name: "记录"
          }
        ],
        search: {                 // 搜索栏
          state: [               // 状态列表
            {
              value: "通过",
              label: "通过"
            }, {
              value: "驳回",
              label: "驳回"
            }],
          type: [                 // 项目类型
            {
              value: "套餐券",
              label: "套餐券"
            }, {
              value: "商品券",
              label: "商品券"
            }]
        },
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
      if (to.path === "/project_verify/:type") {
        next({path: "/project_verify/online"})
      } else {
        next()
      }
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    beforeRouteUpdate(to, from, next) {
      if (to.path === "/project_verify/:type") {
        next({path: "/project_verify/online"})
      } else {
        next()
      }
      this.getTables()
    },
    mounted: function() {
      this.getTables()  // APPLY,NEW,BRANCH
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function() {
        var self = this
        self.loading = true
        let arr = {
          "online": "UP",
          "edit": "EDIT",
          "offline": "DOWN",
          "record": "HIS"
        }
        var type = arr[self.$route.params.type]
        self.$http.get(PROVERIFY_TABLE_URL + "?operate_type=" + type).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content
            for (let i = 0; i < datas.length; i++) {
              var item = datas[i]
              item.bus_names = item.bus_names.split(" ")  // 门店名称
              item.class = item.class.split(" ")          // 项目分类
              for (let i = 0; i < item.class.length - 1; i++) {
                item.class[i] = item.class[i] + " > "
              }
            }
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
        var self = this
        self.currentPage = 1
        self.getTables()
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        var self = this
        self.currentPage = currentPage
        self.getTables()
      },

      /* 查看 */
      viewInfo: function(row) {
        var self = this
        self.$router.push({path: self.$route.path + "/content#id=" + row.item_id})
      }
    },
    components: {
      tabComponent,
      classifySearch,
      inputSearch,
      selectSearch,
      datePicker
    }
  }
</script>

<style scoped>

</style>
