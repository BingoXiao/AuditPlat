<template>
  <div>
    <el-form ref="basicForm" label-width="100px">
            <h3 class="formTitle">门店信息</h3>
            <el-row>
              <el-col :span="21">
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
              <el-col :span="21">
                <el-row class="myTable">
                  <el-col :span="24" v-for="obj in data.foods" class="dishes">
                    <el-row class="tableHead">
                      <div class="headContent">
                        <span>{{obj.name}}&emsp;</span>
                        <span v-if="obj.choose" class="avilable">{{obj.choose}}</span>
                        <span v-if="obj.choose !== '全部可用' && obj.can_repeat"> (可重复选) </span>
                      </div>
                    </el-row>
                    <el-row v-for="item in obj.items" class="tableContent">
                      <el-col :span="8">{{item.name}}</el-col>
                      <el-col :span="8" style="text-align: center">￥ {{item.price}} / {{item.unit_name}}</el-col>
                      <el-col :span="8" style="text-align: right">{{item.count}}</el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-form-item>

            <el-row>
              <el-col :span="6">
                <el-form-item label="原价：" label-width="70px">
                  <span class="info">{{data.total}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优惠价：">
                  <span class="info">{{data.price}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结算价：">
                  <span class="info">{{data.jm_price}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <h3 class="formTitle">购买须知</h3>
            <el-form-item label="项目有效期" style="margin-bottom: 0"></el-form-item>
            <el-form-item label-width="18px">
              <el-col :span="21">
                <table class="myTable">
                  <tbody>
                  <tr>
                    <td>
                      <strong class="text-stress">* </strong>团购券有效期
                    </td>
                    <td style="padding-bottom: 0">
                      <el-row>
                        <radio-check :selected="data.rules.expire_date.index===0">
                          <span>自上线之日起
                            <span class="showbox">
                               <span v-if="data.rules.expire_date.info_0">
                              {{data.rules.expire_date.info_0.number}}
                              </span>
                            </span>个月
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.expire_date.index===1">
                          <span>自上线之日起
                            <span class="showbox">
                              <span v-if="data.rules.expire_date.info_1">
                                {{data.rules.expire_date.info_1.number}}
                              </span>
                            </span>天
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.expire_date.index===2">
                          <span>自上线之日起至
                            <span class="showbox">
                              <span v-if="data.rules.expire_date.info_2">
                                {{data.rules.expire_date.info_2.end_date}}
                              </span>
                            </span>23:59:59
                          </span>
                        </radio-check>
                        <br/>
                        <small> 团购券有效期是指可接待团购用户的有效期</small>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="2">
                      <strong class="text-stress">* </strong>不可用日期
                    </td>
                    <td>
                      <el-col :span="6">
                        <radio-check :selected="data.rules.exclude_use_date.index===0">
                          <span>所有日期都可用</span>
                        </radio-check>
                      </el-col>

                      <el-col :span="8">
                        <radio-check :selected="data.rules.exclude_use_date.index===1">
                          <span>部分日期可用</span>
                        </radio-check>
                      </el-col>

                      <el-col :span="24" class="myTable" v-if="data.rules.exclude_use_date.index===1"
                              style="padding:5px 20px;margin-top:20px">
                        <span style="font-size:14px;">指定每周不可用时间：</span>
                        <el-row>
                          <el-checkbox-group v-model="data.rules.exclude_use_date.info_1.week">
                            <el-checkbox label="0" disabled>周一</el-checkbox>
                            <el-checkbox label="1" disabled>周二</el-checkbox>
                            <el-checkbox label="2" disabled>周三</el-checkbox>
                            <el-checkbox label="3" disabled>周四</el-checkbox>
                            <el-checkbox label="4" disabled>周五</el-checkbox>
                            <el-checkbox label="5" disabled>周六</el-checkbox>
                            <el-checkbox label="6" disabled>周日</el-checkbox>
                          </el-checkbox-group>
                        </el-row>
                        <el-row v-for="item in data.rules.exclude_use_date.info_1.dates">
                          <span class="showbox">{{item.begin}} </span>
                          至<span class="showbox">{{item.end}}</span>
                          <span v-if="item.festival">( {{item.festival}} )</span>
                        </el-row>
                      </el-col>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="3">
                      <strong class="text-stress">* </strong>
                      是否支持自动延长团购券有效期
                    </td>
                    <td>
                      <el-col :span="8">
                        <radio-check :selected="data.rules.expire_date_auto_extend.index===0">
                          <span>是，默认每次延期30天</span>
                        </radio-check>
                      </el-col>
                      <el-col :span="8">
                        <radio-check :selected="data.rules.expire_date_auto_extend.index===1">
                          <span>否，不支持</span>
                        </radio-check>
                      </el-col>
                      <br/>
                      <small>
                        提示：当您选择“是”的时候，系统将默认每30天自动延期；如选择“否”则该项目不会自动延期，如要延期只能手动延期
                      </small>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-col>
            </el-form-item>

            <el-form-item label="消费时间" label-width="85px" style="margin-bottom: 0"></el-form-item>
            <el-form-item label-width="18px">
              <el-col :span="21">
                <table class="myTable">
                  <tbody>
                  <tr>
                    <td class="text-center" tabindex="4">
                      <strong class="text-stress">*</strong>使用时间
                    </td>
                    <td>
                      <el-col :span="5">
                        <radio-check :selected="data.rules.use_time.index===0">
                          <span>24小时</span>
                        </radio-check>
                      </el-col>
                      <el-col :span="8">
                        <radio-check :selected="data.rules.use_time.index===1">
                          <span>部分时间可使用</span>
                        </radio-check>
                      </el-col>
                      <el-col :span="24" class="myTable" v-if="data.rules.use_time.index===1"
                              style="padding:5px 20px;margin-top:20px">
                        <div>
                          <span style="font-size:14px;">指定可用时间：</span>
                          <el-row v-for="item in data.rules.use_time.info_1.dates">
                            <span class="showbox">{{item.begin_hour}} 点 {{item.begin_minute}}</span>
                            至<span class="showbox">{{item.end_hour}} 点 {{item.end_minute}}</span>
                          </el-row>
                        </div>
                        <div>
                          <span style="font-size:14px;">特殊情况说明：</span>
                          <el-row>
                            <span v-if="data.rules.use_time.note">( {{data.rules.use_time.note}} )</span>
                          </el-row>
                        </div>
                      </el-col>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="5">
                      <strong class="text-stress">*</strong> 是否预约
                    </td>
                    <td>
                      <el-row>
                        <radio-check :selected="data.rules.reservation.index===0">
                          <span>无需预约，消费高峰时可能需要等位</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.reservation.index===1">
                          <span>提前
                            <span class="showbox">
                               <span v-if="data.rules.reservation.info_1">
                                 {{data.rules.reservation.info_1.day}}
                                </span>
                            </span>天
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.reservation.index===2">
                          <span>提前
                            <span class="showbox">
                               <span v-if="data.rules.reservation.info_2">
                                 {{data.rules.expire_date.info_2.hour}}
                                </span>
                            </span>天
                          </span>
                        </radio-check>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="6">
                      <strong class="text-stress">*</strong> 推荐用餐类型
                      <br>
                      (多选)
                    </td>
                    <td id="recommend_use_date">
                      <el-checkbox-group v-model="data.rules.recommend_use_date.indexs">
                        <el-checkbox :label="0" disabled>早餐</el-checkbox>
                        <el-checkbox :label="1" disabled>午餐</el-checkbox>
                        <el-checkbox :label="2" disabled>晚餐</el-checkbox>
                        <el-checkbox :label="3" disabled>下午茶</el-checkbox>
                        <el-checkbox :label="4" disabled>夜宵</el-checkbox>
                      </el-checkbox-group>
                      <small>
                        提示：该字段用来推荐消费者用餐类型，方便消费者快速筛选。不用来限制消费者使用时间。
                      </small>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-col>
            </el-form-item>

            <el-form-item label="团购约定" label-width="85px" style="margin-bottom: 0"></el-form-item>
            <el-form-item label-width="18px">
              <el-col :span="21">
                <table class="myTable">
                  <tbody>
                  <tr>
                    <td class="text-center" tabindex="7">
                      <strong class="text-stress">*</strong> 是否限购团购券
                    </td>
                    <td>
                      <el-col :span="4">
                        <radio-check :selected="data.rules.buy_limit_number.index===0">
                          <span>不限</span>
                        </radio-check>
                      </el-col>
                      <el-col :span="18">
                        <radio-check :selected="data.rules.buy_limit_number.index===1">
                          <span>是，每人限购
                            <span class="showbox">
                               <span v-if="data.rules.buy_limit_number.info_1">
                                 {{data.rules.buy_limit_number.info_1.number}}
                                </span>
                            </span>张
                          </span>
                        </radio-check>
                      </el-col>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="8">
                      <strong class="text-stress">*</strong> 是否限用团购券
                    </td>
                    <td>
                      <el-row>
                        <radio-check :selected="data.rules.use_limit.index===0">
                          <span>不限</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.use_limit.index===1">
                          <span>是，每人限用
                            <span class="showbox">
                               <span v-if="data.rules.use_limit.info_1">
                                 {{data.rules.use_limit.info_1.number}}
                                </span>
                            </span>张
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.use_limit.index===2">
                          <span>是，每桌限用
                            <span class="showbox">
                               <span v-if="data.rules.use_limit.info_2">
                                 {{data.rules.use_limit.info_2.number}}
                                </span>
                            </span>张
                          </span>
                        </radio-check>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="9">
                      <strong class="text-stress">*</strong> 是否限制使用人数
                    </td>
                    <td class="td_indent">
                      <el-row>
                        <radio-check :selected="data.rules.use_limit_people_number.index===0">
                          <span>不限</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.use_limit_people_number.index===1">
                          <span>是，每张限
                            <span class="showbox">
                               <span v-if="data.rules.use_limit_people_number.info_1">
                                 {{data.rules.use_limit_people_number.info_1.people}}
                                </span>
                            </span>人使用，身高
                             <span class="showbox">
                               <span v-if="data.rules.use_limit_people_number.info_1">
                                 {{data.rules.use_limit_people_number.info_1.height}}
                                </span>
                            </span>米以上儿童计入人数
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.use_limit_people_number.index===2">
                          <span>是，每张限
                            <span class="showbox">
                               <span v-if="data.rules.use_limit_people_number.info_2">
                                 {{data.rules.use_limit_people_number.info_2.people}}
                                </span>
                            </span>人使用，不论是否儿童均计入人数
                          </span>
                        </radio-check>
                      </el-row>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-col>
            </el-form-item>

            <el-form-item label="品类特有约定" label-width="110px" style="margin-bottom: 0"></el-form-item>
            <el-form-item label-width="18px">
              <el-col :span="21">
                <table class="myTable">
                  <tbody>
                  <tr>
                    <td class="text-center" tabindex="10">
                      <strong class="text-stress">*</strong> 是否可以免费打包
                    </td>
                    <td class="td_indent">
                      <el-row>
                        <radio-check :selected="data.rules.packing_info.index===0">
                          <span>是，免费打包</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.packing_info.index===1">
                          <span>否，需支付打包费
                            <span class="showbox">
                               <span v-if="data.rules.packing_info.info_1">
                                 {{data.rules.packing_info.info_1.price}}
                                </span>
                            </span>元/盒
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.packing_info.index===2">
                          <span>否，需支付打包费
                            <span class="showbox">
                               <span v-if="data.rules.packing_info.info_2">
                                 {{data.rules.packing_info.info_2.price}}
                                </span>
                            </span>元/袋
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.packing_info.index===3">
                          <span>打包带免费，打包盒收费标准为
                            <span class="showbox">
                               <span v-if="data.rules.packing_info.info_3">
                                 {{data.rules.packing_info.info_3.price}}
                                </span>
                            </span>元/盒
                          </span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.packing_info.index===4">
                          <span>可以打包，打包费详情咨询商家</span>
                        </radio-check>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center" tabindex="11">
                      <strong class="text-stress">*</strong> 堂食外带约定
                    </td>
                    <td>
                      <el-row>
                        <radio-check :selected="data.rules.packing_limit.index===0">
                          <span>堂食外带均可</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.packing_limit.index===1">
                          <span>仅限堂食，不提供外带</span>
                        </radio-check>
                      </el-row>
                    </td>
                  </tr>

                  <tr>
                    <td class="text-center" tabindex="12">
                      <strong class="text-stress">*</strong> 餐巾纸
                    </td>
                    <td>
                      <el-row>
                        <radio-check :selected="data.rules.serviette_info.index===0">
                          <span>免费</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.serviette_info.index===1">
                          <span>不提供</span>
                        </radio-check>
                      </el-row>
                      <el-row>
                        <radio-check :selected="data.rules.serviette_info.index===2">
                          <span>
                            <span class="showbox">
                               <span v-if="data.rules.serviette_info.info_2">
                                 {{data.rules.serviette_info.info_2.price}}
                                </span>
                            </span>元/份
                          </span>
                        </radio-check>
                      </el-row>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-col>
            </el-form-item>

            <el-form-item label="其他补充条款" label-width="110px" style="margin-bottom: 0"></el-form-item>
            <el-form-item label-width="18px">
              <el-col :span="21" class="textarea">
                <div v-if="data.rules.other_info.info" class="textareaInfo">
                  {{data.rules.other_info.info.info}}
                </div>
              </el-col>
              </el-input>
            </el-form-item>

            <el-row>
              <el-col :span="10">
                <el-form-item label="手动结算周期：" label-width="130px">
                  <span class="info">{{data.manual_billing_cycle}} 天</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="自动结算周期：" label-width="130px">
                  <span class="info">{{data.auto_billing_cycle}} 天</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

    <el-row class="buttonGroup" style="text-align: left;margin-left:16px;">
      <el-button v-if="showBtn" type="primary" size="large"
                 @click="passDialog = true">&emsp;通 过&emsp;</el-button>
      <el-button v-if="showBtn" type="danger" size="large"
                 @click="rejectDialog = true">&emsp;驳 回&emsp;</el-button>
      <el-button type="primary" size="large" @click="backTo">&emsp;返 回&emsp;</el-button>
    </el-row>


    <!--通过-->
    <el-dialog size="tiny" v-model="passDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p style="font-size: 17px">确认该项目审核通过？</p>
          <br/>
          <div class="buttonGroup" style="margin-bottom:20px">
            <el-button type="primary" size="large"
                       @click="pass(true)" style="margin-right:20px">确 认</el-button>
            <el-button size="large" @click="passDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--驳回-->
    <el-dialog title="驳 回" size="tiny" class="rejectModal"
               v-model="rejectDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <el-col :span="21">
          <p>请选择驳回理由：</p>
          <el-radio-group v-model="rejectReason" style="line-height:30px"
                          @change="radioChange">
            <el-col :span="8">
              <el-radio label="图文不符">图文不符</el-radio>
            </el-col>
            <el-col :span="8">
              <el-radio label="分类错误">分类错误</el-radio>
            </el-col>
            <el-col :span="8">
              <el-radio label="错别字">错别字</el-radio>
            </el-col>
            <el-col :span="7">
              <el-radio label="其他(请填写)">其他(请填写)</el-radio>
            </el-col>
            <el-col :span="8">
              <span v-if="error" class="error">{{error}}</span>
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
            <el-button type="primary" size="large"
                       @click="pass(false)" style="margin-right:20px">确 认</el-button>
            <el-button size="large" @click="rejectDialog = false">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--提示-->
    <dialogTips :isRight="isRight" :tips="tips" :tipsVisible="tipsVisible"></dialogTips>
  </div>
</template>

<script>
  import radioCheck from "../../../../components/radio/index.vue"
  import dialogTips from "../../../../components/dialogTips/index.vue"
  import {PROVERIFY_FILLING_URL, PROVERIFY_PASS_URL, FESTIVALS_URL} from "../../../../common/interface"
  import {modalHide, getUrlParameters, compareFestival} from "../../../../common/common"

  export default{
    data() {
      return {
        showBtn: false,      // 是否显示审核和驳回按钮
        shopName: "",        // 商家名称
        applynum: "",        // 审编号
        shopTable: [],       // 门店信息表格
        moreShops: false,    // 查看更多门店
        festivals: [],       // 节假日
        data: {
          category_parent_name: "",   // 二级分类
          category_name: "",          // 三级分类
          commission: "",             // 佣金比例
          photos: [],                 // 项目图片
          name: "",                   // 项目名称
          recommend_use_people_number: "",  // 用餐人数
          foods: [],         // 菜单组合
          total: "",         // 原价
          price: "",         // 优惠价
          jm_price: "",      // 结算价
          manual_billing_cycle: "",   // 手动结算周期
          auto_billing_cycle: "",     // 自动结算周期
          rules: {
            expire_date: {     // 团购券有效期
              index: null,
              info_0: {       // 自上线之日起 3 个月
                number: ""
              },
              info_1: {      // 自上线之日起 2 天
                number: ""
              },
              info_2: {      // 自上线之日起至 2016-12-31 23:59:59
                end_date: ""
              }
            },
            exclude_use_date: {  // 不可用日期
              index: null,
              info_0: {},       // 所有日期都可用
              info_1: {         // 部分日期不可用
                week: [],       // 周末不可以使用
                dates: [        // 用户选定的日期
                  {
                    begin: "",
                    end: "",
                    festival: ""
                  }
                ]
              }
            },
            expire_date_auto_extend: {  // 是否支持自动延长团购券有效期
              index: null,
              info_0: {},        // 是，默认每次延长 30 天
              info_1: {}         // 否，不支持
            },
            use_time: {          // 使用时间
              index: null,
              info_0: {},        // 24 小时使用
              info_1: {          // 部分时间可用
                dates: [         // 指定可用时间
                  {              // 18:20 - 02:00
                    begin_hour: "",
                    begin_minute: "",
                    end_hour: "",
                    end_minute: ""
                  }
                ],
                note: ""        // 特殊情况说明
              }
            },
            reservation: {      // 是否预约
              index: null,
              info_0: {},       // 无需预约，消费高峰时可能需要等位
              info_1: {         // 提前 3 天
                day: ""
              },
              info_2: {         // 提前 2 小时
                hour: ""
              }
            },
            recommend_use_date: {  // 推荐用餐时段
              indexs: []           // 早餐，午餐，晚餐，下午茶，夜宵
            },
            buy_limit_number: {    // 是否限购团购券
              index: null,
              info_0: {},          // 不限
              info_1: {            // 是，每人限购 2 张
                number: ""
              }
            },
            use_limit: {        // 是否限用团购券
              index: null,
              info_0: {},       // 不限
              info_1: {         // 是，每人限用 1 张
                number: ""
              },
              info_2: {         // 是，每桌限用 3 张
                number: ""
              }
            },
            use_limit_people_number: {  // 是否限制使用人数
              index: null,
              info_0: {},               // 不限
              info_1: {                 // 是，每张限 3 人使用，身高 1.3 米以上儿童计入人数
                people: "",
                height: ""
              },
              info_2: {                 // 是，每张限 2 人使用，不论是否儿童均计入人数
                people: ""
              }
            },
            packing_info: {     // 打包信息
              index: null,
              info_0: {},       // 免费打包
              info_1: {         // 否，需支付打包费 5 元/盒
                price: ""
              },
              info_2: {         // 否，需支付打包费 2 元/袋
                price: ""
              },
              info_3: {         // 打包袋免费，打包盒收费标准为 3 元/盒
                price: ""
              },
              info_4: {}        // 可以打包，打包费详情咨询商家
            },
            packing_limit: {    // 堂食外带约定
              index: null,
              info_0: {},       // 堂食外带均可
              info_1: {}        // 仅限堂食，不提供外带
            },
            serviette_info: {   // 餐巾纸
              index: null,
              info_0: {},       // 免费
              info_1: {},       // 不提供
              info_2: {         // 3 元/份
                price: ""
              }
            },
            other_info: {       // 其它补充条款
              info: {
                info: ""
              }
            }
          }
        },
        error: "",
        rejectReason: "图文不符",    // 驳回原因
        textarea: "",
        rejectDialog: false,   // 驳回模态框
        passDialog: false,     // 驳回模态框
        isRight: true,       // 提示框
        tips: "操作成功！",
        tipsVisible: false
      }
    },
    mounted() {
      var self = this
      self.get_festivals()
      self.get_info()
      if (self.$route.name === "项目审核记录") {
        self.showBtn = false
      } else {
        self.showBtn = true
      }
    },
    methods: {
      /* 获取节加入 */
      get_festivals: function() {
        var self = this
        self.$http.get(FESTIVALS_URL)
          .then(function(response) {
            if (response.body.success) {
              self.festivals = response.body.content
            }
          })
      },
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
              var rules = data.rules
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
              self.data.category_name = data.category_name       // 三级分类
              self.data.commission = data.commission             // 佣金比例
              self.data.photos = data.photos                     // 佣金比例
              self.data.name = data.name                         // 项目名称
              self.data.recommend_use_people_number = data.recommend_use_people_number   // 用餐人数
              self.data.foods = data.foods         // 菜单组合
              self.data.total = data.total      // 原价
              self.data.price = data.price      // 优惠价
              self.data.jm_price = data.jm_price    // 结算价
              self.data.manual_billing_cycle = data.manual_billing_cycle    // 手动结算周期
              self.data.auto_billing_cycle = data.auto_billing_cycle        // 自动结算周期
              // 购买须知
              self.data.rules = rules
              // 不可用日期
              if (rules.exclude_use_date.index === 1) {
                var weekDisabled = rules.exclude_use_date.info_1.week.split("")
                var week = []
                for (let i = 0; i < weekDisabled.length; i++) {
                  if (weekDisabled[i] === "1") {
                    week.push(i + "")
                  }
                }
                self.data.rules.exclude_use_date.info_1.week = week
                var dateDiabled = rules.exclude_use_date.info_1.dates
                for (let i = 0; i < dateDiabled.length; i++) {
                  self.data.rules.exclude_use_date.info_1.dates[i].festival = compareFestival(self.festivals, dateDiabled[i].begin, dateDiabled[i].end)
                }
              }
            }
          })
      },
      // 查看更多门店
      get_more_shops: function() {
        var href, otherWindow
        let id = getUrlParameters(window.location.hash, "id")
        href = "#/project/wholeShops#id=" + id
        otherWindow = window.open(href, "",
          "height=500, width=860, top=" + (screen.height - 500) / 2 + ",left=" + (screen.width - 800) / 2 + ",alwaysRaised=yes," +
          "toolbar=no,menubar=no,location=no,status=no")
        otherWindow.opener = null
      },
      // 返回商家列表
      backTo: function() {
        var self = this
        var htmlSrc = self.$route.path.substring(0, self.$route.path.lastIndexOf("/"))
        self.$router.push({path: htmlSrc})
      },
      // 驳回选择理由
      radioChange: function() {
        var self = this
        self.error = ""
      },
      // 审核
      pass: function(flag) {
        var self = this
        let id = getUrlParameters(window.location.hash, "id")
        var formdata = {
          flag: flag,
          item_id: id,
          reject_reason: "",
          manual_billing_cycle: self.data.manual_billing_cycle,
          auto_billing_cycle: self.data.auto_billing_cycle
        }
        if (flag) {   // 通过
          self.tips = "审核成功"
        } else {   // 驳回
          self.tips = "驳回成功"
          formdata.reject_reason = self.rejectReason
          if (self.rejectReason === "其他(请填写)") {
            if (self.textarea) {
              formdata.reject_reason = self.textarea
              self.error = ""
            } else {
              self.error = "请选择驳回原因"
            }
          }
        }
        if (!self.error) {
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
                  var htmlSrc = self.$route.path.substring(0, self.$route.path.lastIndexOf("/"))
                  self.$router.push({path: htmlSrc})
                })
              }
            })
        }
      }
    },
    components: {
      radioCheck,
      dialogTips
    }
  }
</script>

<style scoped>
  .dishes, .myTable tr td{
    border-bottom: 1px solid rgb(210, 212, 215);
  }
  .myTable tbody tr td{
    padding: 10px 20px;
  }
  .myTable tbody tr td:first-child{
    width: 130px;
    text-align: center;
  }
  .myTable tr td:last-child{
    border-left: 1px solid rgb(210, 212, 215);
  }
  .dishes:last-child, .myTable tr:last-child td{
    border-bottom: none;
  }
  .myTable{
    width: 100%;
    padding: 0;
    color: #838383;
    border: 1px solid rgb(210, 212, 215);
  }
  .tableHead{
    border-bottom: 1px solid rgb(210, 212, 215);
  }
  .headContent{
    margin: 4px 20px;
    font-size: 14px;
  }
  .avilable, .showbox, .textarea{
    border: 1px solid rgb(210, 212, 215);
    padding:4px 40px;
    margin: 0 10px;
  }
  .textarea{
    padding: 10px 20px;
    margin-left: 0;
  }
  .textareaInfo{
    height:80px;
    word-wrap:break-word;
    word-break:normal;
    line-height: 20px;
  }
  .tableContent{
    font-size: 13px;
    padding: 0 30px;
  }
</style>
