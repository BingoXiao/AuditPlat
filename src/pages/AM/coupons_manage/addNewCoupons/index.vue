<template>
  <el-row>
    <el-col :span="24" style="padding-left: 30px;">
      <el-form :model="couponinfo" :rules="rules" ref="couponinfo"
               label-width="130px" label-position="left">
        <el-form-item label="类型：" required>
          <el-radio-group v-model="couponinfo.type" required>
            <el-radio label="DISCOUNT">优惠券</el-radio>
            <el-radio label="DATING">约会券</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="名称：" required prop="name">
          <el-col :span="7">
            <el-input v-model="couponinfo.name"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="优惠：" required>
          <el-col :span="1">
            <span>满</span>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="amount_full">
              <el-input v-model.number="couponinfo.amount_full"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&emsp;减 </span>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="amount_cut">
              <el-input v-model.number="couponinfo.amount_cut"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="发放时间：" required>
          <el-radio-group v-model="couponinfo.provideRadio" required
                          @change="errorTip('time', false)">
            <el-radio label="wholeHour">24小时</el-radio>
            <el-radio label="hours">
              <el-time-picker
                ref="time"
                :disabled="couponinfo.provideRadio==='wholeHour'"
                :editable="false"
                is-range
                v-model="couponinfo.provideTime"
                placeholder="选择时间范围"
                range-separator="~">
              </el-time-picker>
            </el-radio>
            <span class="error" v-if="couponinfo.timeError">请选择时间范围</span>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="有效日期：" required>
          <el-radio-group v-model="couponinfo.validRadio" required
                          @change="errorTip('date', false)">
            <el-radio label="today">当日</el-radio>
            <el-radio label="dates">
              <el-date-picker
                ref="date"
                :disabled="couponinfo.validRadio==='today'"
                :editable="false"
                v-model="couponinfo.validDates"
                type="daterange"
                placeholder="选择日期范围"
                :picker-options="pickerOptions"
                range-separator="~">
              </el-date-picker>
            </el-radio>
            <span class="error" v-if="couponinfo.dateError">请选择日期范围</span>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="门店：" required>
          <el-radio-group v-model="storeRadio" required>
            <el-radio label="wholeStores">全部门店</el-radio>
            <el-radio label="someStores">选择门店
              <el-button type="primary" icon="search" size="mini"
                         style="padding:2px 7px;" @click="search"></el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24" v-show="storeRadio === 'someStores'">
      <tab-badge-component :tabs="tabs" :which="which"
                           :number="number" :onBadge="onBadge"
                           v-on:toggle="tabChange"></tab-badge-component>
      <el-row style="margin-bottom:10px;">
        <el-col :span="5">
          <input-search :placeholder="placeholder"></input-search>
        </el-col>
      </el-row>

      <el-row>
        <!--已选门店表格-->
        <el-col :span="16" v-show="which === 'selectedStores'">
          <el-table ref="table" :data="selected.tableDatas" border style="width: 100%;"
                    highlight-current-row :row-key="selected.tableDatas.bus_id">
            <el-table-column label="选择" align="center" width="90px">
              <template scope="scope">
                <el-button type="danger" size="mini" icon="minus"
                           style="padding:2px;" @click="deleteStore(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="busname" label="门店名称" align="center" min-width="130px"></el-table-column>
            <el-table-column prop="account" label="门店账号" align="center" min-width="130px"></el-table-column>
          </el-table>

          <el-row class="pageination">
            <el-pagination :current-page="selected.currentPage"
                           :page-size="selected.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="selected.totalItems"
                           :page-sizes=[selected.pageSize]
                           @current-change="handleSelectedChange">
            </el-pagination>
          </el-row>
        </el-col>

        <!--门店搜索表格-->
        <el-col :span="16"  v-show="which !== 'selectedStores'">
          <el-table ref="table" :data="whole.tableDatas" border style="width: 100%;"
                    highlight-current-row :row-kry="whole.tableDatas.bus_id">
            <el-table-column label="选择" align="center" width="90px">
              <template scope="scope">
                <el-button type="primary" size="mini" icon="plus"
                           style="padding:2px;" @click="addStore(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="busname" label="门店名称" align="center" min-width="130px"></el-table-column>
            <el-table-column prop="account" label="门店账号" align="center" min-width="130px"></el-table-column>
          </el-table>

          <el-row class="pageination">
            <el-pagination :current-page="whole.currentPage"
                           :page-size="whole.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="whole.totalItems"
                           :page-sizes=[whole.pageSize]
                           @current-change="handleWholeChange">
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>

    </el-col>

    <el-col :span="24">
      <el-button type="primary" size="large" v-if="!urlID"
                 @click="addCoupon">新 增</el-button>
      <el-button type="primary" size="large" v-else
                 @click="addCoupon">修 改</el-button>
    </el-col>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </el-row>
</template>

