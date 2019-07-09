<template>
  <div class="staffManagement-container">
    <div class="Breadcrumb">
      <span>人员管理</span>
    </div>
    <div class="block">
      <header>
        <div class="row">
          <el-button type="primary" icon="icon-da-dingzhishuju" @click="addDepartment()">添加部门</el-button>
          <el-button type="primary" icon="icon-da-dingzhishuju" @click="addStaff()">添加成员</el-button>
          <el-button type="primary" icon="icon-da-dingzhishuju" @click="batchImport()">批量导入成员</el-button>
        </div>
        <div class="row">
           <div class="query-item">
            <label>权限：</label>
            <el-select v-model="searchForm.platformPermission" clearable  placeholder="请选择权限">
              <el-option label="管理员权限" value="1"></el-option>
              <!-- <el-option label="负责人权限" value="2"></el-option> -->
              <el-option label="提需求权限" value="2"></el-option>
              <el-option label="成员权限" value="3"></el-option>
            </el-select>
          </div>
          <div class="query-item">
            <label>部门：</label>
            <el-select v-model="searchForm.departmentId" clearable  placeholder="请选择部门">
              <el-option v-for="item in DepartmentList" :value="item.id" :label="item.departName" :key="item.id"></el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="" @click="clear">清空</el-button>
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
            prop="departName"
            label="部门"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="id"
            label="用户id"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="memberName"
            label="姓名"
            min-width="150">
          </el-table-column>
          <el-table-column
            label="权限"
            min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.platformPermission===1">管理员权限</span>
              <!-- <span v-if="scope.row.platformPermission===2">负责人权限</span> -->
              <span v-if="scope.row.platformPermission===2">提需求权限</span>
              <span v-if="scope.row.platformPermission===3">成员权限</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="登录账号"
            min-width="150">
          </el-table-column>
          <el-table-column
            label="密码"
            min-width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="ResetPwd(scope.row.id)" :disabled="scope.row.platformPermission== 1">设为默认</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="人员管理"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="Delete(scope.row.id)" :disabled="scope.row.platformPermission== 1">删除</el-button>
              <el-button type="text" @click="UpDate(scope.row.id)" :disabled="scope.row.platformPermission== 1">修改</el-button>
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
    <!-- 批量导入start -->
    <el-dialog
      title="批量导入"
      :close-on-click-modal="false"
      :visible.sync="batchImportFlag"
      @close="closeImportForm">
      <el-form ref="addFormImport" :model="addFormImport" :rules="rulesAddFormImport" label-width="140px">
        <el-form-item label="所属部门：" prop="DepartmentId">
          <el-select v-model="addFormImport.DepartmentId">
            <el-option v-for="item in DepartmentList" :value="item.id" :label="item.departName" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件：" prop="file">
          <el-upload
            class="upload-demo"
            action=""
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="fileList"
            :http-request="upload"
            accept=".xlsx, .xls"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.xlsx, .xls文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFun">提 交</el-button>
        <el-button @click="batchImportFlag = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 批量导入end -->
    <!-- 添加部门start -->
    <el-dialog
      title="添加部门"
      :close-on-click-modal="false"
      :visible.sync="addDepartmentFlag"
      @close="closeForm">
      <el-form ref="form" :model="form" :rules="rulesForm" label-width="140px">
        <el-form-item label="部门名称：" prop="departName">
          <el-input v-model="form.departName "></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDepartmentSave">提 交</el-button>
        <el-button @click="addDepartmentFlag = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加成员start -->
    <el-dialog
      title="添加/修改成员"
      :close-on-click-modal="false"
      :visible.sync="addStaffFlag"
      @close="closeAddForm">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="140px">
        <el-form-item label="所属部门：" prop="departmentId">
          <el-select v-model="addForm.departmentId" placeholder="请选择部门">
            <el-option v-for="item in DepartmentList" :value="item.id" :label="item.departName" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名：" prop="memberName">
          <el-input v-model="addForm.memberName "></el-input>
        </el-form-item>
        <el-form-item label="登录账号：" prop="userName">
          <el-input v-model="addForm.userName "></el-input>
        </el-form-item>
        <el-form-item label="用户权限：" prop="platformPermission">
          <el-select v-model="addForm.platformPermission" placeholder="请选择权限">
            <el-option v-for="item in pfPermissionList" :value="item.id" :label="item.PermissionName" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="staffSave">提 交</el-button>
        <el-button @click="addStaffFlag = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加成员end -->
  </div>
