<template>
  <div class="login-container">
    <div id="login">
      <div class="formWrap">
        <p class="title">需求管理平台</p>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="userName">
            <el-input
              class="userName"
              ref="userName"
              placeholder="请输入账号"
              prefix-icon="icon-da-zhanghao"
              @keyup.enter.native="enterFun"
              v-model="form.userName">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="icon-da-mima"
              @keyup.enter.native="login"
              v-model="form.password">
            </el-input>
          </el-form-item>
          <!-- <p class="clearfix"> -->
            <!-- <el-checkbox label='记住密码'></el-checkbox>  -->
            <!-- <span class="fr">没有账号？<router-link to="/register">立即注册</router-link></span> -->
          <!-- </p> -->
          <div class="btn" @click="login" @keyup.enter.native="login">登录</div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
// import formatRouter from '@/permission'
import {
  login
} from "@/api/api";
export default {
  name: "login",
  data() {
    return {
      form: {
        userName: null,
        password: null
      },
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created(){
    localStorage.removeItem('user')
  },
  mounted(){
    this.$refs.userName.focus()
  },  
  methods: {
    enterFun(){
      if( this.form.userName && !this.form.password ){
        this.$refs.password.focus();
        return
      }
      if( this.form.userName && this.form.password ){
        this.login();
      }
    },
    login: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append('userName',this.form.userName);
          formData.append('password',this.form.password);
          login(formData).then(res => {
            if (res.code == 200 || res.code == 0) {
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              localStorage.setItem('user', JSON.stringify(res.data))
              this.$router.push('/')
            }
          })
        }
      })
    }
  }
};
</script>
<style lang='scss'>
.login-container{
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
}
#login {
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #fff inset;
    -webkit-box-shadow: 0 0 0px 1000px #fff inset; //如果你的图片都背景颜色，这里修改的颜色和背景颜色一致
    -webkit-text-fill-color: #333; //设置字体颜色
  }
  height: 548px;
  width: 910px;
  color: #a5a9d2;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  background: url(../../assets/imgs/loginBg.png) center center no-repeat;
  background-size: cover;
  h1 {
    padding: 42px;
  }
  .title {
    height: 26px;
    font-size: 24px;
    margin-bottom: 30px;
    width: 100%;
    font-family: MicrosoftYaHei;
    color: #42576c;
    line-height: 0px;
  }
  .formWrap {
    position: absolute;
    height: 300px;
    width: 296px;
    right: 100px;
    top: 50%;
    margin-top: -150px;
    a {
      color: #333;
    }
    .el-checkbox__label {
      color: #a5a9d2;
    }
  }
  .el-input {
    color: #333333;
    i{
      color: #1890FF;
      font-size: 19px;
    }
  }
  .el-input__inner {
    background: #fff;
    border-radius: 0px;
    border: none;
    border-bottom: 1px solid rgba(220, 220, 220, 1);
    color: #333;
  }
  input::-webkit-input-placeholder {
    color: #a5a9d2;
  }
  .btn {
    height: 40px;
    background: #1890FF;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    color: #fff;
    margin-top: 16%;
    cursor: pointer;
  }
}
</style>
