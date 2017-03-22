<template>
  <el-row class="panel-center" type="flex" justify="center" style="top:80px;">
    <el-col :span="20" :offset="2">
      <el-col :span="20" :offset="1">
        <el-col :span="24">
          <tab-component :tabs="tabs" :which="which" v-on:toggle="tabChange"></tab-component>

          <package-info v-show="currentView === 'packageInfo'"></package-info>
          <hot-spot ref="editor" v-show="currentView === 'hotSpot'"></hot-spot>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import tabComponent from "../../../../components/tabs/inner/index";
  import packageInfo from "../../../Review/project_review/module/index";
  import hotSpot from "./hotSpot/index";

  export default{
    data() {
      return {
        tabs: {
          "packageInfo": "套餐信息",
          "hotSpot": "脉点"
        },
        which: "packageInfo",
        currentView: "packageInfo",
        item_id: ""
      };
    },
    methods: {
      /* tab改变时，表格内容切换(父子组件通信) */
      tabChange: function(name) {
        this.currentView = name;
      }
    },
    components: {
      tabComponent,
      packageInfo,
      hotSpot
    }
  };
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
