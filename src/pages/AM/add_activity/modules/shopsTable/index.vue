<template>
  <el-row>
    <el-col :span="18">
      <tab-badge-component :tabs="shops.tabs"
                           :which="shops.which"
                           :number="shops.number"
                           :onBadge="shops.onBadge"
                           v-on:toggle="tabChange">
      </tab-badge-component>
    </el-col>

    <!--已选商家表格-->
    <el-col :span="16" v-show="shops.which==='selectedStores'">
      <el-table ref="table"
                border style="width: 100%;"
                highlight-current-row
                :data="selected.tableDatas"
                row-key="bus_id">
        <el-table-column label="选择" align="center" width="90px">
          <template scope="scope">
            <el-button type="danger" size="mini" icon="minus" style="padding:2px;"
                       @click="deleteStore(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
      </el-table>

      <el-row class="pageination">
        <el-pagination :current-page="selected.currentPage"
                       :page-size="selected.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="selected.totalItems"
                       :page-sizes=[selected.pageSize]
                       @current-change="handleChange">
        </el-pagination>
      </el-row>
    </el-col>

    <!--商家搜索表格-->
    <el-col :span="16" v-show="shops.which==='storesSearch'">
      <el-table ref="table"
                border style="width: 100%;"
                highlight-current-row
                :data="whole.tableDatas"
                row-key="bus_id">
        <el-table-column label="选择" align="center" width="90px">
          <template scope="scope">
            <el-button type="primary" size="mini" icon="plus"
                       style="padding:2px;" @click="addStore(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="busname" label="商家名称" align="center" min-width="130px"></el-table-column>
        <el-table-column prop="account" label="商家账号" align="center" min-width="130px"></el-table-column>
      </el-table>

      <el-row class="pageination">
        <el-pagination :current-page="whole.currentPage"
                       :page-size="whole.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="whole.totalItems"
                       :page-sizes=[whole.pageSize]
                       @current-change="handleChange">
        </el-pagination>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import tabBadgeComponent from "../../../../../components/tabs/badge/index";
  import {EVENTS_CMSEARCHSHOPS_URL} from "../../../../../common/interface";

  export default{
    props: {
      table: String,       // 显示表格
      datas: Array         // 指定门店
    },
    data() {
      return {
        placeholder: "请输入商家名称",
        shops: {    // 商家切换
          tabs: {  // tab标题
            "selectedStores": "已选商家",
            "storesSearch": "商家搜索"
          },
          number: 0,
          onBadge: "selectedStores",
          which: "storesSearch"
        },
        selected: {         // 已选商家（表格）
          idArr: [],                // 商家id数组
          totalDatas: [],           // 表格总数据
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        },
        whole: {         // 商家总数据
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        }
      };
    },
    created() {
      var self = this;
      if (self.datas.length > 0) {
        self.selected.totalDatas = self.datas;
        self.shops.number = self.datas.length;
        for (let i = 0; i < self.datas.length; i++) {
          self.selected.idArr.push(self.datas[i].bus_id);
        }
        self.tabChange(self.table);
      }
      self.refreshTables();
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        var self = this;
        self.shops.which = name;
        if (name === "selectedStores") {  // 已选商家
          self.fillTable("selected", self.selected.totalDatas);
        } else {  // 商家搜索
          self.fillTable("whole", self.whole.totalDatas);
        }
      },
      /* 填充表格数据 */
      fillTable: function(name, datas) {
        var self = this;
        self[name].tableDatas = datas.slice((self[name].currentPage - 1) *
          self[name].pageSize, self[name].currentPage * self[name].pageSize);
        self[name].totalItems = parseInt(datas.length);
      },
      /* 获取商家搜索总数据（刷新） */
      refreshTables: function() {
        var self = this;
        self.$http.get(EVENTS_CMSEARCHSHOPS_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.buses;
            self.whole.totalDatas = datas;
            self.fillTable("whole", datas);
          }
        });
      },
      // 添加商家
      addStore: function(row) {
        var self = this;
        var arr = self.selected.idArr;
        if (arr.length < 1) {
          self.selected.idArr.push(row.bus_id);
          self.selected.totalDatas.push(row);
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === row.bus_id) {
              break;
            } else {
              if (i === arr.length - 1) {
                self.selected.idArr.push(row.bus_id);
                self.selected.totalDatas.push(row);
              }
            }
          }
        }
        self.shops.number = self.selected.totalDatas.length;
      },
      // 删除商家
      deleteStore: function(row) {
        var self = this;
        var arr = self.selected.idArr;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === row.bus_id) {
            self.selected.idArr.splice(i, 1);
            self.selected.totalDatas.splice(i, 1);
            self.shops.number = self.selected.totalDatas.length;
            break;
          }
        }
        for (let i = 0; i < self.selected.tableDatas.length; i++) { // 该页删除此条数据
          if (self.selected.tableDatas[i].bus_id === row.bus_id) {
            self.selected.tableDatas.splice(i, 1);
          }
        }
        if (self.selected.tableDatas.length % 10 === 0) {    // 删除到一页的最后一条，返回上一页
          self.selected.currentPage = self.selected.currentPage - 1;
          self.handleChange();
        }
      },
      /* 翻页 */
      handleChange(currentPage) {
        var self = this;
        var name = "whole";
        if (self.shops.which === "selectedStores") {
          name = "selected";
        }
        self[name].currentPage = currentPage;
        self.fillTable(name, self[name].totalDatas);
      },

      /* 返回选择商家id数组 */
      returnBusIds: function() {
        var self = this;
        return self.selected.idArr;
      }
    },
    components: {
      tabBadgeComponent
    }
  };
</script>
