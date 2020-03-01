<!-- 用户模块-编辑 -->
<template>
  <div class="userEditor">
    <el-dialog :title="`${listItem.id?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               width="600px"
               :before-close="handleClose"
               @open="init"
               >
      <div>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 label-width="100px"
                 class="demo-ruleForm"
                 size="small"
          >
          <el-form-item label="用户名"
                        prop="name">
            <el-input v-model="ruleForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号码"
                        prop="phone">
            <el-input v-model="ruleForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="头像"
                        prop="avatarUrl">
            <el-input v-model="ruleForm.avatarUrl" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>


import { create, update } from '@/api/user'

export default {
  name: 'UserEditor',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    listItem: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      // dialogVisible: true
      ruleForm: {
        name: '',
        phone: '',
        avatarUrl: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
        ],
        avatarUrl: [
          { required: false, message: '请上传头像', trigger: 'change' },
        ],
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },

      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    // this.fetchData()
  },
  updated() {
    console.log('visible', this.dialogVisible)
    console.log('listItem', this.listItem)
  },
  methods: {
    init() {
      // this.fetchData()
      this.initData();
    },
    // 重置
    initData(){
      this.ruleForm = Object.assign({}, this.ruleForm, {
        name: this.listItem.name,
        phone: this.listItem.phone,
        avatarUrl: this.listItem.avatarUrl,
      })
    },
    // 清除数据
    clearData(){
      this.ruleForm = Object.assign({},{
        name: '',
        phone: '',
        avatarUrl: '',
      })
    },
    // 创建api
    apiCreate(){
      let ruleForm = Object.assign({}, this.ruleForm)
      create(ruleForm).then(response => {
        this.handleClose(); // 关闭弹出层
        this.$emit('fetchData'); // 刷新列表
      })
    },
    // 更新api
    apiUpdate(){
      let ruleForm = Object.assign({}, this.ruleForm, {
        id: this.listItem.id,
      })
      update(ruleForm).then(response => {
        this.handleClose(); // 关闭弹出层
        this.$emit('fetchData'); // 刷新列表
      })
    },
    // 关闭弹出层
    handleClose() {
      this.dialogVisible = false;
    },
    // 创建
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.listItem && this.listItem.id){
            this.apiUpdate();
          }else{
            this.apiCreate();
          }
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.clearData();
      this.$refs[formName].resetFields();
    }
  },
}
</script>

<style lang="scss" scoped>
.userEditor {
  padding: 20px;
}
</style>
