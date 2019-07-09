<template>
  <div class="requirementManger-container">
    <div class="Breadcrumb">
      <span>需求列表</span>
    </div>
    <div class="block">
      <header>
        <div class="row">
          <el-button type="primary" icon="icon-da-dingzhishuju" @click="$router.push('/requirementAdd')">新增需求</el-button>
          <div class="query-item">
            <label>状态：</label>
            <el-select v-model="requirementStatus">
              <el-option :value="null" label="全部"></el-option>
              <el-option :value="1" label="未指派"></el-option>
              <el-option :value="2" label="待执行"></el-option>
              <el-option :value="3" label="正执行"></el-option>
              <el-option :value="4" label="已完成"></el-option>
              <el-option :value="5" label="已取消"></el-option>
            </el-select>
          </div>
          <div class="query-item" v-if="platformPermission != 2">
            <label>创建人：</label>
            <el-select filterable clearable v-model="userCreateId">
              <el-option v-for="item in userCreateList" :key="item.id" :value="item.id" :label="item.memberName"></el-option>
            </el-select>
          </div>
          <div class="query-item">
            <label>负责人：</label>
            <el-select filterable clearable v-model="principalId">
              <el-option v-for="item in principalList" :key="item.id" :value="item.id" :label="item.memberName"></el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </header>
      <div class="table-box">
        <el-table
          ref="table"
          :data="tableData"
          height="100%"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="emergencyLevel"
            label="紧急程度"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="所属部门"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="createUserName"
            label="创建人"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="所属项目"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="requirementTitle"
            label="需求标题"
            min-width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="$router.push('/requirementEdit/' + scope.row.id)">{{ scope.row.requirementTitle }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="requirementStatus"
            label="状态"
            min-width="100">
            <template slot-scope="scope">
              <!-- {{platformPermission +','+ user.id +','+ scope.row.principal +','+ (platformPermission === 2 || platformPermission === 3 && user.id !== scope.row.principal)}} -->
              <el-link :underline="false" :disabled="platformPermission === 2 || platformPermission === 3 && user.id !== scope.row.principal" v-if="scope.row.requirementStatus === 1" >未指派</el-link>
              <!-- <el-button type="text" @click="showEdit(scope.row.id,'status')" v-if="scope.row.requirementStatus === 1">未指派</el-button> -->
              <el-link type="warning" :underline="false" @click="showEdit(scope.row.id,'status')" :disabled="platformPermission === 2 || platformPermission === 3 && user.id !== scope.row.principal" v-if="scope.row.requirementStatus === 2">待执行</el-link>
              <el-link type="success" :underline="false" @click="showEdit(scope.row.id,'status')" :disabled="platformPermission === 2 || platformPermission === 3 && user.id !== scope.row.principal" v-if="scope.row.requirementStatus === 3">正执行</el-link>
              <el-link type="primary" :underline="false" @click="showEdit(scope.row.id,'status')" :disabled="platformPermission === 2 || platformPermission === 3 && user.id !== scope.row.principal" v-if="scope.row.requirementStatus === 4">已完成</el-link>
              <el-link type="info" :underline="false" @click="showEdit(scope.row.id,'status')" :disabled="platformPermission === 2 || platformPermission === 3 && user.id !== scope.row.principal" v-if="scope.row.requirementStatus === 5">已取消</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="创建日期"
            min-width="200">
            <template slot-scope="scope">
              {{ scope.row.gmtCreate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="exceptComplete"
            label="期望完成日期"
            min-width="200">
            <template slot-scope="scope">
              {{ scope.row.exceptComplete | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="principalName"
            label="负责人"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="planComplete"
            label="预计完成日期"
            min-width="200">
            <template slot-scope="scope">
              {{ scope.row.planComplete | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="realComplete"
            label="实际完成日期"
            min-width="200">
            <template slot-scope="scope">
              {{ scope.row.realComplete | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="platformPermission == 1"
            fixed="right"
            label="指派负责人"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="showEdit(scope.row.id,'assign')">指派</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="7"
          :current-page="pageNo"
          :page-sizes="[20, 40, 60]"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :total="total">
        </el-pagination>
      </footer>
    </div>
    <el-dialog
      :title="dialogName"
      :close-on-click-modal="false"
      :visible.sync="editDialogFlag">
      <el-form ref="form" :model="editForm" :rules="rules" label-width="140px">
        <!-- 指派负责人 -->
        <div v-if="editType == 'assign'">
          <el-form-item label="负责人：" prop="principal">
            <el-select v-model="editForm.principal">
              <el-option v-for="item in principalList" :key="item.id" :value="item.id" :label="item.memberName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成员：" prop="member">
            <el-select multiple v-model="editForm.members" value-key="id">
              <el-option v-for="item in memberList" :key="item.id" :value="{id: item.id,name: item.memberName}" :label="item.memberName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度：" prop="emergencyLevel">
            <el-select v-model="editForm.emergencyLevel">
              <el-option :value="1" :label="1"></el-option>
              <el-option :value="2" :label="2"></el-option>
              <el-option :value="3" :label="3"></el-option>
              <el-option :value="4" :label="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目：" prop="projectBelong">
            <el-select v-model="editForm.projectBelong" placeholder="请选择">
              <el-option v-for="item in projectList" :key="item.id" :value="item.id" :label="item.projectName"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 状态 -->
        <div v-if="editType == 'status'">
          <el-form-item label="状态：" prop="requirementStatus">
            <el-select v-model="editForm.requirementStatus">
              <el-option :value="1" label="未指派" disabled></el-option>
              <el-option :value="2" label="待执行"></el-option>
              <el-option :value="3" label="正执行"></el-option>
              <el-option :value="4" label="已完成"></el-option>
              <el-option :value="5" label="已取消"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="期望完成时间：" v-if="editForm.requirementStatus == 2" prop="exceptComplete">
            <el-date-picker
              v-model="editForm.exceptComplete"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="预计完成时间：" v-if="editForm.requirementStatus == 3" prop="planComplete">
            <el-date-picker
              v-model="editForm.planComplete"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="完成时间：" v-if="editForm.requirementStatus == 4" prop="realComplete">
            <el-date-picker
              v-model="editForm.realComplete"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="说明：" v-if="editForm.requirementStatus == 4" prop="descripton">
            <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 2}" v-model="editForm.descripton"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveFun">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {formatDateFun} from '@/filters'
  import {
    requrementList,
    requirementFindbyid,
    projectFindall,
    requirementUpdate,
    requirementAssign,
    updateStatus,
    memberFindByPermission
  } from "@/api/api";
  export default {
    name: 'requirementManger',
    data(){
      return{
        pickerOptions: {
          disabledDate: (time) => {
            let nowData = new Date()
            nowData = new Date(nowData.setDate(nowData.getDate() - 1))
            return time < nowData
          }
        },
        user: localStorage.user ? JSON.parse(localStorage.user) : null,
        platformPermission: localStorage.user ? JSON.parse(localStorage.user).platformPermission : null,
        editDialogFlag: false,
        editType: null,
        dialogName: null,
        userCreateList: null,
        principalList: null,
        memberList: null,
        members: null,
        editForm: {
          id: null,
          requirementStatus: null,
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
          content: null,
          descripton: null
        },
        rules: {
          file: [{ required: true, message: "请选择", trigger: "blur" }],
          requirementStatus: [{ required: true, message: "不能为空", trigger: "blur" }],
          emergencyLevel: [{ required: true, message: "不能为空", trigger: "blur" }],
          userCreate: [{ required: true, message: "不能为空", trigger: "blur" }],
          department: [{ required: true, message: "不能为空", trigger: "blur" }],
          projectBelong: [{ required: true, message: "不能为空", trigger: "blur" }],
          gmtCreate: [{ required: true, message: "不能为空", trigger: "blur" }],
          exceptComplete: [{ required: true, message: "请选择", trigger: "blur" }],
          planComplete: [{ required: true, message: "请选择", trigger: "blur" }],
          realComplete: [{ required: true, message: "请选择", trigger: "blur" }],
          principal: [{ required: true, message: "请选择", trigger: "blur" }],
          members: [{ required: true, message: "请选择", trigger: "blur" }],
          requirementTitle: [{ required: true, message: "不能为空", trigger: "blur" }],
          content: [{ required: true, message: "不能为空", trigger: "blur" }],
          descripton: [{ required: true, message: "不能为空", trigger: "blur" }],
        },
        tableData: null,
        principalId: null,
        userCreateId: null,
        requirementStatus: null,
        projectList: null,
        pageNo: 1,
        pageSize: 20,
        total: null
      }
    },
    watch:{
      editDialogFlag(val){
        if( val == false ){
          this.editType = null;
          this.dialogName = null;
          this.principalList = null;
          this.memberList = null;
          this.editForm = {
            id: null,
            requirementStatus: null,
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
            content: null,
            descripton: null
          }
        }
      }
    },
    created(){
      this.getTabelData();
      this.getEnum();
    },
    methods:{
      getTabelData(){
        let params = {
          requirementStatus: this.requirementStatus,
          userCreateId: this.userCreateId,
          principalId: this.principalId,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        requrementList(params).then(res => {
          if( res.code == 0 ){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      getEnum(){
        projectFindall().then(res => {
          if( res.code == 0 ){
            this.projectList = res.data;
          }
        })
        memberFindByPermission({permission: 3}).then(res => {
          if( res.code == 0 ){
            this.principalList = res.data;
          }
        })
        memberFindByPermission({permission: 2}).then(res => {
          if( res.code == 0 ){
            this.userCreateList = res.data;
          }
        })
      },
      saveFun(){
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.editType == 'assign') {
              let params = {
                requirementId: this.editForm.id,
                principalId: this.editForm.principal,
                members: JSON.stringify(this.editForm.members),
                emergencyLevel: this.editForm.emergencyLevel,
                projectId: this.editForm.projectBelong
              }
              requirementAssign(params).then(res => {
                if( res.code == 0 ){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.getTabelData();
                  this.editDialogFlag = false;
                }
              })
              return
            }
            if( this.editType == 'status' ){
              let params = {
                requirementId: this.editForm.id,
                status: this.editForm.requirementStatus,
                time: null,
                descripton: null
              }
              if (this.editForm.requirementStatus == 2) params.time = this.editForm.exceptComplete
              if (this.editForm.requirementStatus == 3) params.time = this.editForm.planComplete
              if (this.editForm.requirementStatus == 4) params.time = this.editForm.realComplete
              if (this.editForm.requirementStatus == 4) params.descripton = this.editForm.descripton
              updateStatus(params).then(res => {
                if( res.code == 0 ){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.getTabelData();
                  this.editDialogFlag = false;
                }
              })
            }
          }
        });
      },
      showEdit(id,type){
        if (type == 'assign') {
          this.dialogName = '指派负责人'
          // memberFindByPermission({permission: 3}).then(res => {
          //   if( res.code == 0 ){
          //     this.principalList = res.data;
          //   }
          // })
        }
        if (type == 'status') this.dialogName = '修改状态'
        this.editForm.id = id;
        requirementFindbyid({id: id}).then(res => {
          if( res.code == 0 ){
            this.editForm.requirementStatus = res.data.requirement.requirementStatus;
            this.editForm.emergencyLevel = res.data.requirement.emergencyLevel;
            this.editForm.userCreate = res.data.requirement.userCreate;
            this.editForm.department = res.data.requirement.department;
            this.editForm.projectBelong = res.data.requirement.projectBelong;
            this.editForm.gmtCreate = res.data.requirement.gmtCreate;
            this.editForm.exceptComplete =  res.data.requirement.exceptComplete ? formatDateFun(res.data.requirement.exceptComplete) : null;
            this.editForm.planComplete =  res.data.requirement.planComplete ? formatDateFun(res.data.requirement.planComplete) : null;
            this.editForm.realComplete =  res.data.requirement.realComplete ? formatDateFun(res.data.requirement.realComplete) : null;
            this.editForm.principal = res.data.requirement.principal;
            this.members = res.data.requirement.members ? JSON.parse(res.data.requirement.members) : null;
            this.editForm.requirementTitle = res.data.requirement.requirementTitle;
            this.editForm.content = res.data.requirement.content;
            this.editType = type;
            if (type == 'assign') {
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
            }
            this.editDialogFlag = true;
          }
        })
      },
      search() {
        this.pageNo = 1;
        this.getTabelData();
        this.$refs.table.bodyWrapper.scrollTop = 0;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.pageNo = 1;
        this.getTabelData();
        this.$refs.table.bodyWrapper.scrollTop = 0;
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getTabelData();
        this.$refs.table.bodyWrapper.scrollTop = 0;
      }
    }
  };
</script>
<style lang="scss">
  @import "../../styles/common.scss";
  .requirementManger-container {
    @include layout(1);
    // @include dialog;
  }
</style>
