<template>
  <div class="requirementAdd-container">
    <div class="Breadcrumb">
      <span></span>
      <router-link to="/requirementManger">需求列表</router-link><b> > </b><span>新增需求</span>
    </div>
    <div class="block">
      <el-form ref="form" :model="addForm" :rules="rules" label-width="140px">
        <el-form-item class="title" label="需求标题：" prop="requirementTitle">
          <el-input v-model="addForm.requirementTitle"></el-input>
        </el-form-item>
        <el-form-item label="期望完成日期：" prop="exceptComplete">
          <el-date-picker
            v-model="addForm.exceptComplete"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item  class="editor" label="具体内容：" prop="content">
          <div ref="EditorTab"></div>
          <div ref="Editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveFun()">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import E from 'wangeditor'
  import {
    requirementAdd,
    fileUpload
  } from "@/api/api"
  export default {
    name: 'requirementAdd',
    data(){
      var validate = (rule, value, callback) => {
        if (this.editor.txt.text() == '') {
          callback(new Error('不能为空'));
        } else {
          callback();
        }
      };
      return{
        pickerOptions: {
          disabledDate: (time) => {
            let nowData = new Date()
            nowData = new Date(nowData.setDate(nowData.getDate() - 1))
            return time < nowData
          }
        },
        editor: null,
        addForm: {
          requirementTitle: null,
          exceptComplete: null,
          content: null
        },
        rules: {
          requirementTitle: [{ required: true, message: "不能为空", trigger: "blur" }],
          exceptComplete: [{ required: true, message: "请选择", trigger: "blur" }],
          content: [{ required: true, message: "不能为空", trigger: "blur" },
          { validator: validate, trigger: 'blur' }],
        }
      }
    },
    methods:{
      saveFun(){
        this.$refs.form.validate(valid => {
          if (valid) {
            console.log(this.addForm);
            requirementAdd(this.addForm).then(res => {
              if( res.code == 0 ){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.push('/requirementManger')
              }
            })
          }
        });
      },
    },
    mounted(){
      this.editor = new E(this.$refs.EditorTab,this.$refs.Editor)        //创建富文本实例
      this.editor.customConfig.onchange = (html) => {
        this.addForm.content = html
      }
      this.editor.customConfig.zIndex = 100;
      this.editor.customConfig.menus = [          //菜单配置
        'head',
        'list',  // 列表
        'justify',  // 对齐方式
        'bold',
        'fontSize',  // 字号
        'italic',
        'underline',
        'image',  // 插入图片
        'foreColor',  // 文字颜色
        'undo',  // 撤销
        'redo',  // 重复
      ]
      this.editor.customConfig.pasteIgnoreImg = true
      this.editor.customConfig.showLinkImg = false
      this.editor.customConfig.uploadImgMaxLength = 1  //一次最多上传图片数量
      this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024
      //自定义提示
      this.editor.customConfig.customAlert = info => {
        this.$message({
          message: info,
          type: 'error'
        })
      }
      //自定义图片上传
      this.editor.customConfig.customUploadImg = function (files, insert) {
        let formData = new FormData();
        formData.append('file',files[0]);
        fileUpload(formData).then(res => {
          if( res.code == 0 ){
            insert(res.data.filePath)
          }
        })
      }
      this.editor.create()
    }
  };
</script>
<style lang="scss">
  @import "../../styles/common.scss";
  .requirementAdd-container {
    
    @include layout(1);
    // @include dialog;
    >.block{
      overflow-y: auto;
    }
    .el-form{
      max-width: 975px;
      padding: 40px 20px 0 0;
      &::after{
        content: '';
        display: block;
        clear: both;
      }
      .el-date-editor{
        width: 100% !important;
      }
    }
    .el-form-item{
      width: 325px;
      float: left;
    }
    .el-date-editor{
      width: 100%;
    }
    .title{
      width: 650px;
    }
    .editor{
      width: 100%;
      max-width: 975px;
    }
    .w-e-toolbar {
      border: 1px solid #ccc;
    }
    .w-e-text{
      min-height: 300px;
    }
    .w-e-text-container{
      border: 1px solid #ccc;
      border-top: none;
    }
  }
</style>
