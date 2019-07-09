<template>
  <div class="requirementAdd-container">
    <div class="Breadcrumb">
      <span></span>
      <router-link to="/requirementManger">需求列表</router-link><b> > </b><span>{{ isEdit ? '编辑需求' : '需求详情' }}</span>
    </div>
    <div class="block">
      <el-form ref="form" :model="editForm" :rules="rules" label-width="125px">
        <el-form-item label="紧急程度：" prop="emergencyLevel">
          <el-select v-model="editForm.emergencyLevel" disabled placeholder="请选择">
            <el-option label="1" :value="1"></el-option>
            <el-option label="2" :value="2"></el-option>
            <el-option label="3" :value="3"></el-option>
            <el-option label="4" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人：" prop="v">
          <el-input v-model="editForm.userCreate" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" prop="department">
          <el-select v-model="editForm.department" disabled placeholder="请选择">
            <el-option v-for="item in departmentList" :key="item.id" :value="item.id" :label="item.departName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目：" prop="projectBelong">
          <el-select v-model="editForm.projectBelong" disabled placeholder="请选择">
            <el-option v-for="item in projectList" :key="item.id" :value="item.id" :label="item.projectName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="gmtCreate">
          <el-date-picker
            disabled
            v-model="editForm.gmtCreate"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="期望完成时间：" prop="exceptComplete">
          <el-date-picker
            :disabled="isEdit == false"
            v-model="editForm.exceptComplete"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计完成时间：" prop="planComplete">
          <el-date-picker
            disabled
            v-model="editForm.planComplete"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际完成时间：" prop="realComplete">
          <el-date-picker
            disabled
            v-model="editForm.realComplete"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="负责人：" prop="principal">
          <el-select disabled v-model="editForm.principal">
            <el-option v-for="item in principalList"  :key="item.id" :value="item.id" :label="item.memberName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="title" label="成员：" prop="members">
          <el-select multiple disabled v-model="editForm.members" value-key="id" style="width: 100%;">
            <el-option v-for="item in memberList" :key="item.id" :value="{id: item.id,name: item.memberName}" :label="item.memberName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="title" label="需求标题：" prop="requirementTitle">
          <el-input v-model="editForm.requirementTitle" :disabled="isEdit == false"></el-input>
        </el-form-item>
        <el-form-item class="editor" label="具体内容：" prop="content">
          <div ref="EditorTab" v-show="isEdit"></div>
          <div ref="Editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isEdit" @click="getInfoData()">取 消</el-button>
          <el-button type="primary" v-if="isEdit" @click="saveFun()">提 交</el-button>
          <el-button type="primary" v-if="!isEdit" @click="isEdit = true" :disabled="user.id != infoUserId">编 辑</el-button>
        </el-form-item>
        <el-form-item class="editor" label="历史记录：" prop="orderId">
          <div v-for="(item,index) in requirementHistoryList" :key="index">
            <span>{{ index+1 + '.' }}</span>
            <span>{{ item.gmtCreate | formatDate }}</span>
            <span>{{ item.actionContent }}</span>
            <div v-if="item.requirementContent">内容为：
              <div v-html="item.requirementContent"></div>
            </div>
            <div v-if="item.description">说明：
              <span v-html="item.description"></span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {formatDateFun} from '@/filters'
  import E from 'wangeditor'
  import {
    requirementFindbyid,
    projectFindall,
    requirementUpdate,
    departmentList,
    memberFindByPermission,
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
        user: localStorage.user ? JSON.parse(localStorage.user) : null,
        infoUserId: null,
        projectList: null,
        departmentList: null,
        isEdit: false,
        editor: null,
        dataInit: false,
        editorInit: false,
        requirementHistoryList: null,
        principalList: null,
        memberList: null,
        members: null,
        editForm: {
          emergencyLevel: null,
          userCreate: null,
          department: null,
          projectBelong: null,
          gmtCreate: null,
          exceptComplete: null,
          planComplete: null,
          realComplete: null,
          principal: null,
          members: null,
          requirementTitle: null,
          content: null
        },
        rules: {
          // emergencyLevel: [{ required: true, message: "请选择", trigger: "blur" }],
          // userCreate: [{ required: true, message: "不能为空", trigger: "blur" }],
          // department: [{ required: true, message: "不能为空", trigger: "blur" }],
          // projectBelong: [{ required: true, message: "不能为空", trigger: "blur" }],
          // gmtCreate: [{ required: true, message: "不能为空", trigger: "blur" }],
          exceptComplete: [{ required: true, message: "不能为空", trigger: "blur" }],
          // planComplete: [{ required: true, message: "不能为空", trigger: "blur" }],
          // realComplete: [{ required: true, message: "不能为空", trigger: "blur" }],
          // principal: [{ required: true, message: "不能为空", trigger: "blur" }],
          // members: [{ required: true, message: "不能为空", trigger: "blur" }],
          requirementTitle: [{ required: true, message: "不能为空", trigger: "blur" }],
          content: [{ required: true, message: "不能为空", trigger: "blur" },
          { validator: validate, trigger: 'blur' }]
        }
      }
    },
    watch:{
      isEdit(val){
        this.editor.$textElem.attr('contenteditable', val)
      }
    },
    created(){
      this.getInfoData();
    },
    methods:{
      getInfoData(){
        this.isEdit = false;
        let params = {
          id: this.$route.params.id
        }
        requirementFindbyid(params).then(res => {
          if( res.code == 0 ){
            this.infoUserId = res.data.requirement.userCreateId;
            this.editForm.emergencyLevel = res.data.requirement.emergencyLevel;
            this.editForm.userCreate = res.data.requirement.userCreate;
            this.editForm.department = res.data.requirement.department;
            this.editForm.projectBelong = res.data.requirement.projectBelong;
            this.editForm.gmtCreate = res.data.requirement.gmtCreate ? formatDateFun(res.data.requirement.gmtCreate) : null;
            this.editForm.exceptComplete = res.data.requirement.exceptComplete ? formatDateFun(res.data.requirement.exceptComplete) : null;
            this.editForm.planComplete = res.data.requirement.planComplete ? formatDateFun(res.data.requirement.planComplete) : null;
            this.editForm.realComplete = res.data.requirement.realComplete ? formatDateFun(res.data.requirement.realComplete) : null;
            this.editForm.principal = res.data.requirement.principal;
            this.members = res.data.requirement.members ? JSON.parse(res.data.requirement.members) : null;
            this.editForm.requirementTitle = res.data.requirement.requirementTitle;
            this.editForm.content = res.data.requirement.content;
            if( this.editorInit == true ){
              this.editor.txt.clear()
              this.editor.txt.html(res.data.requirement.content)
            }
            this.dataInit = true;
            this.requirementHistoryList = res.data.requirementHistoryList;
            this.getEnum();
          }
        })
        
      },
      getEnum(){
        projectFindall().then(res => {
          if( res.code == 0 ){
            this.projectList = res.data;
          }
        })
        departmentList().then(res => {
          if( res.code == 0 ){
            this.departmentList = res.data;
          }
        })
        // memberFindByPermission({permission: 3}).then(res => {
        //   if( res.code == 0 ){
        //     this.principalList = res.data;
        //   }
        // })
        memberFindByPermission({permission: 3}).then(res => {
          if( res.code == 0 ){
            let arr = [];
            for (let i = 0; i < res.data.length; i++) {
              const item = res.data[i];
              arr.push(item.id)
            }
            let members = [];
            if( this.members ){
              for (let i = 0; i < this.members.length; i++) {
                const item = this.members[i];
                if( arr.indexOf(item.id) !== -1 ){
                  members.push(item)
                }
              }
              this.editForm.members = members;
            }
            this.memberList = res.data;
            this.principalList = res.data;
          }
        })
      },
      saveFun(){
        this.$refs.form.validate(valid => {
          if (valid) {
            let params = {
              id: this.$route.params.id,
              exceptComplete: this.editForm.exceptComplete,
              requirementTitle: this.editForm.requirementTitle,
              content: this.editForm.content,
            }
            requirementUpdate(params).then(res => {
              if( res.code == 0 ){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$router.push('/requirementManger');
              }
            })
          }
        });
      },
    },
    mounted(){
      this.editor = new E(this.$refs.EditorTab,this.$refs.Editor)        //创建富文本实例
      this.editor.customConfig.onchange = (html) => {
        this.editForm.content = html
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
      this.editorInit = true;
      if( this.dataInit == true ){
        this.editor.txt.html(res.data.requirement.content)
      }
      this.editor.$textElem.attr('contenteditable', false)
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
      border-bottom: none;
    }
    .w-e-text{
      min-height: 300px;
    }
    .w-e-text-container {
      border: 1px solid #ccc;
    }
  }
</style>