</template>
<script>
  import {
    departmentAdd,
    deleteMember,
    setdefaultpswd,
    updatemember,
    departmentList,
    memberAdd,
    findMember,
    findMemberById,
    batchAdd
  } from "@/api/api";
  export default {
    name: 'staffManagement',
    data(){
      return{
        // 权限
        pfPermissionList:[
          // {id:2,PermissionName:'负责人权限'},
          {id:2,PermissionName:'提需求权限'},
          {id:3,PermissionName:'成员权限'}
        ],
        // 查询参数
        searchForm:{
          platformPermission:null,
          departmentId:null
        },
        DepartmentList:[],
        fileList: [],
        addDepartmentFlag: false,
        addStaffFlag:false,
        batchImportFlag:false,
        // 添加修改
        addForm: {
          departmentId:null,
          memberName: null,
          userName: null,
          platformPermission:null,
          id:null
        },
        // 批量导入部门id
        addFormImport:{
          DepartmentId:null,
          file:null,
        },
        form:{
          departName: null
        },
        // 添加成员表单验证
        rules: {
          departmentId: [{ required: true, message: "请选择所属部门", trigger: "change" }],
          userName: [{ required: true, message: "不能为空", trigger: "blur" }],
          memberName: [{ required: true, message: "不能为空", trigger: "blur" }],
          platformPermission: [{ required: true, message: "请选择权限等级", trigger: "change" }],
        },
        // 添加部门表单验证
        rulesForm: {
          departName: [{ required: true, message: "请填写部门名称", trigger: "blur" }]
        },
        // 批量导入表单验证
        rulesAddFormImport: {
          DepartmentId: [{ required: true, message: "请选择所属部门", trigger: "change" }],
          file: [{ required: true, message: "请选择文件！", trigger: "change" }]
        },
        tableData: null,
        pageNo: 1,
        pageSize: 20,
        total: null
      }
    },
    created(){
      this.getTabelData();
      this.getDepartmentList()
    },
    methods:{
      // 获取列表数据
      getTabelData(){
        let params = {
          platformPermission:this.searchForm.platformPermission,
          departmentId:this.searchForm.departmentId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,

        }
        findMember(params).then(res => {
          if( res.code == 0 ){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      // 清空搜索栏
      clear(){
        this.searchForm.platformPermission=null,
        this.searchForm.departmentId=null,
        this.getTabelData();
      },
      // 弹框关闭清空表单值
      closeAddForm(){
        this.$refs['addForm'].resetFields();
        this.addForm.id=null;
      },
      closeImportForm(){
        this.$refs['addFormImport'].resetFields();
        this.fileList=[];
      },
      closeForm(){
        this.$refs['form'].resetFields();
      },
      // 获取部门列表
      getDepartmentList(){
        departmentList().then(res=>{
          if(res.code==0){
            this.DepartmentList =res.data
          }
        })
      },
      // 显示添加部门弹框
      addDepartment(){
        this.addDepartmentFlag= true;
      },
      // 显示添加成员弹框
      addStaff(){
        this.addStaffFlag= true;
        this.getDepartmentList()
      },
      // 获取excel
      upload(file){
        this.addFormImport.file= file.file
        this.$refs['addFormImport'].validateField('file');
      },
      // 批量导入成员
      batchImport(){
        this.batchImportFlag = true;
        this.getDepartmentList()
      },
      // 提交批量导入成员
      saveFun(){
        this.$refs.addFormImport.validate(valid => {
          if (valid) {
            let params = new FormData();
            let config = {
                headers: { "Content-Type": "multipart/form-data" },
                transformRequest: [function (data) {
                  return data;
                }]
              };
            params.append("departmentId", this.addFormImport.DepartmentId);
            params.append("file",this.addFormImport.file)
            batchAdd(params,config).then(res=>{
              if(res.code==0){
                this.$message({
                  message: '导入成功！',
                  type: 'success'
                });
                this.batchImportFlag = false;
                this.getTabelData();
              }
            })
          }
        })
      },
      handleRemove(){
        this.addFormImport.file = null;
      },
      handleExceed(){
        this.$message({
          message: `一次只能上传一个文件，请先删除之前的文件再重新选择文件！`,
          type: 'warning',
          duration: 5000
        });
      },
      // 密码设为默认
      ResetPwd(id){
        this.$confirm('您确定要重置该用户的密码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            setdefaultpswd({memberId:id}).then(res=>{
              if(res.code==0){
                this.$message({
                  message:"设置成功！",
                  type:"success"
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          });
        });
      },
      // 添加部门
      addDepartmentSave(){
        this.$refs.form.validate(valid => {
          if (valid) {
            let params = {
              departName:this.form.departName,
            }
            departmentAdd(params).then(res=>{
              if(res.code==0){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.getTabelData();
                this.getDepartmentList()
                this.form.departName=null;
                this.addDepartmentFlag = false;
              } else{
                this.form.departName=null;
              }
            })
          }
        })
      },
      // 修改成员弹框
      UpDate(id){
        this.addStaffFlag = true;
        this.addForm.id= id
        findMemberById({id:id}).then(res=>{
          if(res.code==0){
            this.addForm.departmentId = res.data.departmentId,
            this.addForm.memberName = res.data.memberName,
            this.addForm.userName = res.data.userName,
            this.addForm.platformPermission = res.data.platformPermission
          }
        })
      },
      // 清空成员表单信息
      clearAddForm(){
        this.addForm.departmentId = null,
        this.addForm.memberName = null,
        this.addForm.userName = null,
        this.addForm.platformPermission = null
        this.addForm.id=null
      },
      // 添加/修改成员提交
      staffSave(){
        this.$refs.addForm.validate(valid => {
          if (valid) {
            if(this.addForm.id!=null){
              updatemember(this.addForm).then(res=>{
                if( res.code == 0 ){
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.getTabelData();
                  this.clearAddForm();
                  this.addStaffFlag = false;
                }
              })
            } else{
              memberAdd(this.addForm).then(res => {
                if( res.code == 0 ){
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.getTabelData();
                  this.clearAddForm();
                  this.addStaffFlag = false;
                }
              })
            }
          }
        });
      },
      // 删除成员
      Delete(id){
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMember({memberId:id}).then(res => {
            if( res.code == 0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getTabelData();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
  .staffManagement-container {
    @include layout(2);
  }
</style>
