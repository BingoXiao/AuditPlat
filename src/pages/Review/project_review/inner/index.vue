<template>
  <el-row class="panel-center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="2">
        <el-col :span="24" class="buttonGroup" style="text-align: left">
          <el-form ref="basicForm" label-width="100px">
            <h3 class="formTitle">门店信息</h3>
            <el-row>
              <el-col :span="20">
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
                <el-row v-if="moreShops" style="margin-top:13px;font-size: 14px;">
                  <el-col :span="2" :offset="22" style="text-align: right;">
                    <b style="cursor: pointer" @click="get_more_shops">更多>></b>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <h3 class="formTitle">项目信息</h3>
            <el-row>
              <el-col :span="10">
                <el-form-item label="项目分类：">
                  <div class="info">美食 > {{data.category_parent_name}}
                    <span v-if="data.category_name"> > </span>
                    {{data.category_name}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="佣金比例：">
                  <span class="info">{{data.commission}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="项目图片：">
              <span v-for="item in data.photos" class="info" style="margin-right:20px">
                <img :src="item" alt="" style="width:140px;height: 140px;">
              </span>
            </el-form-item>

            <el-row>
              <el-col :span="10">
                <el-form-item label="项目名称：">
                  <span class="info">{{data.name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用餐人数：">
                  <span class="info">{{data.recommend_use_people_number}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="菜单组合：" style="margin-bottom: 0"></el-form-item>
            <el-form-item label-width="18px">
              <el-col :span="20">
                <el-row class="myTable">
                  <el-col :span="24" v-for="obj in data.foods">
                    <el-row class="">
                      <span>{{obj.name}}</span>
                      <span>{{obj.choose}}</span>
                      <span v-if="obj.choose !== '全部可用' && obj.can_repeat"> (可重复选) </span>
                    </el-row>
                    <el-row v-for="item in obj.items">
                      <el-col :span="8">{{item.name}}</el-col>
                      <el-col :span="8">￥ {{item.price}} / {{item.unit_name}}</el-col>
                      <el-col :span="8">{{item.count}}</el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-form-item>


          </el-form>
          <br/>
          <el-button v-if="showBtn" type="primary" size="large" @click="passDialog = true">&emsp;通 过&emsp;</el-button>
          <el-button v-if="showBtn" type="danger" size="large" @click="rejectDialog = true">&emsp;驳 回&emsp;</el-button>
          <el-button type="primary" size="large" @click="backTo">&emsp;返 回&emsp;</el-button>
        </el-col>
      </el-col>
    </el-col>

    <!--通过-->
    <el-dialog size="tiny" v-model="passDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p style="font-size: 17px">确认商家<b> "{{shopName}} (申请编号: {{applynum}})" </b>申请审核通过？</p>
          <br/>
          <div class="buttonGroup" style="margin-bottom:20px">
            <el-button type="primary" size="large" @click="pass(true)">确 认</el-button>
            <el-button size="large" @click="passDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--驳回-->
    <el-dialog title="" v-model="rejectDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p style="font-size:16px;letter-spacing:1px;line-height:25px;margin-top: 0">
            亲爱的审核员，您未通过 <b>"{{shopName}} (申请编号: {{applynum}})"</b> 的申请审核，请输入未通过审核原因
          </p>
          <p>未通过原因：</p>
          <el-radio-group v-model="rejectReason" style="line-height: 30px">
            <el-col :span="12">
              <el-radio label="商家信息有误/不真实">商家信息有误/不真实</el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio label="商家资质信息审核不通过">商家资质信息审核不通过</el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio label="负责人信息审核不通过">负责人信息审核不通过</el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio label="其他(请填写)">其他(请填写)</el-radio>
            </el-col>
          </el-radio-group>
          <br/>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            :disabled="rejectReason !== '其他(请填写)'"
            :autosize="{ minRows: 4}"
            v-model="textarea">
          </el-input>
          <br/><br/>
          <div class="buttonGroup" style="margin-bottom:20px">
            <el-button type="primary" size="large" @click="pass(false)">发 送</el-button>
            <el-button type="primary" size="large" @click="rejectDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--提示-->
    <el-dialog v-model="tipsVisible" size="tiny"
               :close-on-click-modal="false" class="tipsModal">
      <div class="mainTips">
        <i class="el-icon-circle-check"></i>
        {{dialogtips}}
        <p class="returnTips">自动返回系统中...</p>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import {PROVERIFY_FILLING_URL, PROVERIFY_PASS_URL} from "../../../../common/interface"
  import {modalHide, getUrlParameters} from "../../../../common/common"

  export default{
    data() {
      return {
        showBtn: false,      // 是否显示审核和驳回按钮
        shopName: "",        // 商家名称
        applynum: "",        // 审编号
        shopTable: [],       // 门店信息表格
        moreShops: false,    // 查看更多门店
        data: {
          category_parent_name: "",   // 二级分类
          category_name: "",           // 三级分类
          commission: "",       // 佣金比例
          photos: [],            // 项目图片
          name: "",      // 项目名称
          recommend_use_people_number: "",  // 用餐人数
          foods: []         // 菜单组合
        },
        rejectReason: "",    // 驳回原因
        textarea: "",
        rejectDialog: false,   // 驳回模态框
        passDialog: false,     // 驳回模态框
        tipsVisible: false,    // 操作提示模态框
        dialogtips: ""         // 操作提示
      }
    },
    mounted() {
      var self = this
      self.get_info()
      if (self.$route.name === "商家申请审核") {
        self.showBtn = true
      } else {
        self.showBtn = false
      }
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        this.currentView = name
      },
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
              if (self.shopTable.length > 5) {   // 查看更多门店
                self.moreShops = true
              }
              self.data.category_parent_name = data.category_parent_name   // 二级分类
              self.data.category_name = data.category_name  // 三级分类
              self.data.commission = data.commission   // 佣金比例
              self.data.photos = data.photos   // 佣金比例
              self.data.name = data.name   // 项目名称
              self.data.recommend_use_people_number = data.recommend_use_people_number   // 用餐人数
              self.data.foods = data.foods     // 菜单组合
            }
          })
      },
      // 查看更多门店
      get_more_shops: function() {
        var href, otherWindow
        let id = getUrlParameters(window.location.hash, "id")
        href = "#/project/wholeShops#id=" + id
        otherWindow = window.open(href, "",
          'height=500, width=860, top=' + (screen.height - 500) / 2 + ',left=' + (screen.width - 800) / 2 + ',alwaysRaised=yes,' +
          'toolbar=no,menubar=no,location=no,status=no')
        otherWindow.opener = null
      },
      // 返回商家列表
      backTo: function() {
        var self = this
        var htmlSrc = self.$route.path.substring(0, self.$route.path.lastIndexOf("/"))
        self.$router.push({path: htmlSrc})
      },
      // 审核
      pass: function(flag) {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        var formdata = {}
        if (flag) {   // 通过
          formdata = {
            flag: flag,
            item_id: id,
            reject_reason: ""
          }
          self.dialogtips = "审核成功"
        } else {   // 驳回
          formdata = {
            flag: flag,
            item_id: id,
            reject_reason: self.rejectReason
          }
          if (self.rejectReason === "其他(请填写)") {
            formdata.reject_reason = self.textarea
          }
          self.dialogtips = "发送成功"
        }
        self.$http.post(PROVERIFY_PASS_URL,
          JSON.stringify(formdata),
          {emulateJSON: true})
          .then(function(response) {
            if (response.body.success) {
              self.passDialog = false
              self.rejectDialog = false
              self.tipsVisible = true
              modalHide(function() {
                self.tipsVisible = false
                self.$router.push({path: "/bus_review/bus_apply"})
              })
            }
          })
      }
    }
  }
</script>

<style scoped>
  .myTable{
    width: 100%;
    padding: 0;
    border: 1px solid rgb(210, 212, 215);
  }
  .myTable th{
    padding:0 20px;
    border-bottom: 1px solid rgb(210, 212, 215);
  }
  .myTable tr td{
    padding: 0 20px;
  }
  .myTable tr td:nth-child(2){
    padding: 0 20px;
    text-align: center;
  }
  .myTable tr td:last-child{
    padding: 0 20px;
    text-align: right;
  }
</style>
