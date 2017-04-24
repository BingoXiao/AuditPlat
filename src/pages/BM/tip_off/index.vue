<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-row>
        <el-form :inline="true" label-width="85px">
          <el-form-item label="举报等级：" class="select">
            <select-search name="ranking"
                           :options="search.rank"
                           v-on:getRules="getFilterRules"></select-search>
          </el-form-item>

          <el-form-item label="状态：" class="select">
            <select-search name="status"
                           :options="search.state"
                           v-on:getRules="getFilterRules"></select-search>
          </el-form-item>

          <el-form-item label="" label-width="10px">
            <el-button type="primary" size="small" icon="search"
                       @click="filterTable">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row type="flex" justify="end" style="margin-bottom:10px;">
        <el-button type="primary" @click="processed('HANDLED')">已处理</el-button>
        <el-button type="danger" @click="processed('UNHANDLED')">未处理</el-button>
      </el-row>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <el-table ref="table" :data="tableDatas" border v-loading.body="loading"
                highlight-current-row style="width: 100%;"
                row-key="id"
                @selection-change="getSelectedArr">
        <el-table-column type="selection" width="70px" align="center"
                         :reserve-selection="true"></el-table-column>
        <el-table-column prop="time" label="举报时间" align="center" min-width="160px"></el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="rank" label="处理等级" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="content" label="举报事件" align="center" min-width="110px"></el-table-column>
        <el-table-column prop="bd" label="BD联系人" align="center" min-width="100px"></el-table-column>
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
  import alasql from "alasql";
  import selectSearch from "../../../components/search/select/index";
  import dialogTips from "../../../components/dialogTips/index.vue";
  import {modalHide} from "../../../common/common";
  import {COMPAINTS_TABLE_URL, COMPAINTS_SUBMIT_URL} from "../../../common/interface";

  export default {
    data() {
      return {
        loading: false,
        search: {           // 搜索栏
          ranking: "",      // 等级
          status: "",       // 状态
          rank: [               // 等级
            {
              value: "一级",
              label: "一级"
            }, {
              value: "二级",
              label: "二级"
            }, {
              value: "三级",
              label: "三级"
            }],
          state: [               // 状态
            {
              value: "未处理",
              label: "未处理"
            }, {
              value: "已处理",
              label: "已处理"
            }]
        },
        selectArr: [],            // 选中数组
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        isRight: true,       // 提示框
        tips: "操作成功！",
        tipsVisible: false
      };
    },
    created() {
      var self = this;
      self.getTables(function(datas) {
        self.fillTable(datas);
      });
    },
    methods: {
      /* 获取数据（表格） */
      getTables: function(func) {
        var self = this;
        self.loading = true;
        self.$http.get(COMPAINTS_TABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content;
            func(datas);
          }
        });
      },
      /* 填充（表格） */
      fillTable: function(data) {
        var self = this;
        var datas = alasql("SELECT * FROM ? ORDER BY time DESC", [data]);
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
        var rules = "SELECT * FROM ? WHERE rank LIKE '%" + self.search.ranking + "%'";
        if (self.search.status !== "") {    // 状态
          rules += " AND status = ?";
        }
        self.getTables(function(datas) {
          var res = alasql(rules, [datas, self.search.status]);
          self.currentPage = 1;
          self.fillTable(res);
        });
      },

      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        var self = this;
        this.currentPage = currentPage;
        self.fillTable(self.totalDatas);
      },

      /* 每页条数改变时 */
      pageSizesChange: function(size) {
        var self = this;
        this.pageSize = size;
        self.fillTable(self.totalDatas);
      },

      /* 获取选中项 */
      getSelectedArr: function(selection) {
        var self = this;
        var arr = [];
        for (let i = 0; i < selection.length; i++) {
          arr.push(selection[i].id);
        }
        self.selectArr = arr;
      },

      // 处理
      processed: function(status) {
        var self = this;
        var formData = new FormData();
        if (self.selectArr.length < 1) {
          self.isRight = false;
          self.tips = "请选择商家！";
          self.tipsVisible = true;
          modalHide(function() {
            self.tipsVisible = false;
          });
        } else {
          self.isRight = true;
          formData.append("ids[]", self.selectArr);
          formData.append("status", status);    // 已处理"HANDLED"，未处理UNHANDLED
          self.$http.post(COMPAINTS_SUBMIT_URL, formData)
            .then(function(response) {
              if (response.data.success) {
                self.tipsVisible = true;
                modalHide(function() {
                  self.tipsVisible = false;
                  var state = "未处理";
                  for (let i = 0; i < self.selectArr.length; i++) {
                    for (let j = 0; j < self.totalDatas.length; j++) {
                      if (self.totalDatas[j].id === self.selectArr[i]) {
                        if (status === "HANDLED") {
                          state = "已处理";
                        }
                        self.totalDatas[j].status = state;
                        continue;
                      }
                    }
                  }
                });
              }
            });
        }
      }
    },
    components: {
      selectSearch,
      dialogTips
    }
  };
</script>

<style scoped>

</style>
