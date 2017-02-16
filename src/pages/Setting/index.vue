<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="85px">
        <el-form-item label="用户账号：">
          <inputSearch-component></inputSearch-component>
        </el-form-item>

        <el-form-item label="状态：">
          <selectSearch-component></selectSearch-component>
        </el-form-item>
      </el-form>
    </el-col>

    <!--按钮-->
    <el-col :span="24">
      <el-col :span="19">
        <el-button-group>
          <el-button type="primary">启 用</el-button>
          <el-button type="primary">冻 结</el-button>
          <el-button type="primary">删 除</el-button>
        </el-button-group>
      </el-col>

      <el-col :span="5" style="text-align: right">
        <el-button type="primary" @click="addUsersVisible = true">添加用户</el-button>
      </el-col>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <br/>
      <el-table :data="tableDatas" border highlight-current-row style="width: 100%;">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="account" label="用户账号" align="center"></el-table-column>
        <el-table-column label="已开通服务" align="center">
          <template scope="scope">
            <span v-for="item in scope.row.service">
              <i class="iconfont" :class="item"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="is_active" label="状态" align="center">
          <template scope="scope">
            <el-switch v-model="scope.row.is_active" on-color="#020202" off-color="#C0CCDA"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button type="text" icon="edit" @click="handleEdit"></el-button>
            <el-button type="text"><i class="iconfont icon-yaochi-copy"
                                      style="font-weight: bold;font-size:15px;"></i></el-button>
            <el-button type="text" icon="delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-col :span="24" style="text-align: center;margin-top: 20px;">
      <el-pagination :current-page="currentPage"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalItems" :page-sizes=[10]
                     @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>

    <!--添加用户-->
    <el-dialog title=" 添加用户" v-model="addUsersVisible"
               :close-on-click-modal="false">
      <div class="modal">
        <el-form :model="addUsersForm" ref="addUsersForm" :rules="rules" label-width="60px">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="addUsersForm.name" autofocus name="name"></el-input>
          </el-form-item>

          <el-form-item label="账号：" prop="account">
            <el-input v-model="addUsersForm.account" name="account"></el-input>
          </el-form-item>

          <el-form-item label="密码：" prop="password">
            <el-input type="password" auto-complete="off"
                      v-model="addUsersForm.password" name="password"></el-input>
          </el-form-item>

          <el-form-item label="权限：" prop="perms">
            <el-checkbox-group v-model="addUsersForm.perms" @change="permsCheckedChange">
              <el-checkbox name="bus_verify" label="bus_verify">
                <i class="iconfont icon-kaidianchenggong"></i> 商家审核
              </el-checkbox>
              <el-checkbox name="project_verify" label="project_verify">
                <i class="iconfont icon-gendan"></i> 项目审核
              </el-checkbox>
              <el-checkbox name="checkout_verify" label="checkout_verify">
                <i class="iconfont icon-shiliangzhinengduixiang"></i> 结款审核
              </el-checkbox>
              <el-checkbox name="bus_apply" label="bus_apply" style="margin-left: 0;">
                <i class="iconfont icon-audit"></i> 商家申请
              </el-checkbox>
              <el-checkbox name="bus_register" label="bus_register">
                <i class="iconfont icon-xiangmushu"></i> 商家注册
              </el-checkbox>
              <el-checkbox name="item_list" label="item_list">
                <i class="iconfont icon-xiangmu"></i> 项目列表
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <br/>
        <el-row type="justify" align="center">
          <el-button type="primary" @click="addUsers"
                     style="padding: 10px 30px;">添 加
          </el-button>
        </el-row>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import inputSearchComponent from "../../components/search/input/index"
  import selectSearchComponent from "../../components/search/select/index"
  import {ACCOUNTS_TABLE_URL} from "../../common/interface"
  import {isName, isAccount, isPassword} from "../../common/common"

  export default{
    data() {
      var nameV = (rule, value, callback) => {
        var nameV = isName(value)
        if (nameV.flag) {
          callback(new Error(nameV.errorTips))
        } else {
          callback()
        }
      }
      var accountV = (rule, value, callback) => {
        var accountV = isAccount(value)
        if (accountV.flag) {
          callback(new Error(accountV.errorTips))
        } else {
          callback()
        }
      }
      var passwordV = (rule, value, callback) => {
        var passwordV = isPassword(value)
        if (passwordV.flag) {
          callback(new Error(passwordV.errorTips))
        } else {
          callback()
        }
      }
      return {
        tableDatas: [],         // 表格每页显示数据
        totalItems: 0,          // 总条目数
        pageSize: 10,           // 每页显示条目个数
        currentPage: 1,         // 当前页
        addUsersVisible: false, // 添加用户模态框
        addUsersForm: {         // 添加用户
          name: "",
          account: "",
          password: "",
          perms: []
        },
        rules: {
          name: [
            { validator: nameV, trigger: "blur" }
          ],
          account: [
            { validator: accountV, trigger: "blur" }
          ],
          password: [
            { validator: passwordV, trigger: "blur" }
          ]
        }
      }
    },
    mounted: function() {
      this.getTables()
    },
    methods: {
      /* 获取表格数据 */
      getTables: function() {
        var self = this
        self.$http.get(ACCOUNTS_TABLE_URL).then(function(response) {
          if (response.data.success) {
            var datas = response.data.content
            for (var i = 0; i < datas.length; i++) {
              var item = datas[i]
              var service = []
              /* 已开通服务 */
              if (item.bus_verify) {   // 商家审核权限
                service.push("icon-kaidianchenggong")
              }
              if (item.project_verify) { // 项目审核权限
                service.push("icon-gendan")
              }
              if (item.checkout_verify) {  // 结款审核权限
                service.push("icon-shiliangzhinengduixiang")
              }
              if (item.bus_apply) { // 商家申请权限
                service.push("icon-audit")
              }
              if (item.bus_register) {  // 商家注册权限
                service.push("icon-xiangmushu")
              }
              if (item.item_list) {  // 项目注册权限
                service.push("icon-xiangmu")
              }
              datas[i].service = service
            }

            self.tableDatas = datas.slice((self.currentPage - 1) * 10, self.currentPage * 10)
            self.totalItems = parseInt(datas.length)
          }
        }, function() {
          /* 失败回调 */
        })
      },
      /* 编辑 */
      handleEdit(index, row) {
        console.log(index, row)
      },
      /* 改变当前页 */
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.getTables()
      },
      permsCheckedChange: function(value) {
        console.log(value.length)
      },
      /* 添加用户 */
      addUsers: function() {
        console.log(this.addUsersForm.perms)
      }
    },
    components: {
      inputSearchComponent,
      selectSearchComponent
    }
  }
</script>

<style scoped>
  table .iconfont {
    font-size: 22px;
    margin-right: 4px;
  }

  .el-checkbox .iconfont {
    font-size: 18px;
    vertical-align: middle;
  }

  .el-checkbox .icon-xiangmushu, .el-checkbox .icon-shiliangzhinengduixiang {
    font-size: 21px;
  }

  .el-checkbox .icon-audit {
    font-size: 19px;
  }
</style>
