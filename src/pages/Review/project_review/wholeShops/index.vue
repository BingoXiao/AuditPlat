<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <el-col :span="24" class="buttonGroup" style="text-align: left">
        <el-table :data="shopTable" border highlight-current-row style="width: 100%;">
          <el-table-column prop="name" label="门店名称" align="center"></el-table-column>
          <el-table-column label="门店图" align="center">
            <template scope="scope">
              <p>
                <img :src="scope.row.logo" alt="" style="width:80px;height:80px;">
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="门店地址" align="center"></el-table-column>
          <el-table-column label="门店电话" align="center">
            <template scope="scope">
              <div v-for="item in scope.row.tel">{{item}}</div>
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
    </el-col>
  </el-row>
</template>

<script>
  import {PROVERIFY_FILLING_URL, PROVERIFY_PASS_URL} from "../../../../common/interface"
  import {getUrlParameters} from "../../../../common/common"

  export default{
    data() {
      return {
        shopTable: [],            // 门店信息表格
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1            // 当前页
      }
    },
    mounted() {
      var self = this
      self.get_info()
    },
    methods: {
      // 获取信息
      get_info: function() {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        self.$http.get(PROVERIFY_FILLING_URL + "?item_id=" + id)
          .then(function(response) {
            if (response.body.success) {
              var data = response.body.content.data
              for (let j = 0; j < data.shops.length; j++) {     // 新电话
                let item = data.shops[j]
                let str = ""
                for (let i = 1; i <= 5; i++) {
                  if (item["tel_" + i]) {
                    str += item["tel_" + i] + ","
                  }
                }
                item.tel = str.split(",")
              }
              self.shopTable = data.shops
              if (self.shopTable.length > 5) {
                self.moreShops = true
              }
            }
          })
      },
      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      }
    }
  }
</script>
