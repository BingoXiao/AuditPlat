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

</style>
