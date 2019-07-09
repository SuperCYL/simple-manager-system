<template>
  <div class="app-wrapper">
    <el-container>
      <el-aside :width="isCollapse == true ? '65px':'200px'" class="asideTrans">
        <sideBar @triggerMenu="triggerMenu"></sideBar>
      </el-aside>
      <el-container>
        <el-header class="header-container" height="74">
          <div class="header-title">需求管理系统</div>
          <el-dropdown class="header-icon-box" @command="handleCommand">
            <div class="header-icon"></div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="header-name">{{userName}}</div>
        </el-header>
        <el-main class="main-container">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="修改密码" :close-on-click-modal="false" :visible.sync="passwordUpdateFlag">
      <el-form ref="form" :model="passwordUpdateForm" :rules="rules" label-width="80px">
        <el-form-item label="旧密码：" prop="oldPass">
          <el-input type="password" v-model="passwordUpdateForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPass">
          <el-input type="password" v-model="passwordUpdateForm.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="repassw">
          <el-input type="password" v-model="passwordUpdateForm.repassw"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordUpdateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submit()">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import sideBar from './components/slideBar'
import { resetRouter } from '@/router'
import { logout,memberUpdatepswd } from '@/api/api'
export default {
  name: 'layout',
  data(){
    var validatePass = (rule, value, callback) => {
      if (value != null) {
        if (this.passwordUpdateForm.repassw !== null) {
          this.$refs.form.validateField('repassw');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value != null && value !== this.passwordUpdateForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      userID: JSON.parse(localStorage.user).id,
      userName: JSON.parse(localStorage.user).memberName,
      isCollapse: false,
      passwordUpdateFlag: false,
      passwordUpdateForm: {
        oldPass: null,
        newPass: null,
        repassw: null
      },
      rules: {
        oldPass: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { min: 6, max: 12, trigger: "blur", message: "请输入6-12位密码" }
        ],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 12, trigger: "blur", message: "请输入6-12位密码" }
        ],
        repassw: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
          { min: 6, max: 12, trigger: "blur", message: "请输入6-12位密码" }
        ]
      },
    }
  },
  components: {
    sideBar
  },
  watch:{
    passwordUpdateFlag(val){
      if( val == false ){
        this.passwordUpdateForm = {
          oldPass: null,
          newPass: null,
          repassw: null
        }
      }
    }
  },
  // created(){
  //   console.log(JSON.parse(localStorage.user).id);
  // },
  methods: {
    triggerMenu(flag){
      this.isCollapse = flag;
    },
    handleCommand(command){
      if( command == 'logout' ){
        logout().then(res => {
          if( res.code == 0 ){
            this.$message({
              message: '登出成功！',
              type: 'success'
            })
            localStorage.removeItem('user');
            this.$router.push('/login');
          }
        })
      }
      if( command == 'editPassword' ){
        this.passwordUpdateFlag = true;
      }
    },
    submit(){
      this.$refs.form.validate(valid => {
        if (valid) {
          // let params = {
          //   oriPswd: this.passwordUpdateForm.oldPass,
          //   newPowd: this.passwordUpdateForm.newPass,
          //   confirmPswd: this.passwordUpdateForm.repassw
          // }
          let formData = new FormData();
          formData.append('oriPswd',this.passwordUpdateForm.oldPass);
          formData.append('newPowd',this.passwordUpdateForm.newPass);
          formData.append('confirmPswd',this.passwordUpdateForm.repassw);
          memberUpdatepswd(formData).then(res => {
            if (res.code == 0) {
              this.$message({
                message: "操作成功！",
                type: "success"
              })
              this.passwordUpdateFlag = false
              localStorage.removeItem('user')
              this.$router.push('/login')
            }
          });
        }
      });
    }
    // handleClickOutside() {
    //   this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/common.scss";
  .app-wrapper{
    height: 100%;
    .el-container{
      height: 100%;
    }
    .header-container{
      position: relative;
      height: 74px;
      line-height: 74px;
      .header-title{
        float: left;
        font-size: 20px;
        color: #666;
        margin-left: 30px;
      }
      .header-name{
        float: right;
        margin-right: 10px;
        font-size: 14px;
        color: #666;
      }
      .header-icon-box{
        float: right;
      }
      .header-icon{
        width: 36px;
        height: 36px;
        margin-top: 19px;
        background: url(../../assets/imgs/ava.png) center no-repeat;
        cursor: pointer;
      }
    }
    .el-aside{
      overflow: inherit
    }
    .main-container{
      padding: 0;
      position: relative;
      background-color: #F0F2F5;
    }
    .asideTrans{
      transition: width 0.3s;
    }
  }
</style>
