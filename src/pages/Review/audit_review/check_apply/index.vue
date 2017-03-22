<template>
  <el-row>
    <!--筛选栏-->
    <!--结款申请-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="85px">
          <el-form-item label="商家账号：">
            <input-search ref="account" name="account"
                          v-on:getRules="getFilterRules"></input-search>
          </el-form-item>

          <el-form-item label="" label-width="10px">
            <el-button type="primary" size="small" icon="search"
                       @click="filterTable">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-col :span="24" class="toolbar" style="margin-bottom:10px;">
          <el-col :span="12">
            <el-button type="primary" @click="checkPass('S')">结款成功</el-button>
            <el-button type="danger" @click="checkPass('F')">结款失败</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button type="primary" @click="download">下载当日任务</el-button>
            <el-upload :action="upload_url" class="myupload"
                       :before-upload="handleChange"
                       :on-success="handleSuccess"
                       style="border: none;width:150px;vertical-align:top;">
              <el-button type="primary" @click="uploadVisible = true">上传结款信息</el-button>
            </el-upload>
          </el-col>
        </el-col>
      </el-row>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row style="width: 100%;"
                row-key="applynum"
                @selection-change="getSelectedArr">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="center" min-width="180px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="bank_name" label="开户名称" align="center" min-width="160px"></el-table-column>
        <el-table-column prop="person_or_company_name" label="开户行" align="center" min-width="110px"></el-table-column>
        <el-table-column prop="bank_account" label="银行账户" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="balance" label="提款金额" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="80px"></el-table-column>
      </el-table>
    </el-col>

    <el-col class="pageination" :span="24">
      <el-pagination :current-page="currentPage"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalItems"
                     :page-sizes="[10, 20, 50, 100]"
                     @current-change="handleCurrentChange"
                     @size-change="pageSizesChange">
      </el-pagination>
    </el-col>


    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import alasql from "alasql"
  import inputSearch from "../../../../components/search/input/index"
  import dialogTips from "../../../../components/dialogTips/index.vue"
  import {modalHide} from "../../../../common/common"
  import {CHECKVERIFY_APPLY_URL, CHECKVERIFY_APPLY_TODYDL_URL,
    EXCEL_UPLOAD_URL, CHECKVERIFY_SUCCESS_SEARCH_URL} from "../../../../common/interface"

  export default {
    props: {
      tab: String
    },
    data() {
      return {
        loading: false,
        selectArr: [],            // 选中数组
        upload_url: EXCEL_UPLOAD_URL,  // 上传
        uploadVisible: false,
        search: {         // 搜索栏
          account: ""     // 账号
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        isRight: true,       // 提示框
        tips: "",
        tipsVisible: false
      }
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
        self.$http.get(CHECKVERIFY_APPLY_URL + "?type=V").then(function(response) {
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
        var rules = "SELECT * FROM ? WHERE account LIKE '%" + self.search.account + "%'"
        self.getTables(function(datas) {
          var res = alasql(rules, [datas])
          self.currentPage = 1
          self.fillTable(res)
        })
      },
      /* 清空筛选 */
      rulesReset: function() {
        var self = this
        self.$refs.account.reset()
        self.currentPage = 1
      },

      /* 每页条数改变时 */
      pageSizesChange: function(size) {
        var self = this
        self.pageSize = size
        self.fillTable(self.totalDatas)
      },

      /* 获取选中项 */
      getSelectedArr: function(selection) {
        var self = this
        var arr = []
        for (let i = 0; i < selection.length; i++) {
          arr.push(selection[i].applynum)
        }
        self.selectArr = arr
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this
        self.currentPage = currentPage
        self.fillTable(self.totalDatas)
      },

      /* 下载结款明细 */
      download: function() {
        var self = this
        var arr = JSON.stringify(self.selectArr)
        window.open(CHECKVERIFY_APPLY_TODYDL_URL + "?applynums=" + arr, "_self")
      },
      /* 上传结款信息 */
      handleChange(file, fileList) {
        var self = this
        var ext = file.name.toUpperCase()
        var extStart = ext.lastIndexOf(".")
        var type = ext.substring(extStart, ext.length).toUpperCase()
        if (type !== ".XLS" && type !== ".XLSX" && type !== ".XLSB" && type !== ".XLSM" && type !== ".XLST") {
          self.isRight = false
          self.tips = "请上传excel文件！"
          self.tipsVisible = true
          modalHide(function() {
            self.tipsVisible = false
          })
          return false
        } else {
          return file.name
        }
      },
      // 上传成功
      handleSuccess: function(response, file, fileList) {
        var self = this
        if (response.success) {
          self.isRight = true
          self.tips = "上传文件成功！"
          self.tipsVisible = true
          modalHide(function() {
            self.tipsVisible = false
          })
        }
      },
      // 结款成功（失败）
      checkPass: function(flag) {
        var self = this
        var formData = new FormData()
        formData.append("flag", flag)
        formData.append("applynums[]", self.selectArr)
        var title = "是否确定选择账号结款成功？"
        if (flag === "F") {
          title = "是否确定选择账号结款失败？"
        }
        if (self.selectArr.length < 1) {
          self.isRight = false
          self.tips = "请选择结款商家！"
          self.tipsVisible = true
          modalHide(function() {
            self.tipsVisible = false
          })
        } else {
          self.$confirm(title, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false
          }).then(() => {
            self.$http.post(CHECKVERIFY_SUCCESS_SEARCH_URL, formData)
            .then(function(response) {
              if (response.body.success) {
                self.isRight = true
                self.tips = "操作成功！"
                self.tipsVisible = true
                modalHide(function() {
                  self.tipsVisible = false
                  self.getTables(function(datas) {
                    self.rulesReset()
                    self.fillTable(datas)
                  })
                })
              }
            })
          })
        }
      }
    },
    components: {
      inputSearch,
      dialogTips
    }
  }
</script>

<style scoped>

</style>
