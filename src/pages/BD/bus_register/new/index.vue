<template>
  <div class="panel-center">
    <steps-component></steps-component>
  </div>
</template>

<script>
  import stepsComponent from "../../../../components/steps/index"

  export default{
    data() {
      return {
        index: "1"
      }
    },
    components: {
      stepsComponent
    }
  }
</script>

<style scoped>

</style>