<script>
  import tabBadgeComponent from "../../../../components/tabs/badge/index"
  import inputSearch from "../../../../components/search/input/index"
  import dialogTips from "../../../../components/dialogTips/index.vue"
  import {EVENTS_CMSEARCHSHOPS_URL, EVENTS_CMADDSHOPS_URL,
    EVENTS_CMEDIT_URL, EVENTS_CMGETINFO_URL} from "../../../../common/interface"
  import {getUrlParameters, modalHide} from "../../../../common/common"

  export default{
    data() {
      var numberValidate = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入满减金额"))
        } else {
          if (!Number.isInteger(value)) {
            callback(new Error("请输入数字值"))
          } else {
            callback()
          }
        }
      }
      return {
        pickerOptions: {
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit("pick", [start, end])
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit("pick", [start, end])
            }
          }]
        },
        urlID: "",       // url ID(按钮显示)
        isRight: true,       // 保存提示提示框
        tips: "",
        tipsVisible: false,
        couponinfo: {
          type: "DISCOUNT",     // 类型
          name: "",          // 名称
          amount_full: "",   // 优惠
          amount_cut: "",
          provideRadio: "wholeHour",  // 发放时间(wholeHour,hours)
          provideTime: [],             // provide_starttime,provide_endtime:
          timeError: false,
          validRadio: "today",     // 有效日期(today,dates)
          validDates: [],               // valid_startdate,valid_enddate
          dateError: false
        },
        rules: {
          name: [
            {required: true, message: "请输入优惠券名称", trigger: "blur"}
          ],
          amount_full: [
            {validator: numberValidate, trigger: "blur"}
          ],
          amount_cut: [
            {validator: numberValidate, trigger: "blur"}
          ]
        },
        storeRadio: "wholeStores",   // 门店（wholeStores,someStores）
        blist: [],            // 门店
        tabs: {
          "selectedStores": "已选门店",
          "storesSearch": "门店搜索"
        },
        number: 0,
        onBadge: "selectedStores",
        which: "selectedStores",
        placeholder: "请输入门店名称",
        selected: {         // 已选门店
          idArr: [],                // 门店id数组
          totalDatas: [],           // 表格总数据
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        },
        whole: {         // 已选门店
          tableDatas: [],           // 表格每页显示数据
          totalItems: 0,            // 总条目数
          pageSize: 10,             // 每页显示条目个数
          currentPage: 1            // 当前页
        }
      }
    },
    mounted() {
      var self = this
      var id = getUrlParameters(window.location.hash, "id")
      if (id) {  // 修改（获取优惠券信息）
        self.urlID = id
        self.getCouponInfo(id)
      } else {
        self.urlID = ""
      }
      self.getWholeTables()
    },
    methods: {
      // 错误提示
      errorTip: function(name, flag) {
        var err = name + "Error"
        var item = this.$refs[name].$el.children[1]
        if (flag) {
          this.couponinfo[err] = true
          item.style.borderColor = "#ff4949"
        } else {
          this.couponinfo[err] = false
          item.style.borderColor = "rgb(191, 203, 217)"
        }
      },
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        var self = this
        self.which = name
        if (name === "selectedStores") {
          self.getSelectedTables()
        }
      },
      // 获取优惠券信息（修改）
      getCouponInfo: function(id) {
        function getHours(time) {   // 设置返回时间
          var arr = time.split(":")
          var res = new Date()
          res.setHours(arr[0])
          res.setMinutes(arr[1])
          res.setSeconds(arr[2])
          return res
        }
        var self = this
        self.$http.get(EVENTS_CMGETINFO_URL(id)).then(function(response) {
          if (response.body.success) {
            var couponinfo = response.body.content.couponinfo
            var blist = response.body.content.blist
            if (blist.length > 0) {
              self.storeRadio = "someStores"
              for (let i = 0; i < blist.length; i++) {
                self.selected.idArr.push(blist[i].bus_id)
              }
              self.selected.totalDatas = blist    // 指定门店
              self.number = blist.length
              self.getSelectedTables()
            }
            self.couponinfo.type = couponinfo.type   // 类型
            self.couponinfo.name = couponinfo.name   // 名称
            self.couponinfo.amount_full = couponinfo.amount_full   // 满减
            self.couponinfo.amount_cut = couponinfo.amount_cut     // 满减
            if (!couponinfo.provide_starttime) {     // 发放时间
              self.couponinfo.provideRadio = "wholeHour"
            } else {
              self.couponinfo.provideRadio = "hours"
              self.couponinfo.provideTime = [getHours(couponinfo.provide_starttime), getHours(couponinfo.provide_endtime)]
            }
            if (!couponinfo.valid_startdate) {  // 有效日期
              self.couponinfo.validRadio = "today"
            } else {
              self.couponinfo.validRadio = "dates"
              self.couponinfo.validDates = [new Date(couponinfo.valid_startdate), new Date(couponinfo.valid_enddate)]
            }
          }
        })
      },
      /* 获取已选门店（表格） */
      getSelectedTables: function() {
        var self = this
        var datas = self.selected.totalDatas
        self.selected.tableDatas = datas.slice((self.selected.currentPage - 1) *
          self.selected.pageSize, self.selected.currentPage * self.selected.pageSize)
        self.selected.totalItems = parseInt(datas.length)
      },
      /* 获取门店搜索（表格） */
      getWholeTables: function() {
        var self = this
        self.$http.get(EVENTS_CMSEARCHSHOPS_URL).then(function(response) {
          if (response.body.success) {
            var datas = response.body.content.buses
            self.whole.tableDatas = datas.slice((self.whole.currentPage - 1) *
              self.whole.pageSize, self.whole.currentPage * self.whole.pageSize)
            self.whole.totalItems = parseInt(datas.length)
          }
        })
      },
      // 选择门店（搜索按钮）
      search: function() {
        var self = this
        self.storeRadio = "someStores"
        self.which = "storesSearch"
      },
      // 添加门店
      addStore: function(row) {
        var self = this
        var arr = self.selected.idArr
        if (arr.length < 1) {
          self.selected.idArr.push(row.bus_id)
          self.selected.totalDatas.push(row)
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === row.bus_id) {
              break
            } else {
              if (i === arr.length - 1) {
                self.selected.idArr.push(row.bus_id)
                self.selected.totalDatas.push(row)
              }
            }
          }
        }
        self.number = self.selected.totalDatas.length
      },
      // 删除门店
      deleteStore: function(row) {
        var self = this
        var arr = self.selected.idArr
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === row.bus_id) {
            self.selected.idArr.splice(i, 1)
            self.selected.totalDatas.splice(i, 1)
            self.number = self.selected.totalDatas.length
            break
          }
        }
        for (let i = 0; i < self.selected.tableDatas.length; i++) {
          if (self.selected.tableDatas[i].bus_id === row.bus_id) {
            self.selected.tableDatas.splice(i, 1)
          }
        }
        if (self.number % 10 === 0) {    // 删除到一页的最后一条，返回上一页
          self.currentPage = self.currentPage - 1
          self.handleSelectedChange()
        }
      },
      // 新增优惠券
      addCoupon: function() {
        var self = this
        var datas = {
          "type": self.couponinfo.type,  // 类型
          "name": self.couponinfo.name,       // 名称
          "amount_full": self.couponinfo.amount_full,   // 优惠
          "amount_cut": self.couponinfo.amount_cut,
          "provide_starttime": "",
          "provide_endtime": "",
          "valid_startdate": "",
          "valid_enddate": "",
          "bus_ids": []
        }
        if (self.couponinfo.provideRadio === "wholeHour") {   // 发放时间
          self.errorTip("time", false)
        } else {
          if (self.couponinfo.provideTime[0] === "") {
            self.errorTip("time", true)
          } else {
            self.errorTip("time", false)
            let timeFrom = new Date(self.couponinfo.provideTime[0])
            let timeTo = new Date(self.couponinfo.provideTime[1])
            datas.provide_starttime = timeFrom.getHours() + ":" + timeFrom.getMinutes() + ":" + timeFrom.getSeconds()
            datas.provide_endtime = timeTo.getHours() + ":" + timeTo.getMinutes() + ":" + timeTo.getSeconds()
          }
        }
        if (self.couponinfo.validRadio === "today") {   // 有效日期
          self.errorTip("date", false)
        } else {
          if (self.couponinfo.validDates[0] === "") {
            self.errorTip("date", true)
          } else {
            self.errorTip("date", false)
            let dateFrom = new Date(self.couponinfo.validDates[0])
            let dateTo = new Date(self.couponinfo.validDates[1])
            datas.valid_startdate = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate()
            datas.valid_enddate = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate()
          }
        }
        if (self.storeRadio === "someStores") {  // 已选门店
          datas.bus_ids = self.selected.idArr
        }
        self.$refs.couponinfo.validate((valid) => {
          if (valid && !self.couponinfo.timeError && !self.couponinfo.dateError) {
            var id = getUrlParameters(window.location.hash, "id")
            var url = EVENTS_CMEDIT_URL(id)   // 修改
            self.tips = "修改优惠券成功！"
            if (!id) {   // 新增
              self.tips = "新增优惠券成功！"
              url = EVENTS_CMADDSHOPS_URL
            }
            self.$http.post(url, JSON.stringify(datas), {emulateJSON: true})
              .then(function(response) {
                if (response.body.success) {
                  self.tipsVisible = true
                  modalHide(function() {
                    self.tipsVisible = false
                    self.$router.push({path: "/coupons_manage/my_coupons"})
                  })
                }
              })
          } else {
            return false
          }
        })
      },
      /* 改变当前页 */
      handleSelectedChange(currentPage) {
        this.selected.currentPage = currentPage
        this.getSelectedTables()
      },
      /* 改变当前页 */
      handleWholeChange(currentPage) {
        this.whole.currentPage = currentPage
        this.getWholeTables()
      }
    },
    components: {
      tabBadgeComponent,
      inputSearch,
      dialogTips
    }
  }
</script>
