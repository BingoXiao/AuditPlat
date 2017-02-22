<template>
  <div>
    <el-select v-model="province_value" placeholder="--省--" class="small" clearable
               @change="get_city_list" name="businfo.province_id">
      <el-option
        v-for="item in province_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="city_value" placeholder="--市--" class="small" clearable
               @change="get_district_list" name="businfo.city_id">
      <el-option
        v-for="item in city_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="district_value" placeholder="--区/县--" class="small" clearable
               @change="get_city_near_list" name="businfo.district_id">
      <el-option
        v-for="item in district_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-select v-model="city_near_value" placeholder="--商圈--" class="small"
               clearable name="businfo.city_near_id">
      <el-option
        v-for="item in city_near_list"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>

    <el-col :span="24" style="margin-top: 22px">
      <el-col :span="12">
        <el-input name="businfo.address_detail"></el-input>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button type="primary" @click="localAddress">定位标记</el-button>
      </el-col>
    </el-col>
  </div>
</template>

<script>
  import {PROVINCE_URL, CITY_URL, DISTRICT_URL, CITYNEAR_URL} from "../../../common/interface"

  export default{
    props: ["options"],
    data() {
      return {
        province_value: "",
        city_value: "",
        district_value: "",
        city_near_value: "",
        province_list: [],
        city_list: [],
        district_list: [],
        city_near_list: []
      }
    },
    mounted: function() {
      var self = this
      self.get_province_list()
      if (self.options.length > 0) {
        self.province_value = self.options[0]
        self.city_value = self.options[1]
        self.district_value = self.options[2]
        self.city_near_value = self.options[3]
      }
    },
    methods: {
      /* 获取省列表 */
      get_province_list: function() {
        var self = this
        self.$http.get(PROVINCE_URL).then(function(response) {
          if (response.data.success) {
            self.province_list = response.data.content
          }
        })
      },

      /* 获取市列表 */
      get_city_list: function(value) {
        var self = this
        if (!value) {    // 清空
          self.city_list = []
          self.district_list = []
          self.city_near_list = []
          self.city_value = ""
          self.district_value = ""
          self.city_near_value = ""
        } else {         // 选择
          self.$http.get(CITY_URL + "?province_id=" + value).then(function(response) {
            if (response.data.success) {
              self.city_list = response.data.content
            }
          })
        }
      },

      /* 获取区/县列表 */
      get_district_list: function(value) {
        var self = this
        if (!value) {         // 清空
          self.district_list = []
          self.city_near_list = []
          self.district_value = ""
          self.city_near_value = ""
        } else {         // 选择
          self.$http.get(DISTRICT_URL + "?city_id=" + value).then(function(response) {
            if (response.data.success) {
              self.district_list = response.data.content
            }
          })
        }
      },

      /* 获取商圈列表 */
      get_city_near_list: function(value) {
        var self = this
        if (!value) {         // 清空
          self.city_near_list = []
          self.city_near_value = ""
        } else {         // 选择
          self.$http.get(CITYNEAR_URL + "?district_id=" + value).then(function(response) {
            if (response.data.success) {
              self.city_near_list = response.data.content
            }
          })
        }
      },

      /* 定位标记 */
      localAddress: function(address) {
        var self = this
        var aa = self.province_value + self.city_value +
          self.district_value + self.city_near_value
        console.log(aa)
      }
    }
  }
</script>

<style scoped>
  .small {
    width: 130px;
  }
</style>
