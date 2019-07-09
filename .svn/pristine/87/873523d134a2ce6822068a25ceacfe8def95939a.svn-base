<template>
  <div class="slideBar-container" :style="{width: isCollapse ? '65px' : 'auto' }">
    <div class="close-btn" @click="trigger()"><i class="icon-da-caidan"></i></div>
    <el-menu
      :router="true"
      :collapse="isCollapse"
      class="el-menu-container asideTrans"
      background-color="#000C17"
      :collapse-transition="false"
      text-color="#9EA3A7"
      :default-active="$route.path"
      active-text-color="#1890FF">
      <div v-if="!isCollapse" class="logo"></div>
      <el-menu-item index="/requirementManger">
        <i class="icon-da-tongyiqushu" style="font-size: 16px;"></i>
        <span slot="title">需求列表</span>
      </el-menu-item>
      <el-menu-item index="/projectManagement" v-if="platformPermission == 1">
        <i class="icon-da-tongyiqushu" style="font-size: 16px;"></i>
        <span slot="title">添加项目</span>
      </el-menu-item>
      <el-menu-item index="/staffManagement" v-if="platformPermission == 1">
        <i class="icon-da-gongyingshangguanli" style="font-size: 16px;"></i>
        <span slot="title">人员管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'slideBar',
    data(){
      return{
        isCollapse: false,
        platformPermission: localStorage.user ? JSON.parse(localStorage.user).platformPermission : null,
        // menuList: [
        //   {
        //     name: '需求列表',
        //     ico: 'icon-da-jiekouguanli',
        //     path: '/requirementManger'
        //   },
        //   {
        //     name: '添加项目',
        //     ico: 'icon-da-tongyiqushu',
        //     path: '/projectManagement'
        //   },
        //   {
        //     name: '人员管理',
        //     ico: 'icon-da-gongyingshangguanli',
        //     path: '/staffManagement'
        //   },
        // ]
      }
    },
    created(){
      // this.menuList = JSON.parse(localStorage.menus);
      if( document.attachEvent && !K.Browser.opera ) {       
        document.attachEvent("onstorage", ev => {
          if (ev.key == 'user') {
            if(!ev.newValue) {
              this.$router.push('/login')
              return
            }
            let newValue = JSON.parse(ev.newValue);
            this.platformPermission = newValue.platformPermission;
          }
        });       
      }       
      //其他注册在window上       
      else{       
        window.addEventListener("storage", ev => {
          if (ev.key == 'user') {
            if(!ev.newValue) {
              this.$router.push('/login')
              return
            }
            let newValue = JSON.parse(ev.newValue);
            this.platformPermission = newValue.platformPermission;
          }
        });       
      };   
    },
    methods:{
      trigger(){
        this.isCollapse = this.isCollapse == true ? false : true;
        this.$emit('triggerMenu', this.isCollapse);
      }
    }
  }
</script>
<style lang="scss">
.slideBar-container{
  position: relative;
  height: 100%;
  .asideTrans{
    transition: width 0.3s;
  }
  .close-btn{
    position: absolute;
    top: 21px;
    right: -27px;
    width: 28px;
    height: 28px;
    line-height: 28px;
    background-color: #002140;
    border-radius: 0 14px 14px 0;
    cursor: pointer;
    z-index: 100;
    i{
      color: #fff;
      margin-left: 3px;
    }
  }
  .el-menu-container{
    height: 100%;
    overflow-y: auto;
    .logo{
      width: 100%;
      height: 74px;
      background: url(../../../assets/imgs/logo.png) center no-repeat;
    }
    .el-menu--inline,.el-menu-item{
      background-color: #000C17 !important;
      min-width: inherit;
    }
    .el-submenu__title{
      i{
        margin-right: 10px;
      }
    }
  }
}
</style>

