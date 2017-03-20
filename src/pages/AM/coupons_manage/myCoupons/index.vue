<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="60px">
        <el-form-item label="日期：">
          <date-picker></date-picker>
        </el-form-item>

        <el-form-item label="优惠券名称：" label-width="120px">
          <input-search></input-search>
        </el-form-item>
      </el-form>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" v-loading.body="loading"
                border row-key="id" style="width: 100%;"
                highlight-current-row>
        <el-table-column prop="create_datetime" label="创建时间" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="type" label="类型" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="name" label="名称" align="center" min-width="120px"></el-table-column>
        <el-table-column label="优惠" align="center" min-width="150px">
          <template scope="scope">
            <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
          </template>
        </el-table-column>
        <el-table-column label="门店" align="center" min-width="110px">
          <template scope="scope">
            <span v-if="scope.row.buses[0]==='全平台通用'">{{scope.row.buses[0]}}</span>
            <span v-else>
              <el-tooltip class="item" effect="dark" content="查看门店信息" placement="bottom">
                <el-button type="text" @click="viewStores(scope.row)">
                  <span>指定门店( {{scope.row.buses.length}} 家 )</span>
                </el-button>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="160px">
          <template scope="scope">
            <el-button size="small" icon="edit" class="tableButton"
                       @click="editCoupon(scope.row)"> 修改</el-button>
            <el-button size="small" icon="delete" class="tableButton"
                       @click="deleteCoupon(scope.row)"> 删除</el-button>
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
  import datePicker from "../../../../components/search/datePicker/index"
  import inputSearch from "../../../../components/search/input/index"
  import dialogTips from "../../../../components/dialogTips/index.vue"
  import {EVENTS_CMTABLE_URL, EVENTS_CMDELETE_URL} from "../../../../common/interface"
  import {modalHide} from "../../../../common/common"

  export default{
    data() {
      return {
        loading: false,
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        isRight: true,       // 保存提示提示框
        tips: "删除成功！",
        tipsVisible: false
      }
    },
    mounted: function() {
      this.getTables()
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function() {
        var self = this
        self.loading = true
        self.$http.get(EVENTS_CMTABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.coupons
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
            self.totalItems = parseInt(datas.length)
            setTimeout(function() {
              self.loading = false
            })
          }
        })
      },

      // 查看指定门店信息
      viewStores: function(row) {
        this.$router.push({path: "/coupons_manage/specified_stores#id=" + row.id + "&name=" + row.name})
      },
      // 修改优惠券
      editCoupon: function(row) {
        this.$router.push({path: "/coupons_manage/add_new_coupons/#id=" + row.id})
        this.$emit("tabChange")
      },
      // 删除优惠券
      deleteCoupon: function(row) {
        var self = this
        self.$confirm("请确认是否删除该优惠券？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false
        }).then(() => {
          self.$http.post(EVENTS_CMDELETE_URL(row.id)).then(function(response) {
            if (response.body.success) {
              self.tipsVisible = true
              modalHide(function() {
                self.tipsVisible = false
                self.getTables()
              })
            }
          })
        }).catch(() => {})
      },
      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      }
    },
    components: {
      datePicker,
      inputSearch,
      dialogTips
    }
  }
</script>

<style scoped>

</style>
