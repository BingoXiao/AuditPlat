<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="85px">
        <el-form-item label="用户账号：">
          <input-search></input-search>
        </el-form-item>

        <el-form-item label="状态：">
          <select-search></select-search>
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
        <el-button type="primary" @click="dialog.addUsersVisible = true">添加用户</el-button>
      </el-col>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <br/>
      <el-table :data="tableDatas" border highlight-current-row style="width: 100%;"
                @row-click="getRowDatas" :row-key="tableDatas.id">
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
            <el-button type="text" icon="edit" @click="dialog.editUsersVisible = true"></el-button>
            <el-button type="text" @click="dialog.editPasswordVisible = true">
              <i class="iconfont icon-yaochi-copy"
                 style="font-weight: bold;font-size:15px;"></i>
            </el-button>
            <el-button type="text" icon="delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-col :span="24" style="text-align: center;margin-top: 20px;">
      <el-pagination :current-page="currentPage"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalItems"
                     :page-sizes=[pageSize]
                     @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>

    <!--添加用户-->
    <el-dialog title="添加用户" v-model="dialog.addUsersVisible"
               :close-on-click-modal="false" @close="resetForm('addUsersForm')">
      <div class="modal">
        <br/><br/>
        <el-form id="addUsersform" :model="addUsersForm" ref="addUsersForm"
                 :rules="addUsersRules" label-width="67px">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="addUsersForm.name" name="name"></el-input>
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
          <el-button type="primary" @click="addUsers('addUsersForm')"
                     style="padding: 10px 30px;">添 加
          </el-button>
        </el-row>
      </div>
    </el-dialog>

    <!--修改用户资料-->
    <el-dialog title="修改资料" v-model="dialog.editUsersVisible"
               :close-on-click-modal="false" @close="resetForm('editUsersForm')">
      <div class="modal">
        <br/><br/>
        <el-form id="editUsersForm" :model="editUsersForm" ref="editUsersForm"
                 :rules="editUsersRules" label-width="70px">
          <el-form-item label="姓名："  class="label_left">
            <span>{{table.name}}</span>
          </el-form-item>

          <el-form-item label="权限：" prop="perms">
            <el-checkbox-group v-model="editUsersForm.perms" @change="permsCheckedChange">
              <el-checkbox name="bus_verify" label="icon-kaidianchenggong">
                <i class="iconfont icon-kaidianchenggong"></i> 商家审核
              </el-checkbox>
              <el-checkbox name="project_verify" label="icon-gendan">
                <i class="iconfont icon-gendan"></i> 项目审核
              </el-checkbox>
              <el-checkbox name="checkout_verify" label="icon-shiliangzhinengduixiang">
                <i class="iconfont icon-shiliangzhinengduixiang"></i> 结款审核
              </el-checkbox>
              <el-checkbox name="bus_apply" label="icon-audit" style="margin-left: 0;">
                <i class="iconfont icon-audit"></i> 商家申请
              </el-checkbox>
              <el-checkbox name="bus_register" label="icon-xiangmushu">
                <i class="iconfont icon-xiangmushu"></i> 商家注册
              </el-checkbox>
              <el-checkbox name="item_list" label="icon-xiangmu">
                <i class="iconfont icon-xiangmu"></i> 项目列表
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <br/>
        <el-row type="justify" align="center">
          <el-button type="primary" @click="editUsersInfo('editUsersForm')"
                     style="padding: 10px 30px;">修 改</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!--修改用户密码-->
    <el-dialog title="忘记密码" v-model="dialog.editPasswordVisible"
               :close-on-click-modal="false" @close="resetForm('editPasswordForm')">
      <div class="modal">
        <br/><br/>
        <el-form id="editPasswordForm" :model="editPasswordForm" ref="editPasswordForm"
                 :rules="editPasswordRules" label-width="96px">
          <el-form-item label="姓名：" class="label_left">
            <span>{{table.name}}</span>
          </el-form-item>

          <el-form-item label="账号：" class="label_left">
            <span>{{table.account}}</span>
          </el-form-item>

          <!--新密码-->
          <el-form-item label="新密码：" prop="newPwd">
            <el-input type="password" v-model="editPasswordForm.newPwd"
                      name="password"></el-input>
          </el-form-item>

          <!--确认密码-->
          <el-form-item label="确认密码：" prop="confirmPwd">
            <el-input type="password" v-model="editPasswordForm.confirmPwd"></el-input>
          </el-form-item>
        </el-form>
        <br/>
        <el-row type="justify" align="center">
          <el-button type="primary" @click="editUsersPassword('editPasswordForm')"
                     style="padding: 10px 30px;">修 改
          </el-button>
        </el-row>
      </div>
    </el-dialog>

    <!--成功提示-->
    <el-dialog v-model="dialog.tipsVisible" size="tiny"
               :close-on-click-modal="false" class="tipsModal">
      <div class="mainTips">
        <i class="el-icon-circle-check"></i>
        {{dialog.tips}}
        <p class="returnTips">自动返回系统中...</p>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import inputSearch from "../../components/search/input/index"
  import selectSearch from "../../components/search/select/index"
  import {ACCOUNTS_TABLE_URL, ACCOUNTS_ADD_URL, ACCOUNTS_EDITINFO_URL, ACCOUNTS_EDITPWD_URL} from "../../common/interface"
  import {isName, isAccount, isPassword} from "../../common/common"

  export default{
    data() {
      // 姓名验证
      var nameV = (rule, value, callback) => {
        var Name = isName(value)
        if (Name.flag) {
          callback()
        } else {
          callback(new Error(Name.error))
        }
      }
      // 账号验证
      var accountV = (rule, value, callback) => {
        var Account = isAccount(value)
        if (Account.flag) {
          callback()
        } else {
          callback(new Error(Account.error))
        }
      }
      // 密码验证
      var passwordV = (rule, value, callback) => {
        var Password = isPassword(value)
        if (value === "") {
          callback(new Error("请输入密码"))
        } else {
          if (Password.flag) {
            callback()
          } else {
            callback(new Error(Password.error))
          }
        }
      }
      // 确认密码
      var confirmPwdV = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"))
        } else if (value !== this.editPasswordForm.newPwd) {
          callback(new Error("两次输入密码不一致!"))
        } else {
          callback()
        }
      }
      return {
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        table: {
          id: "",
          name: "",
          account: "",
          perms: []
        },
        dialog: {
          addUsersVisible: false,      // 添加用户模态框
          editUsersVisible: false,     // 修改用户资料模态框
          editPasswordVisible: false,  // 修改用户密码
          tipsVisible: false,          // 操作提示
          tips: ""                     // 操作后提示信息
        },
        addUsersForm: {           // 添加用户
          name: "",
          account: "",
          password: "",
          perms: ["bus_verify"]
        },
        addUsersRules: {
          name: [
            { required: true, validator: nameV, trigger: "blur" }
          ],
          account: [
            { required: true, validator: accountV, trigger: "blur" }
          ],
          password: [
            { required: true, validator: passwordV, trigger: "blur" }
          ],
          perms: [
            { type: "array", required: true, max: 5, message: "请至少选择一个权限", trigger: "change" }
          ]
        },
        editUsersForm: {          // 修改用户资料
          perms: []
        },
        editUsersRules: {
          perms: [
            { type: "array", required: true, max: 5, message: "请至少选择一个权限", trigger: "change" }
          ]
        },
        editPasswordForm: {
          newPwd: ""
        },
        editPasswordRules: {
          newPwd: [
            {required: true, validator: passwordV, trigger: "blur"}
          ],
          confirmPwd: [
            {required: true, validator: confirmPwdV, trigger: "blur"}
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
            self.tableDatas = datas.slice((self.currentPage - 1) * self.pageSize, self.currentPage * self.pageSize)
            self.totalItems = parseInt(datas.length)
          }
        })
      },
      /* 获取行数据 */
      getRowDatas: function(row, event, column) {
        var self = this
        self.table.id = row.id
        self.table.name = row.name
        self.table.account = row.account
        self.table.perms = row.service
        self.editUsersForm.perms = row.service
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
//        console.log(value.length)
      },
      /* 添加用户 */
      addUsers: function(formName) {
        var self = this
        var form = document.getElementById("addUsersform")
        var formData = new FormData(form)
        var arr = ["bus_verify", "bus_verify", "project_verify", "checkout_verify",
          "bus_apply", "bus_register", "item_list"]

        for (let j = 0; j < arr.length; j++) {
          formData.set(arr[j], "0")
        }
        for (let i = 0; i < self.addUsersForm.perms.length; i++) {
          formData.set(self.addUsersForm.perms[i], "1")
        }

        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$http.post(ACCOUNTS_ADD_URL, formData)
              .then(function(response) {
                if (response.data.success) {
                  self.dialog.addUsersVisible = false
                  self.dialog.tips = "添加成功！"
                  self.dialog.tipsVisible = true
                  setTimeout(function() {
                    self.dialog.tipsVisible = false
                    self.getTables()
                  }, 2000)
                }
              })
          } else {
            return false
          }
        })
      },
      /* 修改用户资料 */
      editUsersInfo: function(formName) {
        var self = this
        var form = document.getElementById("editUsersForm")
        var formData = new FormData(form)
        var aa = []
        var arr = ["bus_verify", "bus_verify", "project_verify", "checkout_verify",
          "bus_apply", "bus_register", "item_list"]

        for (var p of formData.entries()) {
          aa.push(p[0])
        }
        for (let j = 0; j < arr.length; j++) {
          formData.set(arr[j], "0")
        }
        for (let i = 0; i < aa.length; i++) {
          formData.set(aa[i], "1")
        }
        formData.set("id", self.table.id)

//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }

        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$http.post(ACCOUNTS_EDITINFO_URL, formData)
              .then(function(response) {
                if (response.data.success) {
                  self.dialog.editUsersVisible = false
                  self.dialog.tips = "修改成功！"
                  self.dialog.tipsVisible = true
                  setTimeout(function() {
                    self.dialog.tipsVisible = false
                    self.getTables()
                  }, 2000)
                }
              })
          } else {
            return false
          }
        })
      },
      /* 修改用户密码 */
      editUsersPassword: function(formName) {
        var self = this
        var form = document.getElementById("editPasswordForm")
        var formData = new FormData(form)
        formData.set("id", self.table.id)

//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }

        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$http.post(ACCOUNTS_EDITPWD_URL, formData)
              .then(function(response) {
                if (response.data.success) {
                  self.dialog.editUsersVisible = false
                  self.dialog.tips = "修改成功！"
                  self.dialog.tipsVisible = true
                  setTimeout(function() {
                    self.dialog.tipsVisible = false
                    self.getTables()
                  }, 2000)
                }
              })
          } else {
            return false
          }
        })
      },
      /* 删除用户 */
      deleteUsers: function() {
        console.log(1)
      },
      // 清空添加用户表单
      resetForm: function(formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      inputSearch,
      selectSearch
    }
  }
</script>

<style scoped>
  table .iconfont {
    font-size: 22px;
    margin-right: 4px;
  }

  .tipsModal .el-dialog__body{
    padding-top: 0;
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
