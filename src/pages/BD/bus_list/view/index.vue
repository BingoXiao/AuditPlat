<template>
  <el-row class="panel-center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2" style="position: relative;">
        <el-row>
          <el-col :span="5">
            <el-button size="mini" type="primary" class="backTo" @click="backTo">返回商家列表</el-button>
          </el-col>
          <el-col :span="15" style="font-family: 'SimHei';margin-top: 5px">
            <span>
              商家账号：&emsp;{{busAccount}}
            </span>
          </el-col>
          <br/><br/>
        </el-row>

        <el-row style="padding-top: 10px;">
          <tab-component :tabs="tabs" :which="which" v-on:toggle="tabChange"></tab-component>
          <div class="braSwitch">
            <span>切换分店：</span>
            <el-select v-model="branch" @change="changeBranch">
              <el-option
                v-for="item in branches"
                :value="item.bus_id"
                :label="item.busname">
              </el-option>
            </el-select>
          </div>
        </el-row>
      </el-col>

      <!--正文-->
      <el-col :span="20" :offset="2">
        <show-basic-info v-show="currentView === 'basic'" :filling="basicInfo"></show-basic-info>
        <show-bl-info v-show="currentView === 'bl'" :filling="blInfo"></show-bl-info>
        <show-sl-info v-show="currentView === 'sl'" :filling="slInfo"></show-sl-info>
        <show-check-info v-show="currentView === 'check'" :Bank="bankInfo" :ID="idInfo"></show-check-info>
        <contract-info v-show="currentView === 'cons'" :filling="constractInfo"
                       :account="busAccount"></contract-info>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../../components/tabs/inner/index"
  import showBasicInfo from "../module/showBasInfoE/index"
  import showBlInfo from "../module/showBlInfo/index"
  import showSlInfo from "../module/showSlInfo/index"
  import showCheckInfo from "../../bus_register/module/show_check_info/index"
  import contractInfo from "../module/contractInfo/index"
  import {BUSLIST_BRANCH_URL, BUSLIST_BASIC_URL,
    BUSLIST_BLIC_URL, BUSLIST_SLIC_URL, BUSLIST_CONSTRA_URL,
    BUSLIST_ID_URL, BUSLIST_SETTLER_URL} from "../../../../common/interface"
  import {getUrlParameters} from "../../../../common/common"

  export default{
    data() {
      return {
        tabs: {
          "basic": "基本信息",
          "bl": "营业执照",
          "sl": "餐饮许可证",
          "check": "结算信息",
          "cons": "商家合约"
        },
        which: "basic",
        currentView: "basic",      // 当前显示模块
        branches: [],
        branch: "",
        busAccount: "",     // 商家账号
        basicInfo: {},      // 基本信息
        blInfo: {},         // 营业执照
        slInfo: {},         // 许可证
        bankInfo: {},       // 银行信息
        idInfo: {},         // 身份信息
        constractInfo: {}   // 合约信息
      }
    },
    mounted() {
      this.branchlist()
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        this.currentView = name
      },
      // 获取分店列表
      branchlist: function() {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        let acc = getUrlParameters(window.location.hash, "account")
        self.$http.get(BUSLIST_BRANCH_URL + "?bususer_id=" + id).then(function(response) {
          if (response.body.success) {
            self.branches = response.body.content
            self.branch = (self.branches)[0].bus_id
            self.busAccount = acc
          }
        })
      },
      // 获取商家列表信息
      get_buslist_info: function(busId, acc) {
        var self = this
        self.get_basic_info(busId)
        self.get_bl_info(busId)
        self.get_sl_info(busId)
        self.get_bank_info(acc)
        self.get_id_info(acc)
        self.get_contract_info(acc)
      },
      // 改变分店
      changeBranch: function(value) {
        var self = this
        self.get_buslist_info(value, self.busAccount)
      },
      // 获取基本信息
      get_basic_info: function(busId) {
        var self = this
        self.$http.get(BUSLIST_BASIC_URL + "?bus_id=" + busId).then(function(response) {
          if (response.body.success) {
            self.basicInfo = response.body.content
          }
        })
      },
      // 获取营业执照
      get_bl_info: function(busId) {
        var self = this
        self.$http.get(BUSLIST_BLIC_URL + "?bus_id=" + busId).then(function(response) {
          if (response.body.success) {
            self.blInfo = response.body.content
          }
        })
      },
      // 获取餐饮许可证
      get_sl_info: function(busId) {
        var self = this
        self.$http.get(BUSLIST_SLIC_URL + "?bus_id=" + busId).then(function(response) {
          if (response.body.success) {
            self.slInfo = response.body.content
          }
        })
      },
      // 获取银行信息
      get_bank_info: function(acc) {
        var self = this
        self.$http.get(BUSLIST_SETTLER_URL + "?account=" + acc).then(function(response) {
          if (response.body.success) {
            self.bankInfo = response.body.content
          }
        })
      },
      // 获取身份信息
      get_id_info: function(acc) {
        var self = this
        self.$http.get(BUSLIST_ID_URL + "?account=" + acc).then(function(response) {
          if (response.body.success) {
            self.idInfo = response.body.content
          }
        })
      },
      // 获取合约信息
      get_contract_info: function(acc) {
        var self = this
        self.$http.get(BUSLIST_CONSTRA_URL + "?account=" + acc).then(function(response) {
          if (response.body.success) {
            self.constractInfo = response.body.content
          }
        })
      },
      // 返回商家列表
      backTo: function() {
        this.$router.push({path: "/bus_list"})
      }
    },
    components: {
      tabComponent,
      showBasicInfo,
      showBlInfo,
      showSlInfo,
      showCheckInfo,
      contractInfo
    }
  }
</script>

<style scoped>
  .braSwitch {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
  }

  .backTo{
    padding:6px 15px;
  }
</style>
