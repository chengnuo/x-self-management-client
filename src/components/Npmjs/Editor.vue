<!-- 用户模块-编辑 -->
<template>
  <div class="npmjsEditor">
    <el-dialog :title="`${listItem.id?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               width="600px"
               :before-close="handleClose"
               @open="init">
      <div>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 label-width="100px"
                 class="demo-ruleForm"
                 size="small">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="ruleForm.name"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="description">
            <el-input v-model="ruleForm.description"
                      clearable
                      type="textarea"
                      :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="url"
                        prop="url">
            <el-input v-model="ruleForm.url"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { create, update } from '@/api/npmjs'

export default {
  name: 'NpmjsEditor',
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
      ruleForm: {
        name: '',
        description: '',
        url: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' },
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
  },
  methods: {
    init() {
      this.initData();
    },
    // 重置
    initData() {
      this.ruleForm = Object.assign({}, this.ruleForm, {
        name: this.listItem.name,
        description: this.listItem.description,
        url: this.listItem.url,
      })
    },
    // 清除数据
    clearData() {
      this.ruleForm = Object.assign({}, {
        name: '',
        description: '',
        url: '',
      })
    },
    // 创建api
    apiCreate() {
      let ruleForm = Object.assign({}, this.ruleForm)
      create(ruleForm).then(response => {
        this.handleClose(); // 关闭弹出层
        this.$emit('fetchIndex'); // 刷新列表
      })
    },
    // 更新api
    apiUpdate() {
      let ruleForm = Object.assign({}, this.ruleForm, {
        id: this.listItem.id,
      })
      update(ruleForm).then(response => {
        this.handleClose(); // 关闭弹出层
        this.$emit('fetchIndex'); // 刷新列表
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
          if (this.listItem && this.listItem.id) {
            this.apiUpdate();
          } else {
            this.apiCreate();
          }
        } else {
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
.npmjsEditor {
  padding: 20px;
}
</style>
