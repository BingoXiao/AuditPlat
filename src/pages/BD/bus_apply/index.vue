<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="60px">
        <el-form-item label="日期：">
          <date-picker ref="dateRange" name="dateRange"
                       v-on:getRules="getFilterRules"></date-picker>
        </el-form-item>

        <el-form-item label="商家名稱：" label-width="100px">
          <input-search ref="busname" name="busname"
                        v-on:getRules="getFilterRules"></input-search>
        </el-form-item>

        <el-form-item class="select" label="状态：">
          <select-search :options="search.state"
                         ref="status" name="status"
                         v-on:getRules="getFilterRules"></select-search>
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
      <el-table ref="table" :data="tableDatas"
                v-loading.body="loading" border
                row-key="applynum"
                highlight-current-row style="width: 100%;">
        <el-table-column prop="applynum" label="申请号" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="150px"></el-table-column>
        <el-table-column prop="city" label="城市" align="center" min-width="120px"></el-table-column>
        <el-table-column prop="city_near" label="商圈" align="center" min-width="150px"></el-table-column>
        <el-table-column prop="bd" label="BD" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="center" min-width="200px"></el-table-column>
        <el-table-column label="操作" align="center" min-width="120px">
          <template scope="scope">
            <el-button v-if="scope.row.status==='已分配'" size="small"
                       icon="edit" class="tableButton"
                       @click="distributeBD(scope.row)"> 修改
            </el-button>
            <el-button v-else size="small" class="tableButton"
                       @click="distributeBD(scope.row)">
              <i class="iconfont icon-laba"></i> 分配
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

    <!--模态框-->
    <!--分配任务-->
    <el-dialog title="分配任务"
               v-model="dialog.BDvisible"
               size="tiny"
               :close-on-click-modal="false">
      <div class="modal">
        <br/><br/><br/>
        <el-row ref="BDassignmentForm" type="flex" justify="center">
          <!--BD-->
          <el-col :span="4" :offset="2" style="line-height:30px;">BD：</el-col>
          <el-col :span="14" style="text-align: left">
            <el-select ref="bd"
                       v-model="dialog.BD"
                       clearable
                       size="small"
                       placeholder="请选择"
                       @change="chooseBD">
              <el-option
                v-for="item in search.BDlist"
                :label="item.name"
                :value="item.bd_id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <br/><br/>
        <el-row type="justify" align="center">
          <el-button type="primary" @click="BDassignment">分 配
          </el-button>
        </el-row>
        <br/>
      </div>
    </el-dialog>

    <!--提示-->
    <dialogTips :isRight="dialog.isRight" :tips="dialog.tips" :tipsVisible="dialog.tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import alasql from "alasql";
  import datePicker from "../../../components/search/datePicker/index";
  import inputSearch from "../../../components/search/input/index";
  import selectSearch from "../../../components/search/select/index";
  import bdList from "../../../components/search/BDlist/index";
  import dialogTips from "../../../components/dialogTips/index.vue";
  import {modalHide} from "../../../common/common";
  import {BDAPPLY_TABLE_URL, BDAPPLY_LIST_URL,
    BDAPPLY_ASSIGN_URL} from "../../../common/interface";

  export default{
    data() {
      return {
        loading: false,
        search: {         // 搜索栏
          dateRange: [],  // 日期
          busname: "",    // 商家名称
          status: "",     // 状态
          bd: "",         // BD
          state: [        // 状态列表
            {
              value: "已分配",
              label: "已分配"
            }, {
              value: "未分配",
              label: "未分配"
            }]
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        table: {                  // 记录表格行数据
          applynum: ""            // 商家申请号
        },
        dialog: {
          BDvisible: false,     // 分配任务
          BD: "",               // BD_id
          isRight: true,       // 提示框
          tips: "分配成功！",
          tipsVisible: false
        }
      };
    },
    created() {
      var self = this;
      self.BDlist();
      self.getTables(function(datas) {
        self.fillTable(datas);
      });
    },
    methods: {
      /* 获取BD列表 */
      BDlist: function() {
        var self = this;
        self.$http.get(BDAPPLY_LIST_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            self.search.BDlist = datas;    // BD列表（模态框和筛选栏）
          }
        });
      },

      /* 获取数据（表格） */
      getTables: function(func) {
        var self = this;
        self.loading = true;
        self.$http.get(BDAPPLY_TABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            func(datas);
          }
        });
      },
      /* 填充（表格） */
      fillTable: function(data) {
        var self = this;
        var datas = alasql("SELECT * FROM ? ORDER BY submit_time DESC", [data]);
        self.totalDatas = datas;
        self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize);
        self.totalItems = parseInt(datas.length);
        setTimeout(function() {
          self.loading = false;
        });
      },

      /* 获取过滤条件 */
      getFilterRules: function(name, value) {
        var self = this;
        self.search[name] = value;
      },
      /* 过滤 */
      filterTable: function() {
        var self = this;
        var rules = "SELECT * FROM ? WHERE busname LIKE '%" +
          self.search.busname + "%'";
        if (self.search.status !== "") {    // 状态
          rules += " AND status = ?";
        }
        if (self.search.bd !== "") {    // bd
          rules += " AND bd LIKE '%" + self.search.bd + "%'";
        }
        if (self.search.dateRange[0] && self.search.dateRange[0] !== "") {     // 日期
          rules += "AND submit_time >= '" + self.search.dateRange[0] + " 00:00:00'" +
            " AND submit_time <= '" + self.search.dateRange[1] + " 23:59:59'";
        }
        self.getTables(function(datas) {
          var res = alasql(rules, [datas, self.search.status]);
          self.currentPage = 1;
          self.fillTable(res);
        });
      },
      /* 清空筛选 */
      rulesReset: function() {
        var self = this;
        self.$refs.dateRange.reset();
        self.$refs.busname.reset();
        self.$refs.bd.reset();
        self.$refs.status.reset();
        self.currentPage = 1;
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this;
        self.currentPage = currentPage;
        self.fillTable(self.totalDatas);
      },

      /* 表格数据选择 */
      distributeBD: function(row) {
        var self = this;
        self.dialog.BDvisible = true;
        self.table.applynum = row.applynum;
        self.dialog.BD = row.bd;
      },

      /* 模态框操作 选择要分配得BD */
      chooseBD: function(value) {
        var self = this;
        self.dialog.BD = value;
      },

      /* 分配任务 */
      BDassignment: function() {
        var self = this;
        var formData = new FormData();
        if (self.dialog.BD !== "") {
          if (typeof self.dialog.BD === "number") {
            formData.append("applynum", self.table.applynum);
            formData.append("bd_id", self.dialog.BD);
            self.$http.post(BDAPPLY_ASSIGN_URL, formData)
              .then(function(response) {
                if (response.body.success) {
                  self.dialog.BDvisible = false;
                  self.dialog.tipsVisible = true;
                  modalHide(function() {
                    self.dialog.tipsVisible = false;
                    for (let i = 0; i < self.tableDatas.length; i++) {
                      if (self.tableDatas[i].applynum === self.table.applynum) {
                        self.tableDatas[i].bd = self.$refs.bd.selectedLabel;
                      }
                    }
                  });
                }
              });
          } else {
            self.dialog.BDvisible = false;
            self.dialog.tipsVisible = true;
            modalHide(function() {
              self.dialog.tipsVisible = false;
            });
          }
        } else {
          return false;
        }
//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }
      }
    },
    components: {
      datePicker,
      inputSearch,
      selectSearch,
      dialogTips,
      bdList
    }
  };
</script>

<style scoped>

</style>
