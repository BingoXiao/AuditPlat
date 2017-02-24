<template>
  <el-row class="steps">
    <el-col :span="24">
      <el-col :span="steps_span" :offset="steps_offset" class="text_container">
        <span class="content">{{step1.title}}</span>
      </el-col>
      <el-col :span="steps_span" class="text_container"
              v-for="item in steps_content">
        <span class="content">{{item.title}}</span>
      </el-col>
    </el-col>

    <el-col :span="20" :offset="2" class="steps_line"></el-col>

    <el-col :span="24">
      <el-col class="container" :span="steps_span" :offset="steps_offset">
        <div class="cell" v-if="active == step1.index">
          <div class="content">
            <img src="../../assets/big.png" alt="step"/>
          </div>
        </div>
        <div class="cell" v-else>
          <div class="content">
            <img src="../../assets/small.png" alt="step"/>
          </div>
        </div>
      </el-col>
      <el-col class="container" :span="steps_span"
              v-for="item in steps_content">
        <div class="cell" v-if="active == item.index">
          <div class="content" >
            <img src="../../assets/big.png" alt="step"/>
          </div>
        </div>
        <div class="cell" v-else>
          <div class="content">
            <img src="../../assets/small.png" alt="step"/>
          </div>
        </div>
      </el-col>
    </el-col>
  </el-row>

</template>

<script>
  export default{
    props: ["steps", "active"],
    computed: {
      step1: function() {
        var self = this
        return self.steps[0]
      },
      steps_content: function() {
        var self = this
        var arr = []
        for (let i = 1; i < self.steps.length; i++) {
          arr.push(self.steps[i])
        }
        return arr
      },
      steps_span: function() {
        var self = this
        return parseInt(24 / self.steps.length)
      },
      steps_offset: function() {
        var self = this
        if (parseInt(24 % self.steps.length) > 0) {
          return (24 % self.steps.length) / 2
        } else {
          return 0
        }
      }
    }
  }
</script>

<style scoped>
  .steps {
    margin-top: 50px;
  }

  .text_container {
    display: table;
    float: left;
    text-align: center;
  }

  .container {
    height: 100px;
    display: table;
    float: left;
    text-align: center;
  }

  .cell {
    display: table-cell;
    vertical-align: middle;
  }

  .content {
    position: relative;
    font-size: 22px;
  }

  .steps_line {
    border: 2px solid #020202;
    position: relative;
    top: 50px;
    /*left: 10px;*/
  }
</style>
