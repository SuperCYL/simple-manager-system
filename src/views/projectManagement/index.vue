<template>
  <div class="projectManagement-container">
    <div class="Breadcrumb">
      <span>添加项目</span>
    </div>
    <div class="block">
      <header>
        <div class="row">
          <el-button type="primary" icon="icon-da-dingzhishuju" @click="addProject">添加项目</el-button>
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
            prop="projectName"
            label="项目名称"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="createUserName"
            label="创建人"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            min-width="200">
            <template slot-scope="scope">
               {{ scope.row.gmtCreate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="upDateProject(scope.row.id)">修改</el-button>
              <el-button type="text" @click="deleteProject(scope.row.id)">删除</el-button>
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
      title="新增/修改"
      :close-on-click-modal="false"
      :visible.sync="addDialogFlag"
      @close="close">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="140px">
        <el-form-item label="项目名称：" prop="projectName">
          <el-input v-model="addForm.projectName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFun">提 交</el-button>
        <el-button @click="addDialogFlag = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    searchProjectList,
    projectDelete,
    projectUpdate,
    projectAdd,
    searchProjectById
  } from "@/api/api";
  export default {
    name: 'projectManagement',
    data(){
      return{
        addDialogFlag:false,
        tableData: null,
        total: null,
        pageNo: 1,
        pageSize: 20,
        addForm:{
          projectName:null,
          id:null
        },
        rules: {
          projectName: [{ required: true, message: "不能为空", trigger: "blur" }]
        },
      }
    },
    created(){
      this.getTabelData();
    },
    methods:{
      // 关闭弹框
      close(){
        this.$refs['addForm'].resetFields();
        this.addForm.id=null
      },
      clear(){
        this.addForm.projectName=null
        this.addForm.id=null
      },
      addProject(){
        this.addDialogFlag= true
      },
      // 获取列表数据
      getTabelData(){
        let params = {
          pageNo:this.pageNo,
          pageSize:this.pageSize
        }
        searchProjectList(params).then(res => {
          if( res.code == 0 ){
            this.tableData = res.data.list;
            this.total =res.data.total;
          }
        })
      },
      // 修改
      upDateProject(id){
        this.addDialogFlag = true;
        this.addForm.id= id
          searchProjectById({id:this.addForm.id}).then(res=>{
            if(res.code== 0){
              this.addForm.projectName =res.data.projectName
            }
          })
      },
      // 保存
      saveFun(){
        this.$refs.addForm.validate(valid => {
          if (valid) {
            if(this.addForm.id!=null){
              projectUpdate(this.addForm).then(res=> {
                if(res.code == 0){
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.getTabelData();
                  this.addDialogFlag= false;
                  this.clear();
                }
              })
            }else{
              projectAdd({projectName:this.addForm.projectName}).then(res=> {
                if(res.code == 0){
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.getTabelData();
                  this.addDialogFlag= false;
                  this.clear();
                }
              })
            }
          }
        })
      },
      // 删除
      deleteProject(id){
        this.$confirm('您确定要删除该项目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          projectDelete({id:id}).then(res => {
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
  .projectManagement-container {
    @include layout(1);
    // @include dialog;
  }
</style>
