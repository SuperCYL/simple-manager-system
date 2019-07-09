<template>
  <div class="requirementAdd-container">
    <div class="Breadcrumb">
      <span></span>
      <router-link to="/requirementManger">需求列表</router-link><b> > </b><span>新增需求</span>
    </div>
    <div class="block">
      
    </div>
  </div>
</template>
<script>
  import {
    datastorePage,
    datastoreSave,
    datastoreLog,
    datastoreProcess,
    supplierList,
    datastoreDel
  } from "@/api/api";
  export default {
    name: 'requirementAdd',
    data(){
      return{
        fileList: [],
        supplierList: null,
        addDialogFlag: false,
        addForm: {
          supplierId: null,
          file: null
        },
        rules: {
          supplierId: [{ required: true, message: "请选择供应商", trigger: "blur" }],
          file: [{ required: true, message: "请选择文件", trigger: "blur" }],
          orderId: [{ required: true, message: "不能为空", trigger: "blur" }],
        },
        datastoreProcessFlag: false,
        form:{
          id: null,
          orderId: null
        },
        datastoreLogFlag: false,
        datastoreLogData: null,
        tableData: null,
        status: null,
        pageNo: 1,
        pageSize: 20,
        total: null
      }
    },
    watch:{
      addDialogFlag(val){
        if( val == false ){
          this.fileList = [];
          this.addForm = {
            supplierId: null,
            file: null
          }
        }
      }
    },
    created(){
      // this.getTabelData();
    },
    methods:{
      getTabelData(){
        let params = {
          status: this.status,
          pageNum: this.pageNo,
          pageSize: this.pageSize
        }
        datastorePage(params).then(res => {
          if( res.code == 0 ){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      getSupplierList(){
        supplierList({status: 1}).then(res => {
          if( res.code == 0 ){
            this.addDialogFlag = true;
            this.supplierList = res.data;
          }
        })
      },
      saveFun(){
        this.$refs.form.validate(valid => {
          if (valid) {
            let formData = new FormData();
            formData.append('supplierId',this.addForm.supplierId);
            formData.append('file',this.addForm.file.file);
            datastoreSave(formData).then(res => {
              if( res.code == 0 ){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getTabelData();
                this.addDialogFlag = false;
              }
            })
          }
        });
      },
      datastoreLogFun(id){
        datastoreLog({id: id}).then(res => {
          if(res.code == 0){
            
            this.datastoreLogData = res.data.logsDes;
            if( this.datastoreLogData ){
              this.datastoreLogFlag = true;
            }else{
              this.$message({
                type: 'warning',
                message: '暂无日志!',
                duration: 4000
              });
            }
          }
        })
      },
      datastoreProcessFun(id){
        this.datastoreProcessFlag = true;
        this.form.id = id;
      },
      datastoreProcessSaveFun(){
        this.$refs.datastoreProcessForm.validate(valid => {
          if (valid) {
            datastoreProcess(this.form).then(res => {
              if( res.code == 0 ){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.getTabelData();
                this.datastoreProcessFlag = false;
              }
            })
          }
        });
      },
      handleExceed(){
        this.$message({
          message: `一次只能上传一个文件，请先删除之前的文件再重新选择文件！`,
          type: 'warning',
          duration: 5000
        });
      },
      datastoreDelFun(id){
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          datastoreDel([id]).then(res => {
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
      handleRemove(){
        this.addForm.file = null;
      },
      fileUpload(params){
        this.addForm.file = params;
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
  .requirementAdd-container {
    @include layout(1);
    // @include dialog;
  }
</style>
