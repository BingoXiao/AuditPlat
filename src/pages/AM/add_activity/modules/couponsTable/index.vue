<template>
  <el-row>
    <el-col :span="18">
      <tab-badge-component :tabs="coupons.tabs"
                           :which="coupons.which"
                           :number="coupons.number"
                           :onBadge="coupons.onBadge"
                           v-on:toggle="tabChange">
      </tab-badge-component>
    </el-col>

    <!--新增优惠券-->
    <el-col :span="16" v-show="coupons.which==='selectedCoupons'">
      <el-table ref="table"
                border style="width: 100%;"
                highlight-current-row
                :data="selected.tableDatas"
                row-key="id">
        <el-table-column label="选择" align="center" width="90px">
          <template scope="scope">
            <el-button type="danger" size="mini" icon="minus"
                       style="padding:2px;" @click="deleteCoupon(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="name" label="名称" align="center" min-width="150px"></el-table-column>
        <el-table-column label="优惠" align="center" min-width="160px">
          <template scope="scope">
            <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
          </template>
        </el-table-column>
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

    <!--优惠券列表-->
    <el-col :span="16"  v-show="coupons.which==='wholeCoupons'">
      <el-table ref="table"
                border style="width: 100%;"
                highlight-current-row
                :data="whole.tableDatas"
                row-key="id">
        <el-table-column label="选择" align="center" width="90px">
          <template scope="scope">
            <el-button type="primary" size="mini" icon="plus"
                       style="padding:2px;" @click="addCoupon(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="name" label="名称" align="center" min-width="150px"></el-table-column>
        <el-table-column label="优惠" align="center" min-width="160px">
          <template scope="scope">
            <span>满 {{scope.row.amount_full}} 元 减 {{scope.row.amount_cut}} 元</span>
          </template>
        </el-table-column>
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
  import {EVENTS_CLTABLE_URL} from "../../../../../common/interface";

  export default{
    props: {
      table: String,       // 显示表格
      datas: Array         // 已添加优惠券
    },
    data() {
      return {
        coupons: {
          tabs: {
            "selectedCoupons": "已添加优惠券",
            "wholeCoupons": "优惠券列表"
          },
          onBadge: "selectedCoupons",
          number: 0,
          which: "wholeCoupons"
        },
        selected: {         // 已选优惠券
          idArr: [],                // 优惠券id数组
          totalDatas: [],           // 表格总数据
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        },
        whole: {         // 优惠券列表
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        }
      };
    },
    created() {
      var self = this;
      self.refreshTables();
    },
    watch: {
      datas: function() {
        var self = this;
        if (self.datas.length > 0) {
          self.selected.totalDatas = self.datas;
          self.coupons.number = self.datas.length;
          for (let i = 0; i < self.datas.length; i++) {
            self.selected.idArr.push(self.datas[i].id);
          }
          self.tabChange(self.table);
        }
      }
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        var self = this;
        self.coupons.which = name;
        if (name === "selectedCoupons") {  // 已选商家
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
      /* 获取优惠券李彪总数据（刷新） */
      refreshTables: function() {
        var self = this;
        self.$http.get(EVENTS_CLTABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.coupons;
            self.whole.totalDatas = datas;
            self.fillTable("whole", datas);
          }
        });
      },
      // 添加优惠券
      addCoupon: function(row) {
        var self = this;
        var arr = self.selected.idArr;
        if (arr.length < 1) {
          self.selected.idArr.push(row.id);
          self.selected.totalDatas.push(row);
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === row.id) {
              break;
            } else {
              if (i === arr.length - 1) {
                self.selected.idArr.push(row.id);
                self.selected.totalDatas.push(row);
              }
            }
          }
        }
        self.coupons.number = self.selected.totalDatas.length;
      },
      // 删除优惠券
      deleteCoupon: function(row) {
        var self = this;
        var arr = self.selected.idArr;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === row.id) {
            self.selected.idArr.splice(i, 1);
            self.selected.totalDatas.splice(i, 1);
            self.coupons.number = self.selected.totalDatas.length;
            break;
          }
        }
        for (let i = 0; i < self.selected.tableDatas.length; i++) {
          if (self.selected.tableDatas[i].id === row.id) {
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
        if (self.coupons.which === "selectedCoupons") {
          name = "selected";
        }
        self[name].currentPage = currentPage;
        self.fillTable(name, self[name].totalDatas);
      },

      /* 返回选择优惠券id数组 */
      returnIds: function() {
        var self = this;
        return self.selected.idArr;
      }
    },
    components: {
      tabBadgeComponent
    }
  };
</script>

<style scoped>

</style>
