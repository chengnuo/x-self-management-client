<!-- 用户模块-编辑 -->
<template>
  <div class="softwareTestEditor">
    <el-dialog :title="`${listItem.id?'编辑':'新增'}`"
               :visible.sync="dialogVisible"
               width="100%"
               height="100%"
               :before-close="handleClose"
               @open="init"
               class="dialog"
               >
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
          <!-- <el-form-item label="描述"
                        prop="description">
            <el-input v-model="ruleForm.description"
                      clearable
                      type="textarea"
                      :rows="3"></el-input>
          </el-form-item> -->
          <el-form-item label="描述" prop="description">
            <div class="editor-container">
              <!-- <el-tag class="tag-title">
                I18n:
              </el-tag>
              <el-alert :closable="false"
                        title="You can change the language of the admin system to see the effect"
                        type="success" /> -->
              <MarkdownEditor ref="markdownEditor"
                              v-model="ruleForm.description"
                              :language="language"
                              height="580px"
                              :options="{
                                exts: ['scrollSync']
                              }"
                               />
            </div>

            <!-- <el-button style="margin-top:80px;"
                       type="primary"
                       icon="el-icon-document"
                       @click="getHtml">
              Get HTML
            </el-button>
            <div v-html="html" /> -->
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
import { create, update } from '@/api/softwareTest'

import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'SoftwareTestEditor',
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
  components: {
    MarkdownEditor,
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
      },
      html: '',
      languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
      },
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
    },
    language() {
      return this.languageTypeList['zh']
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
        this.$emit('init'); // 刷新列表
      })
    },
    // 更新api
    apiUpdate() {
      let ruleForm = Object.assign({}, this.ruleForm, {
        id: this.listItem.id,
      })
      update(ruleForm).then(response => {
        this.handleClose(); // 关闭弹出层
        this.$emit('init'); // 刷新列表
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
    },
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml()
      console.log(this.html)
    },
  },
}
</script>

<style lang="scss" scoped>
.softwareTestEditor {
  padding: 20px;
  .dialog{
    /deep/ .el-dialog{
      margin-top: 0 !important;
      height: 100% !important;
    }
  }
}
</style>
