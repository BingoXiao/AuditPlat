<template>
  <div>
    <div class="col" :class="{select: selected, disabled: !selected}"></div>
    <div class="col"><slot></slot></div>
  </div>
</template>

<script>
  export default{
    props: {
      selected: Boolean
    }
  };
</script>

<style scoped>
  .select {
    width: 8px;
    height: 8px;
    background-color: #ffe230;
    border: 5px solid #000;
    border-radius: 100%;
  }
  .disabled{
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid rgb(191, 203, 217);
    border-radius: 100%;
  }
  .col{
    float: left;
    line-height: 18px;
    vertical-align: middle;
    margin-right: 15px;
    margin-top: 8px
  }
</style>
