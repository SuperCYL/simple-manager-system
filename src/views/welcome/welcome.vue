<template>
  <div class="welcome-container">
    <div class="welcome">
      <img src="../../assets/imgs/hy.png">
      <p>欢迎登录统一数据接入平台！</p>
    </div>
  </div>
</template>
<script>
  // import {
  //   userAdd,
  // } from "@/api/api";
  export default {
    name: 'welcome',
    created(){
      // this.$store.commit('changeUser','111')
    }
  };
</script>
<style lang="scss">
  .welcome-container {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    margin: auto;
    background-color: #ffffff;
    .welcome{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 350px;
      height: 350px;
      img{
        display: block;
        margin: 0 auto;
      }
      p{
        font-size:24px;
        color: #b3b3b3;
        text-align: center;
      }
    }
  }
</style>
