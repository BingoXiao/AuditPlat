<template>
  <el-row>
    <!--筛选栏-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" label-width="85px">
        <el-form-item label="用户账号：">
          <input-search ref="account" name="account"
                        v-on:getRules="getFilterRules"></input-search>
        </el-form-item>

        <el-form-item label="状态：" class="select">
          <select-search ref="state" name="status"
                         :options="search.state"
                         v-on:getRules="getFilterRules"></select-search>
        </el-form-item>

        <el-form-item label="" label-width="10px">
          <el-button type="primary" size="small" icon="search"
                     @click="filterTable">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--按钮-->
    <el-col :span="24">
      <el-col :span="19">
        <el-button-group>
          <el-button type="primary" @click="freezeUsers(table.multiple, 'multiple', '1')">启 用</el-button>
          <el-button type="primary" @click="freezeUsers(table.multiple, 'multiple', '0')">冻 结</el-button>
          <el-button type="primary" @click="deleteUsers(table.multiple, 'multiple')">删 除</el-button>
        </el-button-group>
      </el-col>

      <el-col :span="5" style="text-align: right">
        <el-button type="primary" @click="dialog.addUsersVisible = true">添加用户</el-button>
      </el-col>
    </el-col>

    <!--表格-->
    <el-col :span="24">
      <br/>
      <el-table ref="table" border highlight-current-row v-loading.body="loading"
                :data="tableDatas" row-key="id" style="width: 100%"
                @selection-change="selectUsers">
        <el-table-column type="selection" min-width="130px"
                         :reserve-selection="true"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"  min-width="130px"></el-table-column>
        <el-table-column prop="account" label="用户账号" align="center" min-width="100px"></el-table-column>
        <el-table-column label="已开通服务" align="center" min-width="150px">
          <template scope="scope">
            <span v-for="item in scope.row.service">
              <i class="iconfont" :class="item"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="is_active" label="状态" align="center" min-width="120px">
          <template scope="scope">
            <el-switch v-model="scope.row.is_active"
                       on-color="#020202"
                       off-color="#C0CCDA"
                       @change="freezeUsers(scope.row, 'single')"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template scope="scope">
            <el-row>
              <el-col :span="4" :offset="6">
                <el-tooltip content="修改资料" effect="dark" placement="bottom">
                  <el-button type="text" icon="edit"
                             @click="editUsersVisible(scope.row)"></el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-tooltip content="修改密码" effect="dark" placement="bottom">
                  <el-button type="text" @click="editPasswordVisible(scope.row)">
                    <i class="iconfont icon-yaochi-copy"
                       style="font-weight: bold;font-size:15px;"></i>
                  </el-button>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-tooltip content="删除" effect="dark" placement="bottom">
                  <el-button type="text" icon="delete2" @click="deleteUsers(scope.row, 'single')"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
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
            <el-checkbox-group v-model="addUsersForm.perms">
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
            <el-checkbox-group v-model="editUsersForm.perms">
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
    <el-dialog title="忘记密码" size="tiny" v-model="dialog.editPasswordVisible"
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

    <!--提示-->
    <dialogTips :isRight="dialog.isRight" :tips="dialog.tips" :tipsVisible="dialog.tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import alasql from "alasql"
  import inputSearch from "../../components/search/input/index"
  import selectSearch from "../../components/search/select/index"
  import dialogTips from "../../components/dialogTips/index.vue"
  import {ACCOUNTS_TABLE_URL, ACCOUNTS_ADD_URL, ACCOUNTS_EDITINFO_URL,
    ACCOUNTS_EDITPWD_URL, ACCOUNTS_DELETE_URL, ACCOUNTS_FROZEN_URL} from "../../common/interface"
  import {isName, isAccount, isPassword, modalHide} from "../../common/common"

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
        loading: false,
        search: {          // 搜索栏
          account: "",       // 用户账号
          status: "",        // 状态
          state: [
            {
              value: false,
              label: "冻结"
            }, {
              value: true,
              label: "启用"
            }
          ]
        },
        totalDatas: [],           // 表格总数据
        tableDatas: [],           // 表格每页显示数据
        totalItems: 0,            // 总条目数
        pageSize: 10,             // 每页显示条目个数
        currentPage: 1,           // 当前页
        table: {                  // 记录表格行数据
          single: {},       // 单项（表格内）:包含id和冻结状态is_active
          multiple: [],     // 多项（按钮操作）
          name: "",         // 用户姓名
          account: "",      // 用户账号
          perms: []         // 用户权限
        },
        dialog: {                          // 模态框标志
          addUsersVisible: false,          // 添加用户
          editUsersVisible: false,         // 修改用户资料
          editPasswordVisible: false,      // 修改用户密码
          isRight: true,
          tips: "",
          tipsVisible: false
        },
        addUsersForm: {           // 添加用户
          name: "",
          account: "",
          password: "",
          perms: []
        },
        addUsersRules: {     // 添加用户验证
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
        editUsersForm: {    // 修改用户资料
          perms: []
        },
        editUsersRules: {      // 修改用户验证
          perms: [
            { type: "array", required: true, max: 5, message: "请至少选择一个权限", trigger: "change" }
          ]
        },
        editPasswordForm: {    // 修改用户密码
          newPwd: ""
        },
        editPasswordRules: {     // 修改用户密码验证
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
      var self = this
      self.getTables(function(datas) {
        self.fillTable(datas)
      })
    },
    methods: {
      /* 获取用户数据（表格） */
      getTables: function(func) {
        var self = this
        self.loading = true
        self.$http.get(ACCOUNTS_TABLE_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content
            func(datas)
          }
        })
      },
      /* 填充表格 */
      fillTable: function(datas) {
        var self = this
        self.totalDatas = datas
        for (var i = 0; i < datas.length; i++) {
          var item = datas[i]
          var service = []
          /* 已开通服务 */
          if (item.bus_verify) {   // 商家审核权限
            service.push("icon-kaidianchenggong")
          }
          if (item.project_verify) {  // 项目审核权限
            service.push("icon-gendan")
          }
          if (item.checkout_verify) {  // 结款审核权限
            service.push("icon-shiliangzhinengduixiang")
          }
          if (item.bus_apply) {  // 商家申请权限
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
        if (self.search.status !== "") {
          rules += "and is_active = ?"
        }
        self.getTables(function(datas) {
          var res = alasql(rules, [datas, self.search.status])
          self.totalDatas = res
          self.currentPage = 1
          self.fillTable(res)
        })
      },

      /* 翻页 */
      handleCurrentChange(currentPage) {
        var self = this
        self.currentPage = currentPage
        self.fillTable(self.totalDatas)
      },

      /* 表格内勾选用户 */
      selectUsers: function(selection) {
        var self = this
        var arr = []
        if (selection.length > 0) {
          for (var i = 0; i < selection.length; i++) {
            let obj = {
              "id": selection[i].id,
              "is_active": selection[i].is_active         // true表示启用，false为冻结
            }
            arr.push(obj)
          }
          self.table.multiple = arr
          self.table.single = {
            "id": selection[selection.length - 1].id,
            "is_active": selection[selection.length - 1].is_active
          }
        } else {
          self.table.multiple = []
          self.table.single = []
        }
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
            self.$http.post(ACCOUNTS_ADD_URL, formData).then(function(response) {
              if (response.body.success) {
                self.dialog.addUsersVisible = false
                self.dialog.isRight = true
                self.dialog.tips = "添加成功！"
                self.dialog.tipsVisible = true
                modalHide(function() {
                  self.dialog.tipsVisible = false
                  self.getTables(function(datas) {
                    self.fillTable(datas)
                    self.rulesReset()
                  })
                })
              }
            })
          } else {
            return false
          }
        })
      },

      /* 修改用户资料 */
      editUsersVisible: function(row) {
        var self = this
        self.dialog.editUsersVisible = true
        self.table.single = {
          "id": row.id,
          "is_active": row.is_active
        }
        self.table.account = row.account
        self.table.name = row.name
        self.table.perms = row.service
        self.editUsersForm.perms = row.service
      },
      editUsersInfo: function(formName) {
        var self = this
        var form = document.getElementById("editUsersForm")
        var formData = new FormData(form)
        var aa = []
        var arr = ["bus_verify", "bus_verify", "project_verify", "checkout_verify",
          "bus_apply", "bus_register", "item_list"]
        for (let p of formData.entries()) {
          aa.push(p[0])
        }
        for (let j = 0; j < arr.length; j++) {
          formData.set(arr[j], "0")
        }
        for (let i = 0; i < aa.length; i++) {
          formData.set(aa[i], "1")
        }
        formData.set("id", self.table.single.id)
//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$http.post(ACCOUNTS_EDITINFO_URL, formData).then(function(response) {
              if (response.body.success) {
                self.dialog.editUsersVisible = false
                self.dialog.isRight = true
                self.dialog.tips = "修改成功！"
                self.dialog.tipsVisible = true
                modalHide(function() {
                  self.dialog.tipsVisible = false
                  var bb = {}
                  for (let i = 0; i < aa.length; i++) {
                    bb[aa[i]] = 1
                  }
                  for (let i = 0; i < self.tableDatas.length; i++) {
                    var item = self.tableDatas[i]
                    if (self.table.single.id === item.id) {   // 修改权限
                      let ser = []
                      for (let j = 0; j < arr.length; j++) {
                        delete item[arr[j]]
                      }
                      if (bb.bus_verify) {   // 商家审核权限
                        item.bus_verify = 1
                      }
                      if (bb.project_verify) { // 项目审核权限
                        item.project_verify = 1
                      }
                      if (bb.checkout_verify) {  // 结款审核权限
                        item.checkout_verify = 1
                      }
                      if (bb.bus_apply) { // 商家申请权限
                        item.bus_apply = 1
                      }
                      if (bb.bus_register) {  // 商家注册权限
                        item.bus_apply = 1
                      }
                      if (bb.item_list) {  // 项目注册权限
                        item.item_list = 1
                      }
                      item.service = ser
                      break
                    }
                  }
                  self.fillTable(self.tableDatas)
                })
              }
            })
          } else {
            return false
          }
        })
      },

      /* 修改用户密码 */
      editPasswordVisible: function(row) {
        var self = this
        self.dialog.editPasswordVisible = true
        self.table.single.id = row.id
        self.table.name = row.name
        self.table.account = row.account
      },
      editUsersPassword: function(formName) {
        var self = this
        var form = document.getElementById("editPasswordForm")
        var formData = new FormData(form)
        formData.set("id", self.table.single.id)
//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$http.post(ACCOUNTS_EDITPWD_URL, formData).then(function(response) {
              if (response.body.success) {
                self.dialog.editPasswordVisible = false
                self.dialog.isRight = true
                self.dialog.tips = "修改成功！"
                self.dialog.tipsVisible = true
                modalHide(function() {
                  self.dialog.tipsVisible = false
                })
              }
            })
          } else {
            return false
          }
        })
      },

      /* 冻结用户 */
      freezeUsers: function(row, type, flag) {
        // row 表示当前选中项(按钮操作数组table.multiple，表格内部操作对象table.single)
        // type 表示为按钮操作（multiple）还是表格内部操作（single）
        // flag 表示冻结（0）还是启用(1)
        var self = this
        var formData = new FormData()
        if (row.length > 0 || row.id) {      // 有选中项
          if (type === "multiple") {    // 按钮操作
            let arr = []
            for (let i = 0; i < row.length; i++) {
              arr.push(row[i].id)
              formData.append("ids[]", row[i].id)
            }
            formData.set("flag", flag)
          } else {    // 表格操作
            formData.append("ids[]", row.id)
            formData.append("flag", row.is_active ? 1 : 0)
          }
        } else {  // 无选中账户，操作提示错误
          self.dialog.isRight = false
          self.dialog.tips = "请选择需要（冻结/启用）的账户！"
          self.dialog.tipsVisible = true
          modalHide(function() {
            self.dialog.tipsVisible = false
          })
          return false
        }
//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }
        self.$http.post(ACCOUNTS_FROZEN_URL, formData).then(function(response) {
          if (response.body.success) {  // 操作成功
            if (type === "multiple") {     // 按钮操作改变冻结状态
              for (let i = 0; i < row.length; i++) {
                for (let j = 0; j < self.tableDatas.length; j++) {
                  if (self.tableDatas[j].id === row[i].id) {
                    self.tableDatas[j].is_active = (flag === "1")
                    continue
                  }
                }
              }
            } else {   // 表格操作(操作成功后改变选中组中对应状态)
              for (let i = 0; i < self.table.multiple.length; i++) {
                if (self.table.multiple[i].id === row.id) {
                  self.table.multiple[i].is_active = (flag === "1")
                  break
                }
              }
            }
          } else {   // 冻结/启用不成功（表格内部操作，返回之前状态）
            if (row.id) {
              row.is_active = !row.is_active
            }
          }
        })
      },

      /* 删除用户 */
      deleteUsers: function(row, type) {
        // row 表示当前选中项(按钮操作数组table.multiple，表格内部操作对象table.single)
        // type 表示为按钮操作（multiple）还是表格内部操作（single）
        var self = this
        var formData = new FormData()
        if (row.length > 0 || row.id) {   // 有选中项
          if (type === "single") {   // 表格内部
            if (row.is_active) {
              self.dialog.isRight = false
              self.dialog.tips = "请先冻结账户！"
              self.dialog.tipsVisible = true
              modalHide(function() {
                self.dialog.tipsVisible = false
              })
              return false
            } else {
              for (let i = 0; i < self.table.multiple.length; i++) {   // 去掉table.multiple中删除项
                if (self.table.multiple[i].id === row.id) {
                  self.table.multiple.splice(i, 1)
                }
              }
              self.table.single = []
              formData.append("ids[]", row.id)
            }
          } else {   // 按钮操作
            let arr = []
            for (let i = 0; i < row.length; i++) {
              if (row[i].is_active) {   // 有启用状态
                self.dialog.isRight = false
                self.dialog.tips = "请先冻结账户！"
                self.dialog.tipsVisible = true
                modalHide(function() {
                  self.dialog.tipsVisible = false
                })
                return false
              }
            }
            for (let i = 0; i < row.length; i++) {
              arr.push(row[i].id)
              formData.append("ids[]", row[i].id)
            }
          }
        }
//        for (var pair of formData.entries()) {
//          console.log(pair[0] + ", " + pair[1])
//        }
        self.$http.post(ACCOUNTS_DELETE_URL, formData).then(function(response) {
          if (response.body.success) {
            self.dialog.editUsersVisible = false
            self.dialog.isRight = true
            self.dialog.tips = "删除成功！"
            self.dialog.tipsVisible = true
            modalHide(function() {
              self.dialog.tipsVisible = false
              self.getTables(function(datas) {
                self.fillTable(datas)
                self.rulesReset()
              })
            })
          }
        })
      },

      /* 清空筛选 */
      rulesReset: function() {
        var self = this
        self.currentPage = 1
        self.$refs.account.reset()
        self.$refs.state.reset()
      },

      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      inputSearch,
      selectSearch,
      dialogTips
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
