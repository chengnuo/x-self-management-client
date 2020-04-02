<!-- 用户模块-列表 -->
<template>
  <div class="healthMedicineList">
    <el-form :inline="true"
             ref="form"
             :model="listQuery"
             label-width="80px"
             @submit.native.prevent="onSubmit">
      <el-form-item label="名称">
        <el-input v-model.trim="listQuery.name"
                  size="small"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   native-type="submit">查询</el-button>
      </el-form-item>
      <div class="fr">
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="handleCreate">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="handleDownload">导出</el-button>

        </el-form-item>
      </div>
    </el-form>
    <div class="block">
      <el-pagination class="paging"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.offset"
                     :page-sizes="pageSizes"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total" />
    </div>
    <!-- <el-table :data="list"
              style="width: 100%">
      <el-table-column label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑</el-button>
          <el-popconfirm title="这是一段内容确定删除吗？"
                         @onConfirm="handleDestory(scope.row)">
            <el-button slot="reference"
                       type="text"
                       size="small">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="名称"
                       width="100" />
      <el-table-column prop="description"
                       label="描述"
                       width="500">
        <template slot-scope="scope">
          <div :id="`description${scope.row.id}`">
            {{scope.row.description}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="url"
                       label="地址">
        <template slot-scope="scope">
          <div>
            <a :href="scope.row.url"
               target="_blank">
              <el-button slot="reference"
                         type="text"
                         size="small">{{scope.row.url}}
              </el-button>
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt"
                       label="新增时间" />
      <el-table-column prop="updatedAt"
                       label="更新时间" />
    </el-table> -->


    <div class="box-card-layout">

      <el-row :gutter="20">
        <el-col :span="24"
                v-for="(item, index) in list"
                :key="item.id">
          <el-card class="box-card"
                   
                   >
            <div slot="header"
                 class="clearfix">
              <span>{{item.name}}</span>
              <div style="float: right; padding: 3px 0" >
                <el-button type="text"
                           size="small"
                           id="copyBtn"
                           data-clipboard-action="copy"
                           @click="handleCopy(item)">复制</el-button>
                <el-button type="text"
                           size="small"
                           @click="handleUpdate(item)">编辑</el-button>
                <el-popconfirm title="这是一段内容确定删除吗？"
                               @onConfirm="handleDestory(item)">
                  <el-button slot="reference"
                             type="text"
                             size="small">删除</el-button>
                </el-popconfirm>
              </div>
            </div>
            <div class="text item" :id="`boxCard${item.id}`">
              markdown查看
              <!-- <p v-for="(descriptionItem, descriptionIndex) in item.description.split('\n')"
                 :key="descriptionIndex">
                {{descriptionItem}}
              </p> -->
              
            </div>
            <div>
              参考地址：
              <div v-for="(item, index) in item.urlSplit" :key="index">
                <el-link :href="item" type="primary" target="_blank">{{item}}</el-link>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>

    <div class="block">
      <el-pagination class="paging"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.offset"
                     :page-sizes="pageSizes"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total" />
    </div>
    <!-- 编辑 -->
    <UserEditor :visible.sync="dialogUserEditor"
                @init="init"
                :listItem="listItem" />


    

  </div>
</template>

<script>


import { index, destroy, show } from '@/api/healthMedicine'
import UserEditor from '@/components/HealthMedicine/Editor'
import Editor from 'tui-editor'
import Viewer from 'tui-editor/dist/tui-editor-Viewer';
import ClipboardJS from 'clipboard';


export default {
  name: 'HealthMedicineList',
  components: {
    UserEditor,
    // MarkdownEditor,
  },
  data() {
    return {
      list: [],
      listItem: {},
      total: 0,
      pageSizes: [10, 100, 200, 300, 400],
      // 请求参数
      listQuery: {
        offset: 1,
        limit: 10,
        name: '',
      },
      dialogUserEditor: false,
      filename: 'healthMedicine',
      html: '',
      languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
      },
    }
  },
  computed: {
    language() {
      return this.languageTypeList['zh']
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.fetchIndex(() => {
        console.log(this.list)
        setTimeout(() => {
          this.list.map((item) => {
            var editor = new Viewer({
              el: document.querySelector(`#boxCard${item.id}`),
              height: '300px',
              initialValue: item.description,
            });
            return true
          })

        }, 1);
      })
    },
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml()
      console.log(this.html)
    },
    fetchIndex(callback) {
      this.listLoading = true
      const query = this.$route.query || {}
      // 页码当前页设置
      if (query.offset) {
        this.listQuery.offset = Number(query.offset) || 1
      }
      // 页码每页条数设置，做判断是为了不随便搜索
      if (this.pageSizes.includes(Number(query.limit))) {
        this.listQuery.limit = Number(query.limit) || 10
      }
      const listQuery = Object.assign({}, this.listQuery, {
        offset: query.offset,
        limit: query.limit,
      })
      index(listQuery).then(response => {
        this.list = response.data.list.map((item)=>{
          return {
            ...item,
            urlSplit: item.url.split(',')
          }
        })
        this.total = response.data.total;
        this.listLoading = false
        callback && callback();
      })
    },
    // 分页大小
    handleSizeChange(val) {
      this.listQuery.offset = 1
      this.listQuery.limit = val
      this.$router.push({
        query: Object.assign({}, this.listQuery, {
          offset: 1,
          limit: val,
        })
      })
      this.init()
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.offset = val
      this.$router.push({
        query: Object.assign({}, this.listQuery, {
          offset: val,
        })
      })
      this.init()
    },
    // 查询
    onSubmit(e) {
      e.preventDefault();
      this.$router.push({
        query: Object.assign({}, this.listQuery)
      })
      this.init()
    },
    // 新增
    handleCreate() {
      this.dialogUserEditor = true;
      this.listItem = {};
    },
    // 更新
    handleUpdate(row) {
      this.dialogUserEditor = true;
      this.listItem = row;
    },
    // 删除-逻辑删除
    handleDestory(row) {
      const listQuery = Object.assign({}, {
        id: row.id,
        deletedAt: 1,
      })
      destroy(listQuery).then(response => {
        this.$notify({
          type: 'error',
          title: '系统提示',
          message: '删除成功',
        });
        this.init();
      })
    },

    handleDownload() {
      this.downloadLoading = true
      import('../../../vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '名称', '描述', '地址']
        const filterVal = ['id', 'name', 'description', 'url']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 复制
    handleCopy(item) {
      let self = this;
      new ClipboardJS('#copyBtn', {
        text: function (trigger) {
          console.log('trigger', trigger)
          return item.description;
        }
      });
      this.$notify.success({
        title: '提示',
        message: '复制成功'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.healthMedicineList {
  padding: 20px;
  .box-card-layout{
    margin-top: 20px;
  }
  .box-card{
    margin-bottom: 20px;
  }
}
</style>
